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

  const postCalculateOngkir = async (
    payload: IPostCalculateOngkir,
    attempt = 1
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.postCalculateOngkir(payload);
      const result = response.data as ApiResponse<any[]>;

      const safeData = Array.isArray(result.data) ? result.data : null;
      setData(safeData);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("ongkir:calculated", { detail: safeData })
        );
      }

      return result;
    } catch (err: any) {
      const status = err?.response?.status;

      // retry hanya network error
      if (!status && attempt < 2) {
        return postCalculateOngkir(payload, attempt + 1);
      }

      if (status === 401 || status === 403) {
        logoutFn?.();
        const msg = "Sesi Anda berakhir. Silakan masuk kembali.";
        setError(msg);
        throw new Error(msg);
      }

      let message = "Terjadi kesalahan saat menghitung ongkir";
      if (err?.message?.includes("timeout")) {
        message = "Koneksi terlalu lambat, silakan coba lagi";
      } else if (err?.response?.data?.message) {
        message = String(err.response.data.message);
      }

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postCalculateOngkir, data, loading, error };
};
