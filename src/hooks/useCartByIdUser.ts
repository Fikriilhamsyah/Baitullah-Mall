// hooks/useCartByIdUser.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { ICartByIdUser } from "../types/ICart";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";

/**
 * Robust hook to fetch cart by user id with:
 * - throttle (min interval between fetches)
 * - exponential backoff on 429 (and limited retries)
 * - listens to window 'cart:updated' CustomEvent to trigger refetch safely
 */

const MIN_FETCH_INTERVAL_MS = 3000; // minimal interval between fetches for same user
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 500; // initial backoff

export const useCartByIdUser = () => {
  const [cartByIdUser, setCartByIduser] = useState<ICartByIdUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuth((state) => state.user);

  // store last fetch time per user (in-memory)
  const lastFetchAtRef = useRef<Record<number, number>>({});
  // pointer to current fetch promise so concurrent callers can await it rather than fire multiple
  const currentFetchRef = useRef<Record<number, Promise<void> | null>>({});

  const shouldThrottle = (uid: number | undefined) => {
    if (!uid) return false;
    const last = lastFetchAtRef.current[uid] ?? 0;
    return Date.now() - last < MIN_FETCH_INTERVAL_MS;
  };

  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const getCartByIdUser = useCallback(
    async (uid?: number) => {
      if (!uid) {
        setCartByIduser([]);
        setLoading(false);
        setError(null);
        return;
      }

      // throttle: if last fetch recently, skip and return quickly
      if (shouldThrottle(uid)) {
        // if there's an ongoing fetch for this uid, return that promise
        const ongoing = currentFetchRef.current[uid];
        if (ongoing) return ongoing;
        return;
      }

      // if there's an ongoing request for this uid, return it instead of spawning another
      if (currentFetchRef.current[uid]) {
        return currentFetchRef.current[uid];
      }

      const job = (async () => {
        try {
          setLoading(true);
          setError(null);

          let attempts = 0;
          while (true) {
            try {
              const response = await api.getCartByIdUser(uid);
              const result = response.data as ApiResponse<ICartByIdUser[]>;

              setCartByIduser(Array.isArray(result.data) ? result.data : []);
              lastFetchAtRef.current[uid] = Date.now();
              setError(null);
              break; // success
            } catch (err: any) {
              attempts += 1;

              // If axios error and 429, do exponential backoff respecting Retry-After header
              const status = err?.response?.status;
              if (status === 429 && attempts <= MAX_RETRIES) {
                // try to respect Retry-After header if present (in seconds)
                const retryAfter = err?.response?.headers?.["retry-after"];
                let delay = BASE_BACKOFF_MS * Math.pow(2, attempts - 1); // exponential
                if (retryAfter) {
                  const parsed = Number(retryAfter);
                  if (!Number.isNaN(parsed) && parsed > 0) delay = Math.max(delay, parsed * 1000);
                }
                // add small jitter
                const jitter = Math.floor(Math.random() * 200);
                await wait(delay + jitter);
                continue; // retry
              }

              // For other statuses, or if max retries exceeded -> surface error
              let msg = "Terjadi kesalahan saat mengambil keranjang";
              if (err instanceof Error) msg = err.message;
              setError(msg);
              console.error("useCartByIdUser getCartByIdUser error:", err);
              break;
            }
          }
        } finally {
          setLoading(false);
          currentFetchRef.current[uid] = null;
        }
      })();

      // register current fetch
      currentFetchRef.current[uid] = job;
      return job;
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    if (!mounted) return;

    if (!user) {
      setCartByIduser([]);
      setLoading(false);
      setError(null);
    } else {
      // initial fetch
      void getCartByIdUser(user.id);
    }

    const handler = (ev: Event) => {
      try {
        const detail = (ev as CustomEvent)?.detail;
        const userIdFromEvent = detail?.userId ?? detail?.user_id ?? null;

        if (user && userIdFromEvent != null) {
          if (Number(user.id) === Number(userIdFromEvent)) {
            void getCartByIdUser(user.id);
          }
        } else {
          if (user) void getCartByIdUser(user.id);
        }
      } catch (e) {
        if (user) void getCartByIdUser(user.id);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("cart:updated", handler as EventListener);
    }

    return () => {
      mounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener("cart:updated", handler as EventListener);
      }
    };
  }, [user, getCartByIdUser]);

  const refetch = () => {
    if (!user) return;
    return getCartByIdUser(user.id);
  };

  return { cartByIdUser, loading, error, refetch };
};
