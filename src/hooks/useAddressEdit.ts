import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPostAddress } from "@/types/IAddress";

let isEditingAddress = false;

export const useAddressEdit = () => {
  const [data, setData] = useState<IPostAddress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoutFn = useAuth.getState().logout;

  const editAddress = async (addressId: number, payload: IPostAddress) => {
    if (isEditingAddress) {
      throw new Error("Alamat sedang diproses");
    }

    isEditingAddress = true;

    try {
      setLoading(true);
      setError(null);

      const response = await api.postEditAddress(addressId, payload);
      const result = response.data as ApiResponse<IPostAddress>;

      setData(result.data ?? null);

      window.dispatchEvent(
        new CustomEvent("address:updated", {
          detail: { addressId, data: result.data },
        })
      );

      return result;
    } catch (err: any) {
      const status = err?.response?.status;

      if ((status === 401 || status === 403) && logoutFn) {
        logoutFn();
        throw new Error("Sesi Anda berakhir");
      }

      const message =
        status === 429
          ? "Terlalu banyak permintaan"
          : err?.response?.data?.message ?? "Gagal memperbarui alamat";

      setError(message);
      throw new Error(message);
    } finally {
      isEditingAddress = false;
      setLoading(false);
    }
  };

  return { editAddress, data, loading, error };
};
