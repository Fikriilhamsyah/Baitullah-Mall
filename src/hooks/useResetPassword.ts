// src/hooks/useForgotPassword.ts
import { useState } from "react";
import { IResetPassword } from "@/types/IUser";
import { api } from "@/services/api";

export const useResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  /**
   * send - kirim request reset/forgot password
   * @param payload { phone: number | string }
   * @returns response data dari API atau null jika gagal
   */
  const send = async (payload: IResetPassword): Promise<any | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const res = await api.postResetPassword(payload);
      // asumsikan API mengembalikan objek respons; simpan success
      setSuccess(true);
      return res.data;
    } catch (err: any) {
      let message = "Terjadi kesalahan saat mengirim permintaan reset password";

      // preferensi pesan dari response API jika ada
      if (err?.response?.data?.message) message = err.response.data.message;
      else if (err instanceof Error) message = err.message;

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    send,
    loading,
    error,
    success,
    setError, // expose untuk situasi testing / reset manual error
  };
};

export default useResetPassword;
