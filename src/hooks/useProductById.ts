import { useState, useEffect } from "react";
import { IProduct } from "../types/IProduct";
import { api } from "../services/api";

export const useProductById = (id: number | string | null) => {
  const numericId = Number(id); // pastikan ID berupa number

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 🔒 Validasi ID
    if (!numericId || isNaN(numericId)) {
      console.warn("useProductById: ID tidak valid:", id);
      setError("ID tidak valid");
      return;
    }

    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔥 API asli
        const response = await api.getProductById(numericId);
        setProduct(response.data ?? null);
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
