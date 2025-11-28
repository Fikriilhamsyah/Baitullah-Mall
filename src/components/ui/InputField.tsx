"use client";
import React, { useState } from "react";
import { cn } from "@utils/helpers";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "rounded";
  type?: "text" | "number" | "textarea" | "select" | "email" | "password";
  options?: { value: string; label: string }[];
  autoComplete?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  icon: Icon,
  variant = "default",
  type = "text",
  options = [],
  className,
  value,
  onChange,
  autoComplete,
  id,
  name,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  /** FIELD ERROR (jika required & sudah disentuh & kosong) */
  const hasError = required && isTouched && (!value || value === "");

  const roundedStyle =
    variant === "rounded" ? "rounded-full" : "rounded-lg";

  const baseClasses = cn(
    "w-full bg-white text-neutral-800 border border-gray-300",
    "focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all",
    Icon ? "pl-10" : "pl-4",
    "pr-10 py-2", // pr-10 agar ada space jika password icon kanan
    roundedStyle,
    className
  );

  // 🔹 Mencegah input negatif type=number
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || Number(value) >= 0) {
      onChange?.(e);
    } else {
      e.target.value = "0";
      onChange?.(e);
    }
  };

  // 🔹 Select tetap sync
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e as any);
  };

  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Icon kiri */}
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 text-neutral-600 pointer-events-none"
          />
        )}

        {/* TEXTAREA */}
        {type === "textarea" ? (
          <textarea
            id={id}
            name={name}
            {...(props as any)}
            className={cn(
              baseClasses,
              "resize-none h-24",
              variant === "rounded" && "rounded-lg"
            )}
          />

        ) : type === "select" ? (
          // SELECT INPUT
          <select
            id={id}
            name={name}
            value={value ?? ""}
            onChange={handleSelectChange}
            {...(props as any)}
            className={baseClasses}
          >
            <option value="">Pilih Semua...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

        ) : type === "number" ? (
          // NUMBER INPUT
          <input
            id={id}
            name={name}
            {...props}
            type="number"
            min={0}
            inputMode="numeric"
            pattern="[0-9]*" 
            value={value}
            onChange={handleNumberChange}
            autoComplete={autoComplete}
            className={baseClasses}
          />

        ) : type === "email" ? (
          <input
            id={id}
            name={name}
            {...props}
            type="email"
            inputMode="email"
            autoComplete={autoComplete ?? "email"}
            value={value}
            onChange={onChange}
            className={baseClasses}
          />

        ) : type === "password" ? (
          // PASSWORD INPUT + TOGGLE
          <>
            <input
              id={id}
              name={name}
              {...props}
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={onChange}
              autoComplete={autoComplete ?? "current-password"}
              className={baseClasses}
            />

            <button
              type="button"
              className="absolute right-3 text-neutral-600 hover:text-neutral-900 transition"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </>

        ) : (
          // INPUT DEFAULT
          <input
            id={id}
            name={name}
            {...props}
            type={type}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
            className={baseClasses}
          />
        )}

        {/* ERROR MESSAGE */}
        {hasError && (
          <p className="text-xs text-red-500">Field ini wajib diisi</p>
        )}
      </div>

      {/* Contoh Penggunaan */}
      {/* Input default */}
      {/* <InputField placeholder="Cari produk..." icon={Search} /> */}

      {/* Rounded full */}
      {/* <InputField placeholder="Cari teman..." icon={User} variant="rounded" /> */}

      {/* Number */}
      {/* <InputField type="number" placeholder="Masukkan jumlah" label="Jumlah" /> */}

      {/* Textarea */}
      {/* <InputField type="textarea" label="Deskripsi Produk" placeholder="Tulis deskripsi..." /> */}

      {/* Select / Dropdown */}
      {/* <InputField
        type="select"
        label="Kategori Produk"
        options={[
          { value: "pakaian", label: "Pakaian & Ihram" },
          { value: "aksesoris", label: "Aksesoris Ibadah" },
        ]}
      /> */}
    </div>
  );
};
