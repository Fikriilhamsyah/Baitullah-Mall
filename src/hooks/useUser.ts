// hooks/useUser.ts
import { useState, useEffect } from "react";
import { IUser } from "@/types/IUser";
import { dummyUser } from "@/data/UserData";

/**
 * Hook kustom untuk mengambil data user aktif.
 * Mengelola state loading dan error.
 */
export const useUser = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- API nyata (contoh)
        // const response = await api.getUser();
        // setUser(response.data);

        // --- Mock data untuk demo
        await new Promise((resolve) => setTimeout(resolve, 500)); // delay simulasi
        setUser(dummyUser);
      } catch (err) {
        let message = "Gagal memuat data user";
        if (err instanceof Error) message = err.message;
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  return { user, loading, error };
};
