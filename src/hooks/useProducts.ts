// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { IProduct } from "../types/IProduct";
import { ApiResponse } from "../types/ApiResponse";
import { apiFetch } from "@/services/apiFetch";

const CACHE_KEY = "products:all:v1";

export const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // simple in-memory cache (per page load)
  // stored on module scope so multiple hook instances share it
  // @ts-ignore
  if (!(globalThis as any)._useProductsCache) (globalThis as any)._useProductsCache = new Map();
  const memoryCache: Map<string, IProduct[]> = (globalThis as any)._useProductsCache;

  useEffect(() => {
    let mounted = true;

    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // return cache if available
        if (memoryCache.has(CACHE_KEY)) {
          const cached = memoryCache.get(CACHE_KEY) as IProduct[];
          if (mounted) {
            setProducts(cached);
            setLoading(false);
          }
          return;
        }

        const base = process.env.NEXT_PUBLIC_API_BAITULLAH_MALL ?? "";
        const res = await apiFetch({
          url: `${base}/api/produk`,
          method: "get",
          dedupeKey: "GET:/api/produk",
          retries: 3,
          retryDelay: 400,
        });

        const result = res.data as ApiResponse<IProduct[]>;
        const items = Array.isArray(result.data) ? result.data : [];

        if (!mounted) return;

        memoryCache.set(CACHE_KEY, items);
        setProducts(items);
      } catch (err) {
        if (!mounted) return;
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
        console.error("useProducts error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getProducts();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { products, loading, error };
};
