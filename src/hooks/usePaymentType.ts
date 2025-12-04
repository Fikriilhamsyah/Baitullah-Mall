// hooks/usePaymentType.ts
import { useEffect, useState } from "react";
import { IJenis } from "@/types/IProduct";
import { ApiResponse } from "@/types/ApiResponse";
import { apiFetch } from "@/services/apiFetch";

const CACHE_KEY = "paymentType:v1";

export const usePaymentType = () => {
  const [paymentType, setPaymentType] = useState<IJenis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!(globalThis as any)._usePaymentTypeCache) (globalThis as any)._usePaymentTypeCache = new Map();
  const memoryCache: Map<string, IJenis[]> = (globalThis as any)._usePaymentTypeCache;

  useEffect(() => {
    let mounted = true;

    const getPaymentType = async () => {
      try {
        setLoading(true);
        setError(null);

        if (memoryCache.has(CACHE_KEY)) {
          const cached = memoryCache.get(CACHE_KEY) as IJenis[];
          if (mounted) {
            setPaymentType(cached);
            setLoading(false);
          }
          return;
        }

        const base = process.env.NEXT_PUBLIC_API_BAITULLAH_MALL ?? "";
        const res = await apiFetch({
          url: `${base}/api/jenis`,
          method: "get",
          dedupeKey: "GET:/api/jenis",
          retries: 3,
          retryDelay: 300,
        });

        const result = res.data as ApiResponse<IJenis[]>;
        const items = Array.isArray(result.data) ? result.data : [];

        if (!mounted) return;

        memoryCache.set(CACHE_KEY, items);
        setPaymentType(items);
      } catch (err) {
        if (!mounted) return;
        console.error("usePaymentType Error: ", err);
        let errorMessage = "Gagal memuat jenis pembayaran";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getPaymentType();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { paymentType, loading, error };
};
