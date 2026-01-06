import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPayment } from "@/types/IPayment";

let isProcessingPayment = false;

export const usePayment = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoutFn = useAuth.getState().logout;

  const postPayment = async (
    payload: IPayment
  ): Promise<ApiResponse<any>> => {
    if (isProcessingPayment) {
      throw new Error("Pembayaran sedang diproses, silakan tunggu");
    }

    isProcessingPayment = true;

    try {
      setLoading(true);
      setError(null);

      const response = await api.postPayment(payload);
      const result = response.data;

      setData(result.data);

      return result;
    } catch (err: any) {
      const status = err?.response?.status;

      if ((status === 401 || status === 403) && logoutFn) {
        logoutFn();
        throw new Error("Sesi Anda berakhir. Silakan masuk kembali.");
      }

      const message =
        status === 429
          ? "Terlalu banyak permintaan. Silakan tunggu beberapa saat."
          : err?.response?.data?.message ??
            err?.message ??
            "Gagal memproses pembayaran";

      setError(message);
      throw new Error(message);
    } finally {
      isProcessingPayment = false;
      setLoading(false);
    }
  };

  return {
    postPayment,
    data,
    loading,
    error,
  };
};
