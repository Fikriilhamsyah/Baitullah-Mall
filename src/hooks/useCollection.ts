// hooks/useCollection.ts
import { useEffect, useState } from "react";
import { ICollection } from "@/types/ICollection";
import { ApiResponse } from "@/types/ApiResponse";
import { apiFetch } from "@/services/apiFetch";

const CACHE_KEY = "collection:v1";

export const useCollection = () => {
  const [collection, setCollection] = useState<ICollection[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!(globalThis as any)._useCollectionCache) (globalThis as any)._useCollectionCache = new Map();
  const memoryCache: Map<string, ICollection[]> = (globalThis as any)._useCollectionCache;

  useEffect(() => {
    let mounted = true;

    const getCollection = async () => {
      try {
        setLoading(true);
        setError(null);

        if (memoryCache.has(CACHE_KEY)) {
          const cached = memoryCache.get(CACHE_KEY) as ICollection[];
          if (mounted) {
            setCollection(cached);
            setLoading(false);
          }
          return;
        }

        const base = process.env.NEXT_PUBLIC_API_BAITULLAH_MALL ?? "";
        const res = await apiFetch({
          url: `${base}/api/koleksi`,
          method: "get",
          dedupeKey: "GET:/api/koleksi",
          retries: 3,
          retryDelay: 300,
        });

        const result = res.data as ApiResponse<ICollection[]>;
        const items = Array.isArray(result.data) ? result.data : [];

        if (!mounted) return;

        memoryCache.set(CACHE_KEY, items);
        setCollection(items);
      } catch (err) {
        if (!mounted) return;
        console.error("useCollection Error: ", err);
        let errorMessage = "Gagal memuat koleksi";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getCollection();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { collection, loading, error };
};
