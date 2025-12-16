"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { IAddress } from "@/types/IAddress";

const CACHE_KEY = "address:v1";
const MAX_RETRIES = 3;

export const useAddress = () => {
  const [address, setAddress] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const ongoingRef = useRef(false);

  if (!(globalThis as any)._useAddressCache) {
    (globalThis as any)._useAddressCache = new Map();
  }
  const memoryCache: Map<string, IAddress[]> =
    (globalThis as any)._useAddressCache;

  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const fetchWithRetry = async (attempt = 1): Promise<IAddress[]> => {
    try {
      const resp = await api.getAddress();
      const result = resp.data as ApiResponse<IAddress[]>;
      return Array.isArray(result.data) ? result.data : [];
    } catch (err: any) {
      if (attempt >= MAX_RETRIES || err?.response?.status === 429) {
        throw err;
      }
      await wait(400 * attempt);
      return fetchWithRetry(attempt + 1);
    }
  };

  const fetchAddress = useCallback(async () => {
    if (ongoingRef.current) return;
    ongoingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      if (memoryCache.has(CACHE_KEY)) {
        setAddress(memoryCache.get(CACHE_KEY)!);
      }

      const data = await fetchWithRetry();
      setAddress(data);
      memoryCache.set(CACHE_KEY, data);
      return data;
    } catch (err: any) {
      if (memoryCache.has(CACHE_KEY)) {
        setAddress(memoryCache.get(CACHE_KEY)!);
        setError("Koneksi lambat, menampilkan alamat tersimpan");
        return null;
      }

      setError(
        err?.message?.includes("timeout")
          ? "Koneksi terlalu lambat"
          : err?.response?.data?.message ?? "Gagal memuat alamat"
      );
      setAddress([]);
      return null;
    } finally {
      ongoingRef.current = false;
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    void fetchAddress();
  }, [fetchAddress]);

  useEffect(() => {
    void fetchAddress();

    const handler = () => {
      setTimeout(() => void fetchAddress(), 50);
    };

    window.addEventListener("address:updated", handler);
    return () => window.removeEventListener("address:updated", handler);
  }, [fetchAddress]);

  return { address, loading, error, refetch } as const;
};
