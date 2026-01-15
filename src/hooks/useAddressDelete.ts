import { useState } from "react";
import { api } from "@/services/api";
import { ApiResponse } from "@/types/ApiResponse";
import { useAuth } from "@/context/AuthContext";
import { IPostAddress } from "@/types/IAddress";

let isDeletingAddress = false;

export const useAddressDelete = () => {
  const [data, setData] = useState<IPostAddress[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logoutFn = useAuth.getState().logout;

  const deleteAddress = async (addressId: number) => {
    if (isDeletingAddress) {
      throw new Error("Alamat sedang diproses");
    }

    isDeletingAddress = true;

    try {
      setLoading(true);
      setError(null);

      const response = await api.postDeleteAddress(addressId);
      const result = response.data as ApiResponse<IPostAddress[]>;

      setData(Array.isArray(result.data) ? result.data : null);

      window.dispatchEvent(
        new CustomEvent("address:deleted", { detail: { addressId } })
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
          : err?.message ?? "Gagal menghapus alamat";

      setError(message);
      throw new Error(message);
    } finally {
      isDeletingAddress = false;
      setLoading(false);
    }
  };

  return { deleteAddress, data, loading, error };
};
