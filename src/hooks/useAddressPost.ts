import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPostAddress } from "@/types/IAddress";

let isPostingAddress = false;

export const useAddressPost = () => {
  const [data, setData] = useState<IPostAddress[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logoutFn = useAuth.getState().logout;

  const postAddress = async (payload: IPostAddress) => {
    if (isPostingAddress) {
      throw new Error("Alamat sedang diproses");
    }

    isPostingAddress = true;

    try {
      setLoading(true);
      setError(null);

      const response = await api.postAddress(payload);
      const result = response.data as ApiResponse<IPostAddress[]>;

      setData(Array.isArray(result.data) ? result.data : null);

      window.dispatchEvent(
        new CustomEvent("address:updated", { detail: { userId: payload.user_id } })
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
          : err?.message ?? "Gagal menambahkan alamat";

      setError(message);
      throw new Error(message);
    } finally {
      isPostingAddress = false;
      setLoading(false);
    }
  };

  return { postAddress, data, loading, error };
};
