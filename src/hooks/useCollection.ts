import { useState, useEffect } from "react";
import { ICollection } from "../types/ICollection";
import { api } from "../services/api"; // 📌 sekarang pakai API asli
// import { mockApi } from "../services/api"; // bisa hapus kalau sudah tidak dipakai

export const useCollection = () => {
  const [collection, setCollection] = useState<ICollection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCollection = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getCollection();
        setCollection(response.data);

      } catch (err) {
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) errorMessage = err.message;

        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCollection();
  }, []);

  return { collection, loading, error };
};
