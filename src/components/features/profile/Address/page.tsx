"use client";

import React, { useEffect } from "react";

// Context
import { useModal } from "@/context/ModalContext";

// Hooks
import { useAddress } from "@/hooks/useAddress";

// Components
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import AddressForm from "../../address/AddressForm";
import ConfirmDeleteModal from "../../address/ConfirmDeleteModal";

// Icons
import { Trash2 } from "lucide-react";

const Address: React.FC = () => {
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { showToast } = useToast();

  const { address, loading, error, refetch } = useAddress();

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error, showToast]);

  const handleDeleteAddress = async (id: string | number) => {
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        let msg = "Gagal menghapus alamat.";
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
        } catch {}
        showToast(msg, "error");
        return;
      }

      showToast("Alamat berhasil dihapus.", "success");
      await refetch();
      closeModal();
    } catch (err: any) {
      console.error(err);
      showToast(err?.message ?? "Gagal menghapus alamat.", "error");
    }
  };

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
            onClick={() =>
              openModal({
                title: "Tambah Alamat",
                size: "md",
                mobileMode: "full",
                content: <AddressForm />,
              })
            }
          />
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="p-4 text-sm">Memuat alamat...</div>
        ) : address.length === 0 ? (
          <div className="p-4 text-sm text-neutral-600">
            Belum ada alamat. Silakan tambahkan.
          </div>
        ) : (
          <div className="space-y-3">
            {address.map((col: any) => (
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
                          onConfirm={() => handleDeleteAddress(col.id)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
