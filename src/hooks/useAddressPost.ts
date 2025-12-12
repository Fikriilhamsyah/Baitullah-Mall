import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPostAddress } from "@/types/IAddress";

export const useAddressPost = () => {
  const [data, setData] = useState<IPostAddress[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth.getState(); // use getState for latest
  const logoutFn = useAuth.getState().logout;

  const postAddress = async (payload: IPostAddress) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.postAddress(payload);
      const result = response.data as ApiResponse<IPostAddress[]>;

      setData(Array.isArray(result.data) ? result.data : null);

      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(new CustomEvent("cart:updated", { detail: { userId: payload.user_id } }));
        } catch (e) {
          // ignore
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

      let message = "Terjadi kesalahan saat menambahkan ke keranjang";
      if (err instanceof Error) message = err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postAddress, data, loading, error };
};
