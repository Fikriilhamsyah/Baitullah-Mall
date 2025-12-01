import { useState, useEffect } from "react";
import { IProduct } from "../types/IProduct";
import { api } from "../services/api";
import { ApiResponse } from "@/types/ApiResponse";

export const useProductById = (id: number | string | null) => {
  const numericId = Number(id);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numericId || isNaN(numericId)) {
      setError("ID tidak valid");
      return;
    }

    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getProductById(numericId);
        const result = response.data as ApiResponse<IProduct>;

        setProduct(result.data ?? null);
      } catch (err) {
        let errorMessage = "Produk tidak ditemukan";
        if (err instanceof Error) errorMessage = err.message;

        setError(errorMessage);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [numericId]);

  return { product, loading, error };
};
