"use client";
import React from "react";
import { cn } from "@utils/helpers";
import { LucideIcon } from "lucide-react";

interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "rounded";
  type?: "text" | "number" | "textarea" | "select";
  options?: { value: string; label: string }[];
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
  ...props
}) => {
  const roundedStyle =
    variant === "rounded" ? "rounded-full" : "rounded-lg";

  const baseClasses = cn(
    "w-full bg-white text-neutral-800 border border-gray-300",
    "focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all",
    Icon ? "pl-10" : "pl-4",
    "pr-4 py-2",
    roundedStyle,
    className
  );

  // 🔹 Fungsi untuk mencegah input negatif di field number
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Kosongkan atau validasi agar tidak di bawah 0
    if (value === "" || Number(value) >= 0) {
      onChange?.(e);
    } else {
      // Reset ke 0 jika user masukkan negatif
      e.target.value = "0";
      onChange?.(e);
    }
  };

  // 🔹 Fungsi handler select agar tetap sinkron dengan state React
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
        {Icon && (
          <Icon
            size={18}
            className="absolute left-3 text-neutral-600 pointer-events-none"
          />
        )}

        {type === "textarea" ? (
          <textarea
            {...(props as any)}
            className={cn(
              baseClasses,
              "resize-none h-24",
              variant === "rounded" && "rounded-lg" // biar textarea tetap natural
            )}
          />
        ) : type === "select" ? (
          <select
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
          <input
            {...props}
            type="number"
            min={0}
            value={value}
            onChange={handleNumberChange}
            className={baseClasses}
          />
        ) : (
          <input {...props} type={type} className={baseClasses} />
        )}
      </div>

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
