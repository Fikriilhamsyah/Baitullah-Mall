import React from 'react'

// Components
import { Button } from '@/components/ui/Button'
import ResetPassword from '../../auth/ResetPassword'

// Types
import { IUser } from '@/types/IUser'

// Icon
import { Settings, Trash2, Info } from 'lucide-react'

// Context
import { useModal } from "@/context/ModalContext";

interface AccountProps {
  user: IUser | null
}

const Setting: React.FC<AccountProps> = ({ user }) => {
  const openModal = useModal(s => s.openModal);
  const closeModal = useModal(s => s.closeModal);

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
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-12">
        <div className="bg-white rounded-xl border border-neutral-300 p-6">
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
      <div className="col-span-12 lg:col-span-12">
        <div className="bg-white rounded-xl border border-neutral-300 p-6">
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

      {/* INFO */}
      <div className="col-span-12 lg:col-span-12">
        <div className="flex flex-col justify-center items-center gap-2 text-xs text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg p-3 h-[290px]">
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

export default Setting