import { useState, useEffect } from "react";
import { IPostCart } from "../types/ICart";
import { api } from "../services/api";
import { ApiResponse } from "../types/ApiResponse";

const CACHE_KEY = "cart:all:v1";

export const useCart = () => {
  const [cart, setCart] = useState<IPostCart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  if (!(globalThis as any)._useCartCache) {
    (globalThis as any)._useCartCache = new Map();
  }
  const memoryCache: Map<string, IPostCart[]> =
    (globalThis as any)._useCartCache;

  useEffect(() => {
    let mounted = true;

    const getCartAll = async () => {
      try {
        setLoading(true);
        setError(null);

        if (memoryCache.has(CACHE_KEY)) {
          setCart(memoryCache.get(CACHE_KEY)!);
        }

        const response = await api.getCartAll();
        const result = response.data as ApiResponse<IPostCart[]>;
        const data = Array.isArray(result.data) ? result.data : [];

        memoryCache.set(CACHE_KEY, data);
        if (mounted) setCart(data);
      } catch (err: any) {
        if (!mounted) return;

        if (memoryCache.has(CACHE_KEY)) {
          setCart(memoryCache.get(CACHE_KEY)!);
          setError("Koneksi lambat, menampilkan keranjang tersimpan");
          return;
        }

        setError(err?.message ?? "Gagal memuat keranjang");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getCartAll();
    return () => {
      mounted = false;
    };
  }, []);

  return { cart, loading, error };
};
