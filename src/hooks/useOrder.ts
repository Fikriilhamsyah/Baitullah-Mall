"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { Order } from "@/types/IOrder";

const CACHE_KEY = "order:v1";
const MAX_RETRIES = 3;
const EVENT_DEBOUNCE = 300;

export const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ongoingRef = useRef(false);
  const lastEventRef = useRef(0);

  // 🌍 global memory cache (persist selama tab hidup)
  if (!(globalThis as any)._useOrderCache) {
    (globalThis as any)._useOrderCache = new Map();
  }

  const memoryCache: Map<string, Order[]> =
    (globalThis as any)._useOrderCache;

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const fetchWithRetry = async (
    attempt = 1
  ): Promise<Order[]> => {
    try {
      const resp = await api.getOrder();
      const result = resp.data as ApiResponse<Order[]>;

      return Array.isArray(result.data)
        ? result.data
        : [];
    } catch (err: any) {
      if (attempt >= MAX_RETRIES) throw err;
      await wait(300 * attempt);
      return fetchWithRetry(attempt + 1);
    }
  };

  const fetchOrder = useCallback(async () => {
    if (ongoingRef.current) return;

    ongoingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // ⚡ tampilkan cache dulu (UX cepat)
      if (memoryCache.has(CACHE_KEY)) {
        setOrders(memoryCache.get(CACHE_KEY)!);
      }

      const data = await fetchWithRetry();
      setOrders(data);
      memoryCache.set(CACHE_KEY, data);
    } catch (err: any) {
      if (memoryCache.has(CACHE_KEY)) {
        setOrders(memoryCache.get(CACHE_KEY)!);
        setError("Koneksi lambat, menampilkan data terakhir");
      } else {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Gagal memuat pesanan"
        );
        setOrders([]);
      }
    } finally {
      ongoingRef.current = false;
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    void fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    void fetchOrder();

    const handler = () => {
      const now = Date.now();
      if (now - lastEventRef.current < EVENT_DEBOUNCE)
        return;

      lastEventRef.current = now;
      void fetchOrder();
    };

    // 🔔 trigger manual refresh dari halaman lain
    window.addEventListener("order:updated", handler);
    return () =>
      window.removeEventListener("order:updated", handler);
  }, [fetchOrder]);

  return { orders, loading, error, refetch } as const;
};
