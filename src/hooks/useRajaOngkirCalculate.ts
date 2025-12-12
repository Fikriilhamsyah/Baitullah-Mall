import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPostCalculateOngkir } from "@/types/IAddress";

export const useRajaOngkirCalculate = () => {
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth.getState();
  const logoutFn = useAuth.getState().logout;

  const postCalculateOngkir = async (payload: IPostCalculateOngkir) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.postCalculateOngkir(payload);
      const result = response.data as ApiResponse<any[]>;

      setData(Array.isArray(result.data) ? result.data : null);

      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(new CustomEvent("ongkir:calculated", { detail: result.data ?? null }));
        } catch (e) {
          // ignore dispatch error
        }
      }

      return result;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        try {
          logoutFn?.();
        } catch (e) {
          // ignore
        }
        const msg = "Sesi Anda berakhir. Silakan masuk kembali.";
        setError(msg);
        throw new Error(msg);
      }

      let message = "Terjadi kesalahan saat menghitung ongkir";
      if (err?.response?.data?.message) message = String(err.response.data.message);
      else if (err instanceof Error) message = err.message;

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postCalculateOngkir, data, loading, error };
};
