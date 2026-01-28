import React, {useEffect} from 'react'

// Context
import { useModal } from "@/context/ModalContext";

// Hooks
import { useAddress } from "@/hooks/useAddress";
import { useAddressDelete } from "@/hooks/useAddressDelete";
import { useAuth } from "@/context/AuthContext";

// Components
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import AddressForm from '@/components/features/address/AddressForm';
import ConfirmDeleteModal from '@/components/features/address/ConfirmDeleteModal';

// Icons
import { ChevronLeft, Trash2, Info, SquarePen } from "lucide-react";
import Link from 'next/link';

const address: React.FC = () => {
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
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
        {/* Back */}
        <Link
          href="/profile"
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali ke Profil
        </Link>

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
                  <button>
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
        <div className="flex items-start gap-2 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
          <Info className="h-4 w-4 mt-[2px] flex-shrink-0 text-neutral-400" />
          <p>
            Alamat ini akan digunakan sebagai alamat pengiriman utama saat proses
            checkout. Pastikan data alamat sudah benar.
          </p>
        </div>
      </div>
    </div>
  )
}

export default address