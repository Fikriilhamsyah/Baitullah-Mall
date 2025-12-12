import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { IPoinSummary } from "@/types/IPoin";

const CACHE_KEY = "poin:summary:v1";

const normalize = (arr: any[]): IPoinSummary[] => {
  return arr.map((it: any) => {
    const normalized: IPoinSummary = {
      id_users: it.id_users ?? it.id_user ?? it.user_id ?? null,
      // keep as string to match your IPoinSummary shape; convert to "0" when missing
      total_score_sum: String(it.total_score_sum ?? it.total_score ?? it.score ?? "0"),
      total_time_sum: String(it.total_time_sum ?? it.total_time ?? it.time ?? "0"),
    };
    return normalized;
  });
};

export const usePoin = () => {
  const [poin, setPoin] = useState<IPoinSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // simple in-memory global cache (shared across hook instances)
  if (!(globalThis as any)._usePoinCache) (globalThis as any)._usePoinCache = new Map();
  const memoryCache: Map<string, IPoinSummary[]> = (globalThis as any)._usePoinCache;

  useEffect(() => {
    let mounted = true;

    const getPoin = async () => {
      try {
        setLoading(true);
        setError(null);

        // return cached if present
        if (memoryCache.has(CACHE_KEY)) {
          const cached = memoryCache.get(CACHE_KEY) as IPoinSummary[];
          if (mounted) {
            setPoin(cached);
            setLoading(false);
          }
          return;
        }

        // call API (expecting the endpoint that returns summary for all users)
        const res = await api.getPoin();
        // debug: uncomment if you need to inspect server payload in dev
        // console.debug("[usePoin] raw:", res);

        const raw = res?.data;
        let arr: any[] | null = null;

        if (Array.isArray(raw)) {
          arr = raw;
        } else if (raw && Array.isArray((raw as any).data)) {
          arr = (raw as any).data;
        } else if (raw && Array.isArray((raw as any).result)) {
          arr = (raw as any).result;
        } else if (raw && typeof raw === "object") {
          const found = Object.values(raw).find((v) => Array.isArray(v));
          if (Array.isArray(found)) arr = found as any[];
        }

        if (!Array.isArray(arr)) {
          console.warn("[usePoin] unexpected response shape:", raw);
          throw new Error("Format response poin tidak terduga");
        }

        const normalized = normalize(arr);
        // cache and set state
        memoryCache.set(CACHE_KEY, normalized);
        if (!mounted) return;
        setPoin(normalized);
        setError(null);
      } catch (err: any) {
        if (!mounted) return;
        console.error("usePoin Error:", err);
        const msg = err?.response?.data?.message ?? err?.message ?? "Gagal memuat poin";
        setError(String(msg));
        setPoin([]); // ensure array always
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void getPoin();

    return () => {
      mounted = false;
    };
    // NOTE: intentionally empty deps -> run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // expose manual refetch (invalidates cache then re-fetch)
  const refetch = async () => {
    // clear cached value
    try {
      memoryCache.delete(CACHE_KEY);
      setLoading(true);
      setError(null);
      const res = await api.getPoin();
      const raw = res?.data;
      let arr: any[] | null = null;

      if (Array.isArray(raw)) arr = raw;
      else if (raw && Array.isArray((raw as any).data)) arr = (raw as any).data;
      else if (raw && Array.isArray((raw as any).result)) arr = (raw as any).result;
      else if (raw && typeof raw === "object") {
        const found = Object.values(raw).find((v) => Array.isArray(v));
        if (Array.isArray(found)) arr = found as any[];
      }

      if (!Array.isArray(arr)) {
        throw new Error("Format response poin tidak terduga");
      }
      const normalized = normalize(arr);
      memoryCache.set(CACHE_KEY, normalized);
      setPoin(normalized);
      setError(null);
      return normalized;
    } catch (err: any) {
      console.error("usePoin refetch error:", err);
      const msg = err?.response?.data?.message ?? err?.message ?? "Gagal memuat poin";
      setError(String(msg));
      setPoin([]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { poin, loading, error, refetch };
};

export default usePoin;
