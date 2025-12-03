import { useState, useEffect } from "react";
import { ICartByIdUser } from "../types/ICart";
import { api } from "../services/api";
import { ApiResponse } from "../types/ApiResponse";
import { useAuth } from "@/context/AuthContext";

export const useCartByIdUser = () => {
  const [cartByIdUser, setCartByIduser] = useState<ICartByIdUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuth((state) => state.user);

  useEffect(() => {
    let mounted = true;

    const getCartByIdUser = async () => {
      if(!user){
        if(mounted){
          setCartByIduser([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        if (mounted) {
          setLoading(true);
          setError(null);
        }

        setLoading(true);
        setError(null);

        const response = await api.getCartByIdUser(user.id);

        if (!mounted) return;

        const result = response.data as ApiResponse<ICartByIdUser[]>;

        setCartByIduser(result.data);
      } catch (err) {
        let errorMessage = "Terjadi kesalahan";
        if (err instanceof Error) errorMessage = err.message;

        if (mounted) {
          setError(errorMessage);
          console.error(err);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getCartByIdUser();

    return () => {
      mounted = false;
    };
  }, [user]);

  return { cartByIdUser, loading, error };
};
