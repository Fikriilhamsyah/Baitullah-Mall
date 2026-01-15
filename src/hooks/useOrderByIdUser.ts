// hooks/useOrderByIdUser.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { Order } from "@/types/IOrder";

const MIN_FETCH_INTERVAL_MS = 3000;
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 500;

export const useOrderByIdUser = () => {
  const [ordersByIdUser, setOrdersByIdUser] = useState<Order[]>([]);
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

  const getOrderByIdUser = useCallback(async (uid?: number) => {
    if (!uid) {
      setOrdersByIdUser([]);
      setLoading(false);
      setError(null);
      return;
    }

    // throttle
    if (shouldThrottle(uid)) {
      const ongoing = currentFetchRef.current[uid];
      if (ongoing) return ongoing;
      return;
    }

    // prevent duplicate request
    if (currentFetchRef.current[uid]) {
      return currentFetchRef.current[uid];
    }

    // soft lock
    lastFetchAtRef.current[uid] = Date.now();

    const job = (async () => {
      try {
        setLoading(true);
        setError(null);

        let attempts = 0;

        while (true) {
          try {
            const response = await api.getOrderByIdUser(uid);
            const result = response.data as ApiResponse<Order[]>;

            setOrdersByIdUser(Array.isArray(result.data) ? result.data : []);
            setError(null);
            break;
          } catch (err: any) {
            attempts += 1;

            const status = err?.response?.status;
            const isTimeout =
              err?.code === "ECONNABORTED" ||
              err?.message?.toLowerCase().includes("timeout");

            const shouldRetry =
              (status === 429 || isTimeout) && attempts <= MAX_RETRIES;

            if (shouldRetry) {
              let delay = BASE_BACKOFF_MS * Math.pow(2, attempts - 1);

              const retryAfter = err?.response?.headers?.["retry-after"];
              if (retryAfter) {
                const parsed = Number(retryAfter);
                if (!Number.isNaN(parsed) && parsed > 0) {
                  delay = Math.max(delay, parsed * 1000);
                }
              }

              await wait(delay + Math.floor(Math.random() * 200));
              continue;
            }

            let msg = "Gagal memuat daftar pesanan";

            if (isTimeout) {
              msg = "Koneksi terlalu lambat, silakan coba lagi";
            } else if (err?.response?.data?.message) {
              msg = err.response.data.message;
            } else if (err instanceof Error) {
              msg = err.message;
            }

            setError(msg);

            if (!isTimeout && status !== 429) {
              console.error("useOrderByIdUser error:", err);
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
      setOrdersByIdUser([]);
      setLoading(false);
      setError(null);
      return;
    }

    void getOrderByIdUser(user.id);

    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent)?.detail;
      const uid = detail?.userId ?? detail?.user_id ?? user.id;

      if (Number(uid) === Number(user.id)) {
        void getOrderByIdUser(user.id);
      }
    };

    window.addEventListener("order:updated", handler as EventListener);
    return () => {
      window.removeEventListener("order:updated", handler as EventListener);
    };
  }, [user, getOrderByIdUser]);

  const refetch = () => {
    if (!user) return;
    return getOrderByIdUser(user.id);
  };

  return {
    ordersByIdUser,
    loading,
    error,
    refetch,
  };
};
