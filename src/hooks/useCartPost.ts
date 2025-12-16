import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { IPostCart } from "@/types/ICart";
import { useAuth } from "@/context/AuthContext";

let isPostingCart = false;

export const usePostCart = () => {
  const [data, setData] = useState<IPostCart[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logoutFn = useAuth.getState().logout;

  const postCart = async (payload: IPostCart) => {
    if (isPostingCart) {
      throw new Error("Keranjang sedang diperbarui");
    }

    isPostingCart = true;

    try {
      setLoading(true);
      setError(null);

      const response = await api.postCart(payload);
      const result = response.data as ApiResponse<IPostCart[]>;

      setData(Array.isArray(result.data) ? result.data : null);

      window.dispatchEvent(
        new CustomEvent("cart:updated", { detail: { userId: payload.user_id } })
      );

      return result;
    } catch (err: any) {
      const status = err?.response?.status;

      if ((status === 401 || status === 403) && logoutFn) {
        logoutFn();
        throw new Error("Sesi Anda berakhir");
      }

      const message =
        status === 429
          ? "Terlalu banyak permintaan"
          : err?.message ?? "Gagal menambahkan ke keranjang";

      setError(message);
      throw new Error(message);
    } finally {
      isPostingCart = false;
      setLoading(false);
    }
  };

  return { postCart, data, loading, error };
};
