import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPostXendit, IXenditInvoice } from "@/types/IXendit";

let isCreatingInvoice = false;

export const useXenditPost = () => {
  const [data, setData] = useState<IXenditInvoice | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logoutFn = useAuth.getState().logout;

  const postXendit = async (
    payload: IPostXendit,
    attempt = 1
  ): Promise<ApiResponse<IXenditInvoice>> => {
    if (isCreatingInvoice) {
      throw new Error("Invoice sedang diproses, silakan tunggu");
    }

    isCreatingInvoice = true;

    try {
      setLoading(true);
      setError(null);

      console.log("[XENDIT] payload:", payload);

      const response = await api.postXendit(payload);
      const result = response.data as ApiResponse<IXenditInvoice>;

      console.log("[XENDIT] response:", result);

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

  return { postXendit, data, loading, error };
};
