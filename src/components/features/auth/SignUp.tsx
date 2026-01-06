import React, { useState } from 'react'

// Context
import { useModal } from "@/context/ModalContext";

// Components
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { useToast } from "@/components/ui/Toast";
import SignIn from './SignIn';

// Hooks
import { useRegisterPost } from '@/hooks/useRegisterPost';


const SignUp = () => {
  const { register, loading, error } = useRegisterPost();
  const { closeModal, openModal } = useModal();
  const { showToast } = useToast();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordRules = {
    length: (v: string) => v.length >= 8,
    uppercase: (v: string) => /[A-Z]/.test(v),
    number: (v: string) => /\d/.test(v),
    special: (v: string) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
  };

  const isPasswordValid = (password: string) =>
    Object.values(passwordRules).every((rule) => rule(password));


  /** Validation sederhana */
  const validate = () => {
    if (!userName.trim()) return "Nama lengkap wajib diisi";
    if (!email.trim()) return "Email wajib diisi";
    if (!phoneNumber.trim()) return "Nomor Telepon wajib diisi";
    if (!password.trim()) return "Password wajib diisi";
    if (!isPasswordValid(password))
      return "Password belum memenuhi kriteria keamanan";
    if (password !== confirmPassword)
      return "Konfirmasi password tidak cocok";
    return null;
  };

  /** Trigger login */
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      showToast(validationError, "warning");
      return;
    }

    try {
      await register({ name: userName, email, phone: phoneNumber, password: confirmPassword, is_ustadz: false });

      showToast("Registrasi berhasil", "success");
      closeModal();
    } catch (err: any) {
      showToast(
        err?.message || "Terjadi kesalahan saat registrasi",
        "error"
      );
    }
  };

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

  const PasswordRule = ({
      label,
      valid,
    }: {
      label: string;
      valid: boolean;
    }) => (
      <div
        className={`flex items-center gap-2 ${
          valid ? "text-green-600" : "text-gray-400"
        }`}
      >
        <span>{valid ? "✔" : "•"}</span>
        <span>{label}</span>
      </div>
  );

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pb-10 lg:pb-0 space-y-4">
        <form onSubmit={handleSignUp} className="space-y-4 w-full">
            <InputField
              id="userName"
              name="userName"
              placeholder="Masukkan nama lengkap"
              label="Nama Lengkap"
              value={userName}
              autoComplete="userName"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
              required
            />
            <InputField
              id="email"
              name="email"
              placeholder="Masukkan alamat email"
              label="Email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
            <InputField
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Masukkan nomor hp"
              label="Nomor HP"
              type="number"
              value={phoneNumber}
              autoComplete="phoneNumber"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              required
            />
            <InputField
              id="password"
              name="password"
              placeholder="Masukkan password"
              label="Password"
              type="password"
              value={password}
              autoComplete="password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
            <div className="space-y-1 text-xs">
              <PasswordRule
                label="Minimal 8 karakter"
                valid={passwordRules.length(password)}
              />
              <PasswordRule
                label="Mengandung huruf besar"
                valid={passwordRules.uppercase(password)}
              />
              <PasswordRule
                label="Mengandung angka"
                valid={passwordRules.number(password)}
              />
              <PasswordRule
                label="Mengandung karakter khusus"
                valid={passwordRules.special(password)}
              />
            </div>

            <InputField
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Masukkan konfirmasi password"
              label="Konfirmasi Password"
              type="password"
              value={confirmPassword}
              autoComplete="confirmPassword"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              label={loading ? "Loading..." : "Daftar"}
              color="primary"
              fullWidth
              disabled={loading}
            />
        </form>
        <button
          className="text-sm text-primary-600 text-center cursor-pointer pb-4 md:pb-0"
          onClick={handleToSignIn}
        >
          Sudah Punya Akun?
        </button>
    </div>
  )
}

export default SignUp