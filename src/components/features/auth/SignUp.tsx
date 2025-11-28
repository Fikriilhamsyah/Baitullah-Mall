import React from 'react'

import { useModal } from "@/context/ModalContext";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import SignIn from './SignIn';

const SignUp = () => {
  const { closeModal, openModal } = useModal();

  const handleToSignIn = () => {
    closeModal();
    setTimeout(() => {
      openModal({
        size: "md",
        mobileMode: "full",
        content: <SignIn />,
      });
    }, 250);
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pb-10 lg:pb-0 space-y-4">
        <div className="space-y-4 w-full">
            <InputField placeholder="Masukkan nama lengkap" label="Nama Lengkap" required />
            <InputField placeholder="Masukkan alamat email" label="Email" required />
            <InputField placeholder="Masukkan nomor hp" label="Nomor HP" type="number" required />
            <InputField placeholder="Masukkan password" label="Password" type="password" required />
            <InputField placeholder="Masukkan konfirmasi password" label="Konfirmasi Password" type="password" required />
            <Button label="Daftar" color="primary" fullWidth />
        </div>
        <button
            className="text-sm text-primary-600 text-center cursor-pointer"
            onClick={handleToSignIn}
        >
            Sudah Punya Akun?
        </button>
    </div>
  )
}

export default SignUp