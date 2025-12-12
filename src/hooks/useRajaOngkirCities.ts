// hooks/useRajaOngkirCities.ts
import { useState, useEffect } from "react";
import { api } from "@/services/api";

export interface ILocation {
  id: number;
  name: string;
}

export interface IMessage {
  message: string;
  code: number;
  status: string;
}

export interface ApiResponse<T> {
  message?: IMessage;
  data: T;
}

/**
 * Simple promise timeout wrapper.
 * If `promise` tidak resolve/reject dalam `ms`, will reject with Error.
 */
const withTimeout = <T,>(promise: Promise<T>, ms = 10000): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`timeout of ${ms}ms exceeded`));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

export const useRajaOngkirCities = (provinceId?: number | null, timeoutMs = 15000) => {
  const [cities, setCities] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getCities = async () => {
      if (!provinceId) {
        if (!cancelled) {
          setCities([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        if (!cancelled) {
          setLoading(true);
          setError(null);
        }

        const response = await withTimeout(api.getCities(provinceId), timeoutMs);
        const result = (response as any).data as ApiResponse<ILocation[]>;

        if (!cancelled) setCities(result.data);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
        if (!cancelled) {
          setError(errMsg);
          setCities([]);
        }
        console.error("useRajaOngkirCities error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getCities();

    return () => {
      cancelled = true;
    };
  }, [provinceId, timeoutMs]);

  return { cities, loading, error };
};
