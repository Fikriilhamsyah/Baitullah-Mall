"use client";

import React, { useState } from 'react';

// Context
import { useModal } from "@/context/ModalContext";
import { AuthContext } from '@/context/AuthContext';

// Utils
import { setAuthToken } from "@/utils/authCookie";

// Hooks
import { useLogin } from "@/hooks/useLogin";

// Components
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import SignUp from './SignUp';
import { useToast } from "@/components/ui/Toast";

const SignIn = () => {
  const openModal = useModal(s => s.openModal);
  const closeModal = useModal(s => s.closeModal);
  const { login, loading, error } = useLogin();
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /** Validation sederhana */
  const validate = () => {
    if (!email.trim()) return "Email wajib diisi";
    if (!password.trim()) return "Password wajib diisi";
    return null;
  };

  /** Trigger login */
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      showToast(err, "warning");
      return;
    }

    try {
      const res = await login({ email, password });
      if (!res) {
        showToast("Login gagal", "error");
        return; // *stop eksekusi*
      }

      // SIMPAN TOKEN KE COOKIE 7 HARI
      setAuthToken(res.token);

      // SIMPAN USER + TOKEN KE ZUSTAND
      AuthContext.getState().setUser(res.user);
      AuthContext.getState().setToken(res.token);

      showToast("Berhasil login", "success");
      
      closeModal();
    } catch (e: any) {
      console.error(e);

      /** Jika API balas 401 → password/email salah */
      if (e?.response?.status === 401) {
        showToast("Email atau password salah", "error");
        setErrorMessage("Email atau password salah");
        return;
      }

      /** Jika error lain tetap pakai fallback */
      showToast("Terjadi kesalahan, coba lagi", "error");
    }
  };

  const handleToSignUp = () => {
    closeModal();
    setTimeout(() => {
      openModal({
        size: "md",
        mobileMode: "full",
        content: <SignUp />,
      });
    }, 250);
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pb-10 lg:pb-0">

      <div className="space-y-4 w-full">
        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4 w-full">
            <InputField
                id="email"
                name="email"
                placeholder="Masukkan email"
                label="Email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <InputField
                id="password"
                name="password"
                placeholder="Masukkan password"
                label="Password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <Button
                type="submit"
                label={loading ? "Loading..." : "Masuk"}
                color="primary"
                fullWidth
                disabled={loading}
            />
        </form>

        <div className="flex justify-between items-center">
          <button className='text-sm text-primary-600'>
            Lupa Password?
          </button>

          <button
            className='hidden lg:block text-sm text-primary-600 text-center cursor-pointer'
            onClick={handleToSignUp}
          >
            Daftar Akun
          </button>
        </div>
      </div>

      {/* Mobile SignUp */}
      <button
        className='block lg:hidden text-sm text-primary-600 text-center cursor-pointer'
        onClick={handleToSignUp}
      >
        Daftar Akun
      </button>
    </div>
  );
};

export default SignIn;
