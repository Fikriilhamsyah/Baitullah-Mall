import { useEffect, useState } from "react";
import { IJenis } from "@/types/IProduct";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";

export const usePaymentType = () => {
  const [paymentType, setPaymentType] = useState<IJenis[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPaymentType = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.getPaymentType();
        const result = res.data as ApiResponse<IJenis[]>;
        setPaymentType(result.data);

      } catch (err) {
        console.error("useCategories Error: ", err);

        let errorMessage = "Gagal memuat kategori";
        if (err instanceof Error) errorMessage = err.message;

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    getPaymentType();
  }, []);

  return { paymentType, loading, error };
};
