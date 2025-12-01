import { useState } from "react";
import { ILogin, ILoginResponse } from "@/types/IUser";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: ILogin): Promise<ILoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.postLogin(payload);
      const result = response.data as ApiResponse<ILoginResponse>;

      return result.data;
    } catch (err: any) {
      let message = "Terjadi kesalahan saat login";

      // jika API error format: { message: "..." }
      if (err?.response?.data?.message) message = err.response.data.message;

      // jika error bawaan axios atau Error JS
      if (err instanceof Error) message = err.message;

      setError(message);
      console.error(err);

      return null; // Konsisten seperti getProducts
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
