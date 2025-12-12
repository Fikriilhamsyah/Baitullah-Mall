// hooks/useRajaOngkirSubdistricts.ts
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

export const useRajaOngkirSubdistricts = (districtId?: number | null, timeoutMs = 15000) => {
  const [subdistricts, setSubdistricts] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getSubdistricts = async () => {
      if (!districtId) {
        if (!cancelled) {
          setSubdistricts([]);
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

        const response = await withTimeout(api.getSubDistricts(districtId), timeoutMs);
        const result = (response as any).data as ApiResponse<ILocation[]>;

        if (!cancelled) setSubdistricts(result.data);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan";
        if (!cancelled) {
          setError(errMsg);
          setSubdistricts([]);
        }
        console.error("useRajaOngkirSubdistricts error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getSubdistricts();

    return () => {
      cancelled = true;
    };
  }, [districtId, timeoutMs]);

  return { subdistricts, loading, error };
};
