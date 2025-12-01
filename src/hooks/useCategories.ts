import { useState, useEffect } from "react";
import { ICategory } from "../types/ICategory";
import { api } from "../services/api";
import { ApiResponse } from "../types/ApiResponse";

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
        const result = response.data as ApiResponse<ICategory[]>;
        setCategories(result.data);
        
      } catch (err) {
        console.error("useCategories Error: ", err);

        let errorMessage = "Gagal memuat kategori";
        if (err instanceof Error) errorMessage = err.message;

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  return { categories, loading, error };
};
