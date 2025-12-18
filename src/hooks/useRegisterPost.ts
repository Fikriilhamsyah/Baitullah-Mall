import { useState } from "react";
import { IRegister, IUser } from "@/types/IUser";
import { api } from "@/services/api";

export interface IRegisterResponse {
  status: string;
  status_code: number;
  message: string;
  token_type: string;
  access_token: string;
  user: IUser;
}

export const useRegisterPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    payload: IRegister
  ): Promise<IRegisterResponse> => {
    if (loading) {
      throw new Error("Proses registrasi sedang berlangsung");
    }

    try {
      setLoading(true);
      setError(null);

      const res = await api.postRegister(payload);

      return res.data as IRegisterResponse;
    } catch (err: any) {
      const message =
        err?.message?.includes("timeout")
          ? "Koneksi terlalu lambat, silakan coba lagi"
          : err?.response?.data?.message ??
            err?.message ??
            "Registrasi gagal";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {register, loading, error};
};
