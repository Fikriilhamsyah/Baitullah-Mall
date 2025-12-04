// hooks/useCartPost.ts
import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { IPostCart } from "@/types/ICart";
import { useAuth } from "@/context/AuthContext";

/**
 * postCart will:
 * - throw on non-2xx
 * - if response status 401/403, call logout() to clear auth
 * - return ApiResponse<IPostCart[]> on success
 */
export const usePostCart = () => {
  const [data, setData] = useState<IPostCart[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth.getState(); // use getState for latest
  const logoutFn = useAuth.getState().logout;

  const postCart = async (payload: IPostCart) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.postCart(payload);
      // assume API returns ApiResponse<IPostCart[]>
      const result = response.data as ApiResponse<IPostCart[]>;

      setData(Array.isArray(result.data) ? result.data : null);

      // dispatch cart updated only when success
      if (typeof window !== "undefined") {
        try {
          window.dispatchEvent(new CustomEvent("cart:updated", { detail: { userId: payload.user_id } }));
        } catch (e) {
          // ignore
        }
      }

      return result;
    } catch (err: any) {
      // handle auth error explicitly
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        // invalidate local auth immediately so UI is consistent
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

  return { postCart, data, loading, error };
};
