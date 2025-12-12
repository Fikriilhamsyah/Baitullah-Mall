import { useState, useEffect } from "react";
import { api } from "../services/api";
import { ILocation } from "@/types/IAddress";

export interface IMessage {
  message: string;
  code: number;
  status: string;
}

export interface ApiResponse<T> {
  message?: IMessage;
  data: T;
}

export const useRajaOngkirProvince = () => {
  const [province, setProvince] = useState<ILocation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const getProvinceAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getProvince();
        const result = response.data as ApiResponse<ILocation[]>;

        if (!cancelled) setProvince(result.data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        if (!cancelled) setError(errorMessage);
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getProvinceAll();

    return () => {
      cancelled = true;
    };
  }, []);

  return { province, loading, error };
};
