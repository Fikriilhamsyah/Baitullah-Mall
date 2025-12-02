"use client";

import React, { useState } from "react";

// Context
import { useModal } from "@/context/ModalContext";

// Hooks
import { useResetPassword } from "@/hooks/useResetPassword";

// Components
import SignIn from "./SignIn";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

const ResetPassword: React.FC = () => {
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { send, loading, error, success, setError } = useResetPassword();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  const [phone, setPhone] = useState<string>("");

  /** Validation sederhana */
  const validate = () => {
    const trimmed = phone.trim();
    if (!trimmed) return "Nomor telepon wajib diisi";
    // opsional: validasi format minimal (mis. 8 karakter)
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
      const res = await send({ phone });

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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
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
        <button
          className="hidden lg:block text-sm text-primary-600 text-center cursor-pointer"
          onClick={handleToSignIn}
          type="button"
        >
          Kembali / Masuk
        </button>
      </div>

      {/* Jika ingin tampilkan link SignIn di mobile, bisa diaktifkan */}
      <div className="block lg:hidden w-full text-center mt-2">
        <button
          className="text-sm text-primary-600"
          onClick={handleToSignIn}
          type="button"
        >
          Kembali / Masuk
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
