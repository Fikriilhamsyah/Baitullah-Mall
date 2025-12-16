import { useState } from "react";
import { ILogin, ILoginResponse } from "@/types/IUser";
import { api } from "@/services/api";

let isLoggingIn = false;

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: ILogin): Promise<ILoginResponse | null> => {
    if (isLoggingIn) {
      throw new Error("Proses login sedang berlangsung");
    }

    isLoggingIn = true;

    try {
      setLoading(true);
      setError(null);

      const res = await api.postLogin(payload);
      return res.data as ILoginResponse;
    } catch (err: any) {
      const message =
        err?.message?.includes("timeout")
          ? "Koneksi terlalu lambat, silakan coba lagi"
          : err?.response?.data?.message ??
            err?.message ??
            "Gagal login";

      setError(message);
      return null;
    } finally {
      isLoggingIn = false;
      setLoading(false);
    }
  };

  return { login, loading, error };
};
