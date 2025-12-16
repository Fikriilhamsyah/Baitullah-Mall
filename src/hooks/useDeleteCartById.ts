import { useState } from "react";
import { api } from "@/services/api";

export interface IDeleteCartResponse {
  success?: boolean;
  message?: string;
  error?: boolean;
}

let isDeletingCart = false;

export const useDeleteCartById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCart = async (id: number): Promise<IDeleteCartResponse | null> => {
    if (isDeletingCart) {
      throw new Error("Penghapusan sedang diproses");
    }

    isDeletingCart = true;

    try {
      setLoading(true);
      setError(null);

      const res = await api.deleteCartByIdCart(id);
      const payload = (res?.data ?? res) as IDeleteCartResponse;

      // trigger cart refetch
      window.dispatchEvent(new CustomEvent("cart:updated"));

      return payload;
    } catch (err: any) {
      const status = err?.response?.status;

      const message =
        status === 429
          ? "Terlalu banyak permintaan, silakan tunggu"
          : err?.response?.data?.message ??
            err?.message ??
            "Terjadi kesalahan saat menghapus data";

      setError(message);
      console.error("useDeleteCartById error:", err);
      return null;
    } finally {
      isDeletingCart = false;
      setLoading(false);
    }
  };

  return { deleteCart, loading, error };
};

export default useDeleteCartById;
