import { useState, useEffect } from "react";
import { Product } from "../types/IProduct";
import { mockApi } from "../services/api";

export const useProductById = (id: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jangan jalan kalau id tidak valid
    if (!id || id === "undefined" || id.trim() === "") {
      console.warn("useProductById: id kosong, fetch dibatalkan");
      return;
    }

    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching product ID:", id);

        // --- Gunakan API asli jika ada ---
        // const response = await api.getProductById(id);
        // setProduct(response.data);

        // --- Untuk demo gunakan mock API ---
        const response = await mockApi.fetchProductById(id);
        console.log("API Response:", response);
        setProduct(response?.data || null);
      } catch (err) {
        let errorMessage = "Produk tidak ditemukan";
        if (err instanceof Error) errorMessage = err.message;
        setError(errorMessage);
        console.error("useProductById Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]);

  return { product, loading, error };
};
