import { useEffect, useState } from "react";
import { IJenis } from "@/types/IProduct";
import { ApiResponse } from "@/types/ApiResponse";
import { apiFetch } from "@/services/apiFetch";

const CACHE_KEY = "paymentType:v1";
const MAX_RETRIES = 3;

export const usePaymentType = () => {
  const [paymentType, setPaymentType] = useState<IJenis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!(globalThis as any)._usePaymentTypeCache) {
    (globalThis as any)._usePaymentTypeCache = new Map();
  }
  const memoryCache: Map<string, IJenis[]> =
    (globalThis as any)._usePaymentTypeCache;

  useEffect(() => {
    let mounted = true;

    const fetchWithRetry = async (attempt = 1): Promise<IJenis[]> => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BAITULLAH_MALL ?? "";
        const res = await apiFetch({
          url: `${base}/api/jenis`,
          method: "get",
          dedupeKey: "GET:/api/jenis",
          retries: 0,
          timeout: 20000,
        });

        const result = res.data as ApiResponse<IJenis[]>;
        return Array.isArray(result.data) ? result.data : [];
      } catch (err) {
        if (attempt >= MAX_RETRIES) throw err;
        await new Promise((r) => setTimeout(r, 400 * attempt));
        return fetchWithRetry(attempt + 1);
      }
    };

    const getPaymentType = async () => {
      try {
        setLoading(true);
        setError(null);

        if (memoryCache.has(CACHE_KEY)) {
          setPaymentType(memoryCache.get(CACHE_KEY)!);
        }

        const items = await fetchWithRetry();
        memoryCache.set(CACHE_KEY, items);
        if (mounted) setPaymentType(items);
      } catch (err: any) {
        if (!mounted) return;

        if (memoryCache.has(CACHE_KEY)) {
          setPaymentType(memoryCache.get(CACHE_KEY)!);
          setError("Koneksi lambat, menampilkan data tersimpan");
          return;
        }

        setError(err?.message ?? "Gagal memuat jenis pembayaran");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getPaymentType();
    return () => {
      mounted = false;
    };
  }, []);

  return { paymentType, loading, error };
};
