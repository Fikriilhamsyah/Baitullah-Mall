// hooks/useCategories.ts
import { useState, useEffect } from "react";
import { ICategory } from "../types/ICategory";
import { ApiResponse } from "../types/ApiResponse";
import { apiFetch } from "@/services/apiFetch";

const CACHE_KEY = "categories:v1";

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!(globalThis as any)._useCategoriesCache) (globalThis as any)._useCategoriesCache = new Map();
  const memoryCache: Map<string, ICategory[]> = (globalThis as any)._useCategoriesCache;

  useEffect(() => {
    let mounted = true;

    const getCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        if (memoryCache.has(CACHE_KEY)) {
          const cached = memoryCache.get(CACHE_KEY) as ICategory[];
          if (mounted) {
            setCategories(cached);
            setLoading(false);
          }
          return;
        }

        const base = process.env.NEXT_PUBLIC_API_BAITULLAH_MALL ?? "";
        const res = await apiFetch({
          url: `${base}/api/kategori`,
          method: "get",
          dedupeKey: "GET:/api/kategori",
          retries: 3,
          retryDelay: 300,
        });

        const result = res.data as ApiResponse<ICategory[]>;
        const items = Array.isArray(result.data) ? result.data : [];

        if (!mounted) return;

        memoryCache.set(CACHE_KEY, items);
        setCategories(items);
      } catch (err) {
        if (!mounted) return;
        console.error("useCategories Error: ", err);
        let errorMessage = "Gagal memuat kategori";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getCategories();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { categories, loading, error };
};
