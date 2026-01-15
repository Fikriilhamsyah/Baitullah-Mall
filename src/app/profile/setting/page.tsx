"use client"

import React from 'react'
import Link from 'next/link'

// Component
import { Button } from '@/components/ui/Button'

// Icon
import { ChevronLeft, Settings, Trash2, Info } from 'lucide-react'

// Context
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/context/ModalContext";
import ResetPassword from '@/components/features/auth/ResetPassword';

const setting = () => {
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;
  const openModal = useModal(s => s.openModal);
  const closeModal = useModal(s => s.closeModal);

  const user = useAuth((state) => state.user);

  const handleToResetPassword = () => {
    closeModal();
    setTimeout(() => {
      openModal({
        size: "md",
        mobileMode: "full",
        content: <ResetPassword />,
      });
    }, 250);
  };

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 space-y-4">
        <Link
          href="/profile"
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali ke Profil
        </Link>

        <h2 className="text-lg font-semibold">Akun Saya</h2>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-12">
            <div className="bg-white border border-neutral-300 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-4">
                <Settings className="h-5 w-5" />
                <h1 className="text-md font-semibold">Pengaturan</h1>
              </div>
              <div className="grid grid-cols-12 items-center justify-between gap-3">
                <div className="col-span-10 space-y-2">
                  <div className="text-sm text-neutral-700">Ubah Password</div>
                  <div className="text-xs text-neutral-500">Terakhir diubah {user ? new Date(user.updated_at).toLocaleDateString() : ""}</div>
                </div>
                <div className="col-span-2 flex justify-end"><Button color='primary' label='Ubah' onClick={handleToResetPassword} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-12">
            <div className="bg-white border border-neutral-300 rounded-xl p-6">
              <div className="flex items-center gap-1 mb-4">
                <Trash2 className="h-5 w-5 text-danger-500" />
                <h1 className="text-md font-semibold">Hapus Akun</h1>
              </div>
              <div className="grid grid-cols-12 items-center justify-between gap-3">
                <div className="col-span-10 space-y-2">
                  <div className="text-sm text-neutral-700">Hapus Akun Anda</div>
                  <div className="text-xs text-neutral-500">Menghapus akun akan menghilangkan seluruh data profil, alamat, dan histori transaksi. Tindakan ini tidak dapat dibatalkan</div>
                </div>
                <div className="col-span-2 flex justify-end"><Button color='danger' label='Hapus' /></div>
              </div>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="flex items-start gap-2 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg p-3">
          <Info className="h-4 w-4 mt-[2px] flex-shrink-0 text-neutral-400" />
          <p>
            Demi keamanan akun, pastikan kata sandi Anda diperbarui secara berkala dan
            jangan membagikan informasi akun kepada siapa pun.
          </p>
        </div>
      </div>
    </div>
  )
}

export default setting