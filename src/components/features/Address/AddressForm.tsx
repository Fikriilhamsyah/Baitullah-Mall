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
import { useToast } from "@/components/ui/Toast";

const AddressForm = () => {
  const openModal = useModal(s => s.openModal);
  const closeModal = useModal(s => s.closeModal);
  const { login, loading, error } = useLogin();
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subdistrict, setSubdistrict] = useState("");

  /** Validation sederhana */
  const validate = () => {
    if (!fullName.trim()) return "Nama wajib diisi";
    if (!phoneNumber.trim()) return "Nomor telepon wajib diisi";
    if (!province.trim()) return "Provinsi wajib diisi";
    if (!city.trim()) return "Kota wajib diisi";
    if (!district.trim()) return "Kecamatan wajib diisi";
    if (!subdistrict.trim()) return "Desa wajib diisi";
    return null;
  };

  /** Trigger login */
  // const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const err = validate();
  //   if (err) {
  //     showToast(err, "warning");
  //     return;
  //   }

  //   try {
  //     const res = await login({ fullName });
  //     if (!res?.success) {
  //       showToast("Login gagal", "error");
  //       return;
  //     }

  //     // SIMPAN TOKEN KE COOKIE 7 HARI
  //     setAuthToken(res.token);

  //     // SIMPAN USER + TOKEN KE ZUSTAND
  //     AuthContext.getState().setUser(res.user);
  //     AuthContext.getState().setToken(res.token);

  //     showToast("Berhasil login", "success");
      
  //     closeModal();
  //   } catch (e: any) {
  //     console.error(e);

  //     /** Jika API balas 401 → password/email salah */
  //     if (e?.response?.status === 401) {
  //       showToast("Email atau password salah", "error");
  //       setErrorMessage("Email atau password salah");
  //       return;
  //     }

  //     /** Jika error lain tetap pakai fallback */
  //     showToast("Terjadi kesalahan, coba lagi", "error");
  //   }
  // };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pb-10 lg:pb-0">

      <div className="space-y-4 w-full">
        {/* Form */}
        <form
          // onSubmit={handleSignIn}
          className="space-y-4 w-full"
        >
            <InputField
                id="fullName"
                name="fullName"
                placeholder="Masukkan nama lengkap"
                label="Nama Lengkap"
                autoComplete="fullName"
                onChange={(e) => setFullName(e.target.value)}
                required
            />

            <InputField
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Masukkan nomor telepon"
                label="Nomor Telepon"
                type="number"
                value={phoneNumber}
                autoComplete="phoneNumber"
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
            />

            <InputField
                id="province"
                name="province"
                placeholder="Masukkan nomor telepon"
                label="Provinsi"
                type="select"
                options={[
                  { value: "jawa barat", label: "Jawa Barat" },
                  { value: "jawa timur", label: "Jawa Timur" },
                ]}
                required
            />

            <InputField
                id="city"
                name="city"
                placeholder="Masukkan kota"
                label="Kota"
                type="select"
                options={[
                  { value: "bogor", label: "Bogor" },
                  { value: "sukabumi", label: "Sukabumi" },
                ]}
                required
            />

            <InputField
                id="district"
                name="district"
                placeholder="Masukkan kota"
                label="Kecamatan"
                type="select"
                options={[
                  { value: "cisarua", label: "Cisarua" },
                  { value: "sukabumi", label: "Sukabumi" },
                ]}
                required
            />

            <InputField
                id="subdistrict"
                name="subdistrict"
                placeholder="Masukkan desa"
                label="Desa"
                type="select"
                options={[
                  { value: "cisarua", label: "Cisarua" },
                  { value: "sukabumi", label: "Sukabumi" },
                ]}
                required
            />

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <Button
                type="submit"
                label={loading ? "Loading..." : "Tambahkan Alamat"}
                color="primary"
                fullWidth
                disabled={loading}
            />
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
