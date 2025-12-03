import { useState, useEffect } from "react";
import { IPostCart } from "../types/ICart";
import { api } from "../services/api";
import { ApiResponse } from "../types/ApiResponse";

export const useCart = () => {
  const [cart, setCart] = useState<IPostCart[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCartAll = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.getCartAll();
        const result = response.data as ApiResponse<IPostCart[]>;

        setCart(result.data);
      } catch (err) {
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) errorMessage = err.message;

        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getCartAll();
  }, []);

  return { cart, loading, error };
};
