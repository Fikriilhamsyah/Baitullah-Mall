import { useState, useEffect } from "react";
import { Product } from "../types/IProduct";
import { mockApi } from "../services/api";
// import { api } from '../services/api'; // Untuk API sungguhan

/**
 * Hook kustom untuk mengambil semua produk.
 * Mengelola state loading, error, dan data produk.
 */
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // --- PENGGUNAAN AXIOS SEBENARNYA (Contoh) ---
        // const response = await api.getProducts();
        // setProducts(response.data);
        // --- --------------------------------- ---

        // Menggunakan mock API untuk demo
        const response = await mockApi.fetchProducts();
        setProducts(response.data);
      } catch (err) {
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []); // Dependensi kosong, dijalankan sekali saat mount

  return { products, loading, error };
};
