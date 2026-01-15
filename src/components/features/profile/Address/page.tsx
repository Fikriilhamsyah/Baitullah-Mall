"use client";

import React, { useEffect } from "react";

// Context
import { useModal } from "@/context/ModalContext";

// Hooks
import { useAddress } from "@/hooks/useAddress";
import { useAddressDelete } from "@/hooks/useAddressDelete";
import { useAuth } from "@/context/AuthContext";

// Components
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import AddressForm from "../../address/AddressForm";
import ConfirmDeleteModal from "../../address/ConfirmDeleteModal";

// Icons
import { Trash2, Info, SquarePen } from "lucide-react";

const Address: React.FC = () => {
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { showToast } = useToast();

  const user = useAuth((state) => state.user);
  const { address, loading, error, refetch } = useAddress();
  const { deleteAddress, loading: loadingDeleteAddress, error: errorDeleteAddress } = useAddressDelete();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error, showToast]);

  const handleDelete = (addressId: number) => {
    deleteAddress(addressId)
      .then((response) => {
        showToast("Alamat berhasil dihapus.", "success");
        closeModal();
        refetch();
      })
      .catch((err) => {
        showToast(err?.message ?? "Gagal menghapus alamat.", "error");
        closeModal();
        refetch();
      });
  };

  const userAddresses = address.filter(
    (item: any) => item.user_id === user?.id
  );

  const MAX_ADDRESS = 10;
  const isMaxAddressReached = userAddresses.length >= MAX_ADDRESS;

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-neutral-900">
            Daftar Alamat
          </h2>

          <Button
            label="Tambah Alamat"
            color="primary"
            onClick={() => {
              if (isMaxAddressReached) {
                showToast(
                  `Maksimal ${MAX_ADDRESS} alamat. Hapus alamat lama untuk menambahkan yang baru.`,
                  "warning"
                );
                return;
              }

              openModal({
                title: "Alamat",
                size: "md",
                mobileMode: "full",
                content: <AddressForm />,
              });
            }}
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="p-4 text-sm">Memuat alamat...</div>
        ) : userAddresses.length === 0 ? (
          <div className="p-4 text-sm text-neutral-600">
            Belum ada alamat. Silakan tambahkan.
          </div>
        ) : (
          <div className="space-y-3">
            {userAddresses
              .filter((col: any) => col.user_id === user?.id)
              .map((col: any) => (
              <div
                key={col.id}
                className="flex justify-between items-start border border-neutral-300 rounded-lg p-4"
              >
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">
                    {col.nama_lengkap} • {col.nomor_telepon}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {col.detail_alamat}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openModal({
                        title: "Ubah Alamat",
                        size: "md",
                        mobileMode: "full",
                        content: (
                          <AddressForm
                            mode="edit"
                            initialData={col}
                          />
                        ),
                      })
                    }
                  >
                    <SquarePen className="h-5 w-5 text-neutral-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openModal({
                        title: "Hapus Alamat",
                        size: "md",
                        content: (
                          <ConfirmDeleteModal
                            title="Hapus Alamat"
                            description="Apakah kamu yakin ingin menghapus alamat ini?"
                            onCancel={closeModal}
                            onConfirm={() => handleDelete(col.id)}
                          />
                        ),
                      })
                    }
                    className="cursor-pointer"
                    aria-label="Hapus alamat"
                  >
                    <Trash2 className="h-5 w-5 text-danger-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INFO */}
        <div className="flex flex-col justify-center items-center gap-2 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg p-3 h-[290px]">
          <Info className="h-10 w-10 mt-[2px] flex-shrink-0 text-neutral-400" />
          <p className="text-sm">
            Alamat ini akan digunakan sebagai alamat pengiriman utama saat proses
            checkout. Pastikan data alamat sudah benar.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Address;
