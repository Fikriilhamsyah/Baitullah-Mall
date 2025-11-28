import { useState, useEffect } from "react";
import { ICategory } from "../types/ICategory";
import { api } from "../services/api"; // 📌 sekarang pakai API asli
// import { mockApi } from "../services/api"; // bisa hapus kalau sudah tidak dipakai

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getCategories();
        setCategories(response.data);

      } catch (err) {
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) errorMessage = err.message;

        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return { categories, loading, error };
};
