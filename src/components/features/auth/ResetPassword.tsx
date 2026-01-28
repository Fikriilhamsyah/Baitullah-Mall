"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";

// Context
import { useModal } from "@/context/ModalContext";

// Hooks
import { useResetPassword } from "@/hooks/useResetPassword";
import { useAuth } from "@/context/AuthContext";

// Components
import SignIn from "./SignIn";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const ResetPassword: React.FC = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { send, loading, error, success, setError } = useResetPassword();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useAuth((state) => state.user);

  const { showToast } = useToast();

  const [phone, setPhone] = useState<string>("");
  const resolvedPhone = user ? user.phone : phone;

  /** Validation sederhana */
  const validate = () => {
    const value = user?.phone ?? phone;
    const trimmed = value?.trim();

    if (!trimmed) return "Nomor telepon wajib diisi";
    if (trimmed.length < 6) return "Nomor telepon tidak valid";

    return null;
  };

  /** Trigger reset password (form submit) */
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setError && setError(null);

    const err = validate();
    if (err) {
      showToast(err, "warning");
      setErrorMessage(err);
      return;
    }

    try {
      const res = await send({
        phone: user ? user.phone : phone,
      });

      // asumsi API mengembalikan { success: boolean, data?: ..., message?: string }
      if (!res || res?.success === false) {
        const msg = res?.message ?? "Reset password gagal";
        showToast(msg, "error");
        setErrorMessage(msg);
        return;
      }

      showToast(res?.message ?? "Password baru telah dikirim lewat SMS.", "success");
      closeModal();
    } catch (e: any) {
      console.error(e);

      // jika API melempar error dengan response
      if (e?.response?.status === 404) {
        showToast("Nomor telepon tidak ditemukan", "error");
        setErrorMessage("Nomor telepon tidak ditemukan");
        return;
      }

      // fallback
      showToast("Terjadi kesalahan, coba lagi", "error");
      setErrorMessage("Terjadi kesalahan, coba lagi");
    }
  };

  const handleToSignIn = () => {
    closeModal();
    // buka modal SignIn setelah sedikit delay supaya animasi modal tidak tumpang tindih
    setTimeout(() => {
      openModal({
        title: "Masuk",
        size: "md",
        mobileMode: "full",
        content: <SignIn />,
      });
    }, 200);
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pb-10 lg:pb-0">
      <div className="space-y-4 w-full">
        {/* Form */}
        <form onSubmit={handleResetPassword} className="space-y-4 w-full">
          <InputField
            id="phone"
            name="phone"
            placeholder="Masukkan nomor telepon terdaftar"
            label="Nomor Telepon"
            type="number"
            value={user ? user.phone : phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>{if (!user) setPhone(e.target.value);}}
            required
            disabled={!!user}
          />

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {error && !errorMessage && <p className="text-red-500 text-sm">{error}</p>}

          <Button
            type="submit"
            label={loading ? "Mengirim..." : "Kirim"}
            color="primary"
            fullWidth
            disabled={loading}
          />
        </form>

        {/* Tombol kembali / ke SignIn (desktop) */}
        {pathname.startsWith("/profile") ? null : (
          <button
            className="hidden lg:block text-sm text-primary-600 text-center cursor-pointer"
            onClick={handleToSignIn}
            type="button"
          >
            Kembali / Masuk
          </button>
        )}
      </div>

      {/* Jika ingin tampilkan link SignIn di mobile, bisa diaktifkan */}
      {pathname.startsWith("/profile") ? null : (
        <div className="block lg:hidden w-full text-center mt-2">
          <button
            className="text-sm text-primary-600"
            onClick={handleToSignIn}
            type="button"
          >
            Kembali / Masuk
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
