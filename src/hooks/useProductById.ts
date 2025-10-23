import { useState, useEffect } from "react";
import { Product } from "../types/product.types";
import { mockApi } from "../services/api";
// import { api } from '../services/api'; // Untuk API sungguhan

/**
 * Hook kustom untuk mengambil satu produk berdasarkan ID.
 * @param id - ID produk yang akan diambil
 */
export const useProductById = (id: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // Jangan lakukan apa-apa jika tidak ada ID
      setProduct(null);
      return;
    }

    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- PENGGUNAAN AXIOS SEBENARNYA (Contoh) ---
        // const response = await api.getProductById(id);
        // setProduct(response.data);
        // --- --------------------------------- ---

        // Menggunakan mock API untuk demo
        const response = await mockApi.fetchProductById(id);
        setProduct(response.data || null);
      } catch (err) {
        let errorMessage = "Produk tidak ditemukan";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [id]); // Dependensi [id], hook ini akan jalan lagi jika id berubah

  return { product, loading, error };
};
