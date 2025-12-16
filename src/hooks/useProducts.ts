// hooks/useProducts.ts
import { useState, useEffect } from "react";
import { IProduct } from "../types/IProduct";
import { ApiResponse } from "../types/ApiResponse";
import { apiFetch } from "@/services/apiFetch";

const CACHE_KEY = "products:all:v1";
const MAX_RETRIES = 3;

export const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // shared in-memory cache
  // @ts-ignore
  if (!(globalThis as any)._useProductsCache) {
    (globalThis as any)._useProductsCache = new Map();
  }
  const memoryCache: Map<string, IProduct[]> =
    (globalThis as any)._useProductsCache;

  useEffect(() => {
    let mounted = true;

    const fetchWithRetry = async (attempt = 1): Promise<IProduct[]> => {
      const base = process.env.NEXT_PUBLIC_API_BAITULLAH_MALL ?? "";

      try {
        const res = await apiFetch({
          url: `${base}/api/produk`,
          method: "get",
          dedupeKey: "GET:/api/produk",
          timeout: 20000, // ⬅️ override timeout khusus jaringan lambat
          retries: 0, // retry dikontrol manual
        });

        const result = res.data as ApiResponse<IProduct[]>;
        return Array.isArray(result.data) ? result.data : [];
      } catch (err) {
        if (attempt >= MAX_RETRIES) throw err;

        // exponential backoff ringan
        const delay = 500 * attempt;
        await new Promise((res) => setTimeout(res, delay));

        return fetchWithRetry(attempt + 1);
      }
    };

    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1️⃣ Pakai cache dulu (instant render)
        if (memoryCache.has(CACHE_KEY)) {
          const cached = memoryCache.get(CACHE_KEY) as IProduct[];
          if (mounted) {
            setProducts(cached);
            setLoading(false);
          }
        }

        // 2️⃣ Fetch fresh data (retry-safe)
        const items = await fetchWithRetry();

        if (!mounted) return;

        memoryCache.set(CACHE_KEY, items);
        setProducts(items);
      } catch (err) {
        if (!mounted) return;

        // 3️⃣ Fallback ke cache jika fetch gagal
        if (memoryCache.has(CACHE_KEY)) {
          setProducts(memoryCache.get(CACHE_KEY)!);
          setError("Koneksi lambat, menampilkan data tersimpan");
          return;
        }

        let errorMessage = "Gagal memuat produk";
        if (err instanceof Error) {
          if (err.message.includes("timeout")) {
            errorMessage = "Koneksi terlalu lambat, silakan coba lagi";
          } else {
            errorMessage = err.message;
          }
        }

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
  }, []);

  return { products, loading, error };
};
