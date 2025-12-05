import { useState } from "react";
import { api } from "@/services/api";

export interface IDeleteCartResponse {
  success?: boolean;
  message?: string;
  error?: boolean;
}

export const useDeleteCartById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCart = async (id: number): Promise<IDeleteCartResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.deleteCartByIdCart(id);

      const payload = (res && (res.data ?? res)) as IDeleteCartResponse;

      return payload;
    } catch (err: any) {
      let message = "Terjadi kesalahan saat hapus data";
      if (err?.response?.data?.message) message = err.response.data.message;
      else if (err instanceof Error) message = err.message;

      setError(message);
      console.error("useDeleteCartById error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCart, loading, error };
};

export default useDeleteCartById;
