"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "@/context/ModalContext";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import RadioGroup from "@/components/ui/RadioGroup";
import useAddress from "@/hooks/useAddress"; // gunakan hook yang baru
import AddressForm from "./AddressForm";
import { Trash2 } from "lucide-react";

/**
 * AddressList
 * - menampilkan list alamat (radio)
 * - tombol "Gunakan Alamat" akan dispatch event "address:selected"
 * - ikon tong sampah sekarang menghapus alamat setelah konfirmasi
 *
 * NOTE: endpoint DELETE diatur ke `/api/addresses/{id}` — sesuaikan jika path backend berbeda.
 */

const AddressList: React.FC = () => {
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { showToast } = useToast();

  const { address, loading, error, refetch } = useAddress();
  const [selectedShipper, setSelectedShipper] = useState<string | number>("");
  // track deleting state per-address to disable its trash while pending
  const [deletingMap, setDeletingMap] = useState<Record<string | number, boolean>>({});

  // jika ada error di hook, tampilkan toast (atau biarkan UI menampilkan)
  useEffect(() => {
    if (error) showToast(error, "error");
  }, [error, showToast]);

  // contoh: refetch saat komponen mount (hook sudah fetch otomatis, ini opsional)
  useEffect(() => {
    // jika ingin memastikan data paling baru on mount:
    void refetch();
  }, [refetch]);

  // jika address berubah dan ada satu alamat, auto-select
  useEffect(() => {
    if (Array.isArray(address) && address.length === 1) {
      setSelectedShipper(address[0].id);
    }
  }, [address]);

  // Helper untuk toggle deleting flag
  const setDeleting = (id: string | number, val: boolean) => {
    setDeletingMap((prev) => ({ ...prev, [id]: val }));
  };

  // Hapus alamat: memanggil DELETE ke backend, lalu refetch
  const handleDeleteAddress = async (id: string | number) => {
    // simple confirm
    const confirm = window.confirm("Hapus alamat ini? Tindakan ini tidak dapat dibatalkan.");
    if (!confirm) return;

    try {
      setDeleting(id, true);
      // contoh endpoint; sesuaikan jika backend anda berbeda
      const endpoint = `/api/addresses/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include", // aktifkan jika butuh cookie auth
      });

      if (!res.ok) {
        // try parse json message
        let msg = `Gagal menghapus alamat (status ${res.status})`;
        try {
          const body = await res.json();
          if (body?.message) msg = body.message;
        } catch (e) {
          // ignore parse error
        }
        showToast(msg, "error");
        return;
      }

      showToast("Alamat berhasil dihapus.", "success");
      // jika yang dihapus sedang terpilih, clear selection
      if (String(selectedShipper) === String(id)) {
        setSelectedShipper("");
        // dispatch null? kita hanya close modal and let checkout handle no selection
      }
      // refetch list
      await refetch();
    } catch (err: any) {
      console.error("Delete address failed:", err);
      showToast(err?.message ?? "Gagal menghapus alamat.", "error");
    } finally {
      setDeleting(id, false);
    }
  };

  // saat submit (Gunakan Alamat) -> dispatch event berisi objek address terpilih
  const handleUseAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipper) {
      showToast("Pilih alamat terlebih dahulu.", "warning");
      return;
    }

    const selected = address.find(
      (a: any) =>
        String(a.id) === String(selectedShipper) || a.id === selectedShipper
    );
    if (!selected) {
      showToast("Alamat tidak ditemukan. Silakan muat ulang.", "error");
      return;
    }

    // Dispatch event global supaya page lain (checkout) menangkap perubahan
    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(new CustomEvent("address:selected", { detail: selected }));
      } catch (err) {
        // fallback: gunakan event yang lebih dasar
        const ev = new CustomEvent("address:selected", { detail: selected });
        window.dispatchEvent(ev);
      }
    }

    showToast("Alamat dipilih.", "success");
    try {
      closeModal();
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pt-5 pb-10 lg:pb-0">
      <div className="space-y-4 w-full">
        <form
          className="space-y-4 w-full"
          onSubmit={handleUseAddress}
        >
          {loading ? (
            <div className="p-4">Memuat alamat...</div>
          ) : address.length === 0 ? (
            <div className="p-4 text-sm text-gray-600">Belum ada alamat. Silakan tambahkan.</div>
          ) : (
            <RadioGroup
              name="shipping"
              options={address.map((col) => ({
                value: col.id,
                content: (
                  <div
                    className="flex justify-between items-start border-b border-neutral-200 pb-2"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-sm md:text-md">{`${col.nama_lengkap} • ${col.nomor_telepon}`}</div>
                      <div className="text-xs md:text-sm text-gray-500">{`${col.detail_alamat}, ${col.kelurahan ?? ""}, ${col.kecamatan ?? ""}, ${col.kabupaten ?? ""}, ${col.provinsi ?? ""}`}</div>
                    </div>

                    {/* Tombol hapus: stopPropagation supaya tidak memilih radio */}
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        // jika sudah sedang menghapus, ignore
                        if (deletingMap[col.id]) return;
                        void handleDeleteAddress(col.id);
                      }}
                      aria-label={`Hapus alamat ${col.nama_lengkap}`}
                      disabled={!!deletingMap[col.id]}
                      title={deletingMap[col.id] ? "Menghapus..." : "Hapus alamat"}
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
                  content: (<AddressForm />),
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
