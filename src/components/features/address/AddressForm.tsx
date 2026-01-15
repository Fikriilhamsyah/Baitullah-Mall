// components/AddressForm.tsx (full file)
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Context
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";

// Utils / hooks
import { useRajaOngkirProvince } from "@/hooks/useRajaOngkirProvince";
import { useRajaOngkirCities } from "@/hooks/useRajaOngkirCities";
import { useRajaOngkirDistricts } from "@/hooks/useRajaOngkirDistricts";
import { useRajaOngkirSubdistricts } from "@/hooks/useRajaOngkirSubdistricts";

// Hooks
import { useLogin } from "@/hooks/useLogin";
import { useAddressPost } from "@/hooks/useAddressPost";
import { useAddressEdit } from "@/hooks/useAddressEdit";

// Type
import { IPostAddress } from "@/types/IAddress";

// Components
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface AddressFormProps {
  mode?: "create" | "edit";
  initialData?: any;
}

const AddressForm: React.FC<AddressFormProps> = ({
  mode = "create",
  initialData,
}) => {
  const router = useRouter(); // used to refresh after success
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { login, loading: loginLoading } = useLogin();
  const {
    province: provinceData = [],
    loading: loadingProvince,
    error: errorProvince,
  } = useRajaOngkirProvince();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useAuth((s) => s.user);

  const { showToast } = useToast();

  // hook untuk post address
  const { postAddress, data: postedData, loading: postingAddress, error: postAddressError } = useAddressPost();
  const { editAddress, loading: editingAddress } = useAddressEdit();

  // street/detail yang diinput user (jalan, gedung, no rumah)
  const [fullAddress, setFullAddress] = useState("");

  // kontak
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // store selected ids as string (InputField returns string values)
  // these hold the id values (string), used by RajaOngkir hooks and sent as *_id in payload
  const [province, setProvince] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [subdistrict, setSubdistrict] = useState<string>("");

  // parse numeric ids to pass to dependent hooks (or undefined when not selected)
  const provinceId = useMemo(() => (province ? Number(province) : undefined), [province]);
  const cityId = useMemo(() => (city ? Number(city) : undefined), [city]);
  const districtId = useMemo(() => (district ? Number(district) : undefined), [district]);

  // hooks for dependent selects (they expect numeric ids)
  const { cities, loading: loadingCities, error: errorCities } = useRajaOngkirCities(provinceId);
  const { districts, loading: loadingDistricts, error: errorDistricts } = useRajaOngkirDistricts(cityId);
  const { subdistricts, loading: loadingSubdistricts, error: errorSubdistricts } = useRajaOngkirSubdistricts(districtId);

  // show toast when dependent hook errors (optional UX)
  useEffect(() => {
    if (errorCities) showToast(errorCities, "error");
  }, [errorCities, showToast]);
  useEffect(() => {
    if (errorDistricts) showToast(errorDistricts, "error");
  }, [errorDistricts, showToast]);
  useEffect(() => {
    if (errorSubdistricts) showToast(errorSubdistricts, "error");
  }, [errorSubdistricts, showToast]);

  // postAddress error -> toast
  useEffect(() => {
    if (postAddressError) showToast(postAddressError, "error");
  }, [postAddressError, showToast]);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFullName(initialData.nama_lengkap ?? "");
      setPhoneNumber(initialData.nomor_telepon ?? "");
      setProvince(String(initialData.provinsi_id ?? ""));
      setCity(String(initialData.kabupaten_id ?? ""));
      setDistrict(String(initialData.kecamatan_id ?? ""));
      setSubdistrict(String(initialData.kelurahan_id ?? ""));
      setFullAddress(initialData.detail_alamat ?? "");
    }
  }, [mode, initialData]);

  /** Lookup labels (names) for selected ids so combinedAddress shows names */
  const provinceLabel = useMemo(() => {
    return provinceData.find((p: any) => String(p.id) === String(province))?.name ?? "";
  }, [provinceData, province]);

  const cityLabel = useMemo(() => {
    return (cities || []).find((c: any) => String(c.id) === String(city))?.name ?? "";
  }, [cities, city]);

  const districtLabel = useMemo(() => {
    return (districts || []).find((d: any) => String(d.id) === String(district))?.name ?? "";
  }, [districts, district]);

  const subdistrictLabel = useMemo(() => {
    return (subdistricts || []).find((s: any) => String(s.id) === String(subdistrict))?.name ?? "";
  }, [subdistricts, subdistrict]);

  // Combined human-readable address (readonly) — fullAddress is the street part the user types
  const combinedAddress = useMemo(() => {
    const parts: string[] = [];
    if (fullAddress && fullAddress.trim() !== "") parts.push(fullAddress.trim());
    if (subdistrictLabel) parts.push(subdistrictLabel);
    if (districtLabel) parts.push(districtLabel);
    if (cityLabel) parts.push(cityLabel);
    if (provinceLabel) parts.push(provinceLabel);
    return parts.join(", ");
  }, [fullAddress, subdistrictLabel, districtLabel, cityLabel, provinceLabel]);

  /** Validation sederhana */
  const validate = () => {
    if (!fullName.trim()) return "Nama wajib diisi";
    if (!phoneNumber.trim()) return "Nomor telepon wajib diisi";
    if (!fullAddress.trim()) return "Detail alamat (jalan/gedung/No.) wajib diisi";
    if (!provinceLabel.trim()) return "Provinsi wajib dipilih";
    if (!cityLabel.trim()) return "Kota wajib dipilih";
    if (!districtLabel.trim()) return "Kecamatan wajib dipilih";
    if (!subdistrictLabel.trim()) return "Desa / Kelurahan wajib dipilih";
    return null;
  };

  /**
   * Submit: build payload that contains both id fields and name fields
   * - IDs are numeric (provinsi_id, kabupaten_id, kecamatan_id, kelurahan_id)
   * - Names are provinsi/kabupaten/kecamatan/kelurahan (string)
   * - detail_alamat contains only street/jalan (fullAddress)
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      showToast("Silakan masuk terlebih dahulu.", "warning");
      return;
    }

    const err = validate();
    if (err) {
      showToast(err, "warning");
      return;
    }

    const payload = {
      user_id: Number(user.id),
      nama_lengkap: fullName,
      nomor_telepon: phoneNumber,
      provinsi_id: Number(province),
      kabupaten_id: Number(city),
      kecamatan_id: Number(district),
      kelurahan_id: Number(subdistrict),
      provinsi: province,
      kabupaten: city,
      kecamatan: district,
      kelurahan: subdistrict,
      detail_alamat: combinedAddress,
    } as IPostAddress;

    try {
      if (mode === "edit" && initialData?.id) {
        await editAddress(initialData.id, payload);
        showToast("Alamat berhasil diperbarui.", "success");
      } else {
        await postAddress(payload);
        showToast("Alamat berhasil ditambahkan.", "success");
      }

      window.dispatchEvent(new CustomEvent("address:refresh"));
      closeModal();
    } catch (err: any) {
      showToast(err?.message ?? "Gagal menyimpan alamat.", "error");
    }
  };

  // saat upstream berubah, clear downstream selections
  const handleProvinceChange = (value: string) => {
    setProvince(value);
    setCity("");
    setDistrict("");
    setSubdistrict("");
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setDistrict("");
    setSubdistrict("");
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setSubdistrict("");
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full pb-10 lg:pb-0">
      <div className="space-y-4 w-full pb-10 lg:pb-0">
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <InputField
            id="fullName"
            name="fullName"
            placeholder="Masukkan nama lengkap"
            label="Nama Lengkap"
            autoComplete="name"
            value={fullName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            required
          />

          <InputField
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Masukkan nomor telepon"
            label="Nomor Telepon"
            type="number"
            value={phoneNumber}
            autoComplete="tel"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
            required
          />

          {/* PROVINCE (value = id, label = name) */}
          <InputField
            id="province"
            name="province"
            placeholder={loadingProvince ? "Memuat provinsi..." : "Pilih provinsi"}
            label="Provinsi"
            type="select"
            options={provinceData.map((col: any) => ({ value: String(col.id), label: col.name }))}
            value={province}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleProvinceChange(e.target.value)}
            required
            disabled={loadingProvince}
          />

          {/* CITY */}
          <InputField
            id="city"
            name="city"
            placeholder={!province ? "Pilih provinsi dahulu" : loadingCities ? "Memuat kota..." : "Pilih kota"}
            label="Kota"
            type="select"
            options={(cities || []).map((c: any) => ({ value: String(c.id), label: c.name }))}
            value={city}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleCityChange(e.target.value)}
            required
            disabled={!province || loadingCities}
          />

          {/* DISTRICT */}
          <InputField
            id="district"
            name="district"
            placeholder={!city ? "Pilih kota dahulu" : loadingDistricts ? "Memuat kecamatan..." : "Pilih kecamatan"}
            label="Kecamatan"
            type="select"
            options={(districts || []).map((d: any) => ({ value: String(d.id), label: d.name }))}
            value={district}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleDistrictChange(e.target.value)}
            required
            disabled={!city || loadingDistricts}
          />

          {/* SUBDISTRICT */}
          <InputField
            id="subdistrict"
            name="subdistrict"
            placeholder={!district ? "Pilih kecamatan dahulu" : loadingSubdistricts ? "Memuat desa..." : "Pilih desa/kelurahan"}
            label="Desa / Kelurahan"
            type="select"
            options={(subdistricts || []).map((s: any) => ({ value: String(s.id), label: s.name }))}
            value={subdistrict}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubdistrict(e.target.value)}
            required
            disabled={!district || loadingSubdistricts}
          />

          {/* Textarea: input jalan/gedung/No. */}
          <InputField
            id="fullAddressStreet"
            name="fullAddressStreet"
            placeholder="Masukkan nama jalan, gedung, No. Rumah"
            label="Detail Alamat (Jalan, Gedung, No.)"
            type="textarea"
            value={fullAddress}
            autoComplete="street-address"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFullAddress(e.target.value)}
            required
          />

          {/* Readonly combined address (tampilkan nama wilayah + jalan) */}
          <InputField
            id="fullAddressCombined"
            name="fullAddressCombined"
            placeholder="Alamat lengkap akan tampil di sini"
            label="Alamat Lengkap"
            type="textarea"
            value={combinedAddress}
            onChange={() => {}}
            autoComplete="off"
            className="cursor-not-allowed"
            disabled
          />

          {user && (
            <div className="hidden">
              <InputField
                id="idUser"
                name="idUser"
                placeholder="User ID"
                label="User ID"
                type="text"
                value={String(user.id)}
                autoComplete="username"
                onChange={() => {}}
                required={false}
                disabled
              />
            </div>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <Button
            type="submit"
            label={postingAddress || loginLoading ? "Loading..." : "Tambahkan Alamat"}
            color="primary"
            fullWidth
            disabled={postingAddress || loginLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
