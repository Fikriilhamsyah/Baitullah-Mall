import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPostCheckout, ICheckoutInvoice } from "@/types/ICheckout";

let isCreatingInvoice = false;

export const useCheckout = () => {
  const [data, setData] = useState<ICheckoutInvoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoutFn = useAuth.getState().logout;

  const postCheckout = async <T>(
    payload: IPostCheckout<T>
  ): Promise<ApiResponse<ICheckoutInvoice>> => {
    if (isCreatingInvoice) {
      throw new Error("Invoice sedang diproses, silakan tunggu");
    }

    isCreatingInvoice = true;

    try {
      setLoading(true);
      setError(null);

      const response = await api.postCheckout(payload);

      const result = response.data; // ApiResponse<ICheckoutInvoice>

      setData(result.data);

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("cart:updated", {
            detail: { userId: payload.user_id },
          })
        );
      }

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
            "Gagal membuat invoice pembayaran";

      setError(message);
      throw new Error(message);
    } finally {
      isCreatingInvoice = false;
      setLoading(false);
    }
  };

  return { postCheckout, data, loading, error };
};
