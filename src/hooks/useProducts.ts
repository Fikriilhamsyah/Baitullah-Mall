import { useState, useEffect } from "react";
import { IProduct } from "../types/IProduct";
import { api } from "../services/api";
import { ApiResponse } from "../types/ApiResponse";

export const useProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getProducts();
        const result = response.data as ApiResponse<IProduct[]>;

        setProducts(result.data);
      } catch (err) {
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) errorMessage = err.message;

        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return { products, loading, error };
};
