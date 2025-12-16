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

    let mounted = true;

    const getProduct = async (attempt = 1) => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getProductById(numericId);
        const result = response.data as ApiResponse<IProduct>;

        if (mounted) setProduct(result.data ?? null);
      } catch (err: any) {
        if (!err?.response && attempt < 2) {
          return getProduct(attempt + 1);
        }

        const msg =
          err?.message?.includes("timeout")
            ? "Koneksi terlalu lambat"
            : err?.message ?? "Produk tidak ditemukan";

        if (mounted) setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getProduct();
    return () => {
      mounted = false;
    };
  }, [numericId]);

  return { product, loading, error };
};
