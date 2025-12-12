// hooks/useAddress.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { IAddress } from "@/types/IAddress";

/**
 * useAddress - client hook untuk mengambil daftar alamat.
 * - mengembalikan { address, loading, error, refetch }
 * - otomatis re-fetch saat window event "address:updated" diterima
 */
export const useAddress = () => {
  const [address, setAddress] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ref untuk mencegah multiple concurrent fetch
  const ongoingRef = useRef(false);

  const fetchAddress = useCallback(async () => {
    // prevent concurrent
    if (ongoingRef.current) return;
    ongoingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const resp = await api.getAddress();
      const result = resp.data as ApiResponse<IAddress[]>;
      const data = Array.isArray(result.data) ? result.data : [];
      setAddress(data);
      setError(null);
      return data;
    } catch (err: any) {
      console.error("useAddress: fetch failed", err);
      const msg = err?.response?.data?.message ?? err?.message ?? "Gagal memuat alamat";
      setError(msg);
      setAddress([]);
      return null;
    } finally {
      ongoingRef.current = false;
      setLoading(false);
    }
  }, []);

  // exposed refetch
  const refetch = useCallback(() => {
    // call async but don't await here
    void fetchAddress();
  }, [fetchAddress]);

  useEffect(() => {
    // initial fetch
    void fetchAddress();

    // handler for window event
    const handler = (ev: Event) => {
      // optionally you can check ev.detail.userId etc
      // do a small timeout to batch multiple events
      // (debounce simple)
      setTimeout(() => {
        void fetchAddress();
      }, 50);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("address:updated", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("address:updated", handler);
      }
    };
  }, [fetchAddress]);

  return {
    address,
    loading,
    error,
    refetch,
  } as const;
};

export default useAddress;
