import { useState } from "react";
import { ILogin, ILoginResponse } from "@/types/IUser";
import { api } from "@/services/api";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: ILogin): Promise<ILoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.postLogin(payload);

      return res.data as ILoginResponse;

    } catch (err: any) {
      let message = "Terjadi kesalahan saat login";

      if (err?.response?.data?.message) message = err.response.data.message;
      if (err instanceof Error) message = err.message;

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
