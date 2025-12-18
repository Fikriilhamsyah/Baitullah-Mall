import { useCallback, useEffect, useState } from "react";
import { api } from "@/services/api";
import { IPoinSummary } from "@/types/IPoin";

/**
 * ==============================
 * Global control (shared state)
 * ==============================
 */
const CACHE_KEY = "poin:summary:v1";
const CACHE_TTL = 60_000; // 1 menit
let isFetching = false;
let lastFetchAt = 0;

/**
 * Global memory cache
 */
if (!(globalThis as any)._usePoinCache) {
  (globalThis as any)._usePoinCache = new Map();
}
const memoryCache: Map<
  string,
  { data: IPoinSummary[]; timestamp: number }
> = (globalThis as any)._usePoinCache;

/**
 * ==============================
 * Normalizer
 * ==============================
 */
const normalize = (arr: any[]): IPoinSummary[] =>
  arr.map((it: any) => ({
    id_users: it.id_users ?? it.id_user ?? it.user_id ?? null,
    total_score_sum: String(
      it.total_score_sum ?? it.total_score ?? it.score ?? "0"
    ),
    total_time_sum: String(
      it.total_time_sum ?? it.total_time ?? it.time ?? "0"
    ),
  }));

/**
 * ==============================
 * Hook
 * ==============================
 */
export const usePoin = () => {
  const [poin, setPoin] = useState<IPoinSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ==============================
   * Fetcher with protection
   * ==============================
   */
  const fetchPoin = useCallback(async (force = false) => {
    const now = Date.now();

    // 1️⃣ return cached if valid
    const cached = memoryCache.get(CACHE_KEY);
    if (
      !force &&
      cached &&
      now - cached.timestamp < CACHE_TTL
    ) {
      setPoin(cached.data);
      setLoading(false);
      return cached.data;
    }

    // 2️⃣ block duplicate request
    if (isFetching) {
      if (cached) {
        setPoin(cached.data);
      }
      setLoading(false);
      return cached?.data ?? [];
    }

    isFetching = true;
    setLoading(true);
    setError(null);

    try {
      const res = await api.getPoin();
      const raw = res?.data;

      let arr: any[] | null = null;
      if (Array.isArray(raw)) arr = raw;
      else if (Array.isArray(raw?.data)) arr = raw.data;
      else if (Array.isArray(raw?.result)) arr = raw.result;
      else if (raw && typeof raw === "object") {
        const found = Object.values(raw).find(Array.isArray);
        if (Array.isArray(found)) arr = found as any[];
      }

      if (!Array.isArray(arr)) {
        throw new Error("Format response poin tidak valid");
      }

      const normalized = normalize(arr);

      // 3️⃣ cache result
      memoryCache.set(CACHE_KEY, {
        data: normalized,
        timestamp: Date.now(),
      });

      lastFetchAt = Date.now();
      setPoin(normalized);
      return normalized;
    } catch (err: any) {
      // 4️⃣ handle rate limit
      if (err?.response?.status === 429) {
        setError("Terlalu banyak permintaan, silakan tunggu sebentar");
      } else {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Gagal memuat poin"
        );
      }
      setPoin([]);
      return null;
    } finally {
      isFetching = false;
      setLoading(false);
    }
  }, []);

  /**
   * ==============================
   * Initial load
   * ==============================
   */
  useEffect(() => {
    fetchPoin();
  }, [fetchPoin]);

  /**
   * ==============================
   * Manual refetch
   * ==============================
   */
  const refetch = useCallback(async () => {
    memoryCache.delete(CACHE_KEY);
    lastFetchAt = 0;
    return fetchPoin(true);
  }, [fetchPoin]);

  return {
    poin,
    loading,
    error,
    refetch,
  };
};

export default usePoin;
