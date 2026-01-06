"use client";

import React, { useEffect, useState } from "react";

// Context
import { useModal } from "@/context/ModalContext";

// Components
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import RadioGroup from "@/components/ui/RadioGroup";
import AddressForm from "./AddressForm";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

// Hooks
import { useAddress } from "@/hooks/useAddress";

// Icons
import { Trash2 } from "lucide-react";

const AddressList: React.FC = () => {
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { showToast } = useToast();

  const { address, loading, error, refetch } = useAddress();
  const [selectedShipper, setSelectedShipper] = useState<string | number>("");

  // track deleting per address
  const [deletingMap, setDeletingMap] = useState<Record<string | number, boolean>>({});

  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error, showToast]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (Array.isArray(address) && address.length === 1) {
      setSelectedShipper(address[0].id);
    }
  }, [address]);

  const setDeleting = (id: string | number, val: boolean) => {
    setDeletingMap((prev) => ({ ...prev, [id]: val }));
  };

  // DELETE ADDRESS (tanpa window.confirm)
  const handleDeleteAddress = async (id: string | number) => {
    try {
      setDeleting(id, true);

      const endpoint = `/api/addresses/${id}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        let msg = `Gagal menghapus alamat (status ${res.status})`;
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
        } catch {}
        showToast(msg, "error");
        return;
      }

      showToast("Alamat berhasil dihapus.", "success");

      if (String(selectedShipper) === String(id)) {
        setSelectedShipper("");
      }

      await refetch();
      closeModal();
    } catch (err: any) {
      console.error("Delete address failed:", err);
      showToast(err?.message ?? "Gagal menghapus alamat.", "error");
    } finally {
      setDeleting(id, false);
    }
  };

  const handleUseAddress = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedShipper) {
      showToast("Pilih alamat terlebih dahulu.", "warning");
      return;
    }

    const selected = address.find(
      (a: any) => String(a.id) === String(selectedShipper)
    );

    if (!selected) {
      showToast("Alamat tidak ditemukan. Silakan muat ulang.", "error");
      return;
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("address:selected", { detail: selected })
      );
    }

    showToast("Alamat dipilih.", "success");
    closeModal();
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pt-5 pb-10 lg:pb-0">
      <div className="space-y-4 w-full">
        <form className="space-y-4 w-full" onSubmit={handleUseAddress}>
          {loading ? (
            <div className="p-4">Memuat alamat...</div>
          ) : address.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">
              Belum ada alamat. Silakan tambahkan.
            </div>
          ) : (
            <RadioGroup
              name="shipping"
              options={address.map((col) => ({
                value: col.id,
                content: (
                  <div className="flex justify-between items-start border-b border-neutral-200 pb-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-sm md:text-md">
                        {`${col.nama_lengkap} • ${col.nomor_telepon}`}
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        {`${col.detail_alamat}`}
                        {/* {`
                          ${col.detail_alamat},
                          ${col.kelurahan ?? ""},
                          ${col.kecamatan ?? ""},
                          ${col.kabupaten ?? ""},
                          ${col.provinsi ?? ""}
                        `} */}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        openModal({
                          title: "Hapus Alamat",
                          size: "md",
                          mobileMode: "full",
                          content: (
                            <ConfirmDeleteModal
                              title="Hapus Alamat"
                              description="Apakah kamu yakin ingin menghapus alamat ini? Alamat yang dihapus tidak dapat dikembalikan."
                              loading={!!deletingMap[col.id]}
                              onCancel={() => closeModal()}
                              onConfirm={() => handleDeleteAddress(col.id)}
                            />
                          ),
                        });
                      }}
                      disabled={!!deletingMap[col.id]}
                      aria-label={`Hapus alamat ${col.nama_lengkap}`}
                    >
                      <Trash2 className="h-5 w-5 text-danger-500" />
                    </button>
                  </div>
                ),
              }))}
              selected={selectedShipper}
              onChange={(val) => setSelectedShipper(val)}
            />
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              label="Tambah Alamat"
              color="secondary"
              fullWidth
              onClick={() =>
                openModal({
                  title: "Alamat",
                  size: "md",
                  mobileMode: "full",
                  content: <AddressForm />,
                })
              }
            />
            <Button
              type="submit"
              label="Gunakan Alamat"
              color="primary"
              fullWidth
              disabled={loading || address.length === 0}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressList;
