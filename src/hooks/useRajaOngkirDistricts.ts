// hooks/useRajaOngkirDistricts.ts
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

export const useRajaOngkirDistricts = (cityId?: number | null, timeoutMs = 15000) => {
  const [districts, setDistricts] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getDistricts = async () => {
      if (!cityId) {
        if (!cancelled) {
          setDistricts([]);
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

        const response = await withTimeout(api.getDistricts(cityId), timeoutMs);
        const result = (response as any).data as ApiResponse<ILocation[]>;

        if (!cancelled) setDistricts(result.data);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
        if (!cancelled) {
          setError(errMsg);
          setDistricts([]);
        }
        console.error("useRajaOngkirDistricts error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getDistricts();

    return () => {
      cancelled = true;
    };
  }, [cityId, timeoutMs]);

  return { districts, loading, error };
};
