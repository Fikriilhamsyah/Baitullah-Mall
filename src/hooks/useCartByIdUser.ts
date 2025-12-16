// hooks/useCartByIdUser.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { ICartByIdUser } from "../types/ICart";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";

const MIN_FETCH_INTERVAL_MS = 3000;
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 500;

export const useCartByIdUser = () => {
  const [cartByIdUser, setCartByIduser] = useState<ICartByIdUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuth((state) => state.user);

  const lastFetchAtRef = useRef<Record<number, number>>({});
  const currentFetchRef = useRef<Record<number, Promise<void> | null>>({});

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const shouldThrottle = (uid?: number) => {
    if (!uid) return false;
    const last = lastFetchAtRef.current[uid] ?? 0;
    return Date.now() - last < MIN_FETCH_INTERVAL_MS;
  };

  const getCartByIdUser = useCallback(async (uid?: number) => {
    if (!uid) {
      setCartByIduser([]);
      setLoading(false);
      setError(null);
      return;
    }

    if (shouldThrottle(uid)) {
      const ongoing = currentFetchRef.current[uid];
      if (ongoing) return ongoing;
      return;
    }

    if (currentFetchRef.current[uid]) {
      return currentFetchRef.current[uid];
    }

    // 🔐 soft lock: prevent burst BEFORE request
    lastFetchAtRef.current[uid] = Date.now();

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
            setError(null);
            break;
          } catch (err: any) {
            attempts += 1;
            const status = err?.response?.status;

            // 🟡 EXPECTED: Rate limit
            if (status === 429 && attempts <= MAX_RETRIES) {
              const retryAfter = err?.response?.headers?.["retry-after"];
              let delay = BASE_BACKOFF_MS * Math.pow(2, attempts - 1);

              if (retryAfter) {
                const parsed = Number(retryAfter);
                if (!Number.isNaN(parsed) && parsed > 0) {
                  delay = Math.max(delay, parsed * 1000);
                }
              }

              await wait(delay + Math.floor(Math.random() * 200));
              continue;
            }

            // 🔴 REAL error
            let msg = "Terjadi kesalahan saat mengambil keranjang";
            if (err instanceof Error) msg = err.message;

            setError(msg);

            if (status !== 429) {
              console.error("useCartByIdUser error:", err);
            }

            break;
          }
        }
      } finally {
        setLoading(false);
        currentFetchRef.current[uid] = null;
      }
    })();

    currentFetchRef.current[uid] = job;
    return job;
  }, []);

  useEffect(() => {
    if (!user) {
      setCartByIduser([]);
      setLoading(false);
      setError(null);
      return;
    }

    void getCartByIdUser(user.id);

    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent)?.detail;
      const uid = detail?.userId ?? detail?.user_id ?? user.id;
      if (Number(uid) === Number(user.id)) {
        void getCartByIdUser(user.id);
      }
    };

    window.addEventListener("cart:updated", handler as EventListener);
    return () => {
      window.removeEventListener("cart:updated", handler as EventListener);
    };
  }, [user, getCartByIdUser]);

  const refetch = () => {
    if (!user) return;
    return getCartByIdUser(user.id);
  };

  return { cartByIdUser, loading, error, refetch };
};
