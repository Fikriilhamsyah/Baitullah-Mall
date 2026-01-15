"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { Order } from "@/types/IOrder";

const MAX_RETRIES = 3;
const EVENT_DEBOUNCE = 300;

export const useOrderByCode = (orderCode?: string) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ongoingRef = useRef(false);
  const lastEventRef = useRef(0);

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const fetchWithRetry = async (attempt = 1): Promise<Order | null> => {
    try {
      if (!orderCode) throw new Error("Kode order tidak valid");

      const resp = await api.getOrderByCode(orderCode);
      const result = resp.data as ApiResponse<Order>;

      return result.data ?? null;
    } catch (err: any) {
      if (attempt >= MAX_RETRIES) throw err;
      await wait(300 * attempt);
      return fetchWithRetry(attempt + 1);
    }
  };

  const fetchOrder = useCallback(async () => {
    if (!orderCode || ongoingRef.current) return;

    ongoingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWithRetry();
      setOrder(data);
    } catch (err: any) {
      setOrder(null);
      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Gagal memuat data pesanan"
      );
    } finally {
      ongoingRef.current = false;
      setLoading(false);
    }
  }, [orderCode]);

  const refetch = useCallback(() => {
    void fetchOrder();
  }, [fetchOrder]);

  useEffect(() => {
    void fetchOrder();

    const handler = () => {
      const now = Date.now();
      if (now - lastEventRef.current < EVENT_DEBOUNCE) return;

      lastEventRef.current = now;
      void fetchOrder();
    };

    window.addEventListener("order:updated", handler);
    return () => window.removeEventListener("order:updated", handler);
  }, [fetchOrder]);

  return { order, loading, error, refetch } as const;
};
