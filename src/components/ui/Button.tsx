"use client";
import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "normal" | "rounded" | "rounded-full";
type ButtonColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "outline"
  | "custom";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  iconRight?: React.ComponentType<{ className?: string }>; // ikon opsional di kanan
  loading?: boolean;
  variant?: ButtonVariant;
  color?: ButtonColor;
  customColor?: {
    bg?: string;
    text?: string;
    border?: string;
    hoverBg?: string;
    hoverText?: string;
    hoverBorder?: string;
  };
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  iconRight: IconRight,
  loading = false,
  variant = "normal",
  color = "primary",
  customColor,
  fullWidth = false,
  className = "",
  ...props
}) => {
  // 🟩 Radius berdasarkan variant
  const radius =
    variant === "rounded"
      ? "rounded-lg"
      : variant === "rounded-full"
      ? "rounded-full"
      : "rounded-md";

  // 🎨 Warna default berdasarkan color
  const baseColor =
    color === "primary"
      ? "bg-primary-500 hover:bg-primary-600 text-white border border-primary-500"
      : color === "secondary"
      ? "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
      : color === "success"
      ? "bg-green-500 hover:bg-green-600 text-white border border-green-500"
      : color === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white border border-red-500"
      : color === "outline"
      ? "bg-transparent hover:bg-gray-50 text-gray-800 border border-gray-300"
      : customColor
      ? `
        ${customColor.bg ?? "bg-transparent"}
        ${customColor.text ?? "text-gray-800"}
        ${customColor.border ? `border ${customColor.border}` : ""}
        ${customColor.hoverBg ? `hover:${customColor.hoverBg}` : ""}
        ${customColor.hoverText ? `hover:${customColor.hoverText}` : ""}
        ${customColor.hoverBorder ? `hover:${customColor.hoverBorder}` : ""}
      `
      : "bg-gray-200 text-gray-700 border border-gray-300";

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2 font-medium text-[8px] md:text-sm transition-all duration-200
        ${baseColor}
        ${radius}
        ${fullWidth ? "w-full" : ""}
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {/* Loader */}
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

      {/* Label */}
      {label && <span className="block">{label}</span>}

      {/* Ikon di kanan (opsional) */}
      {IconRight && !loading && <IconRight className="h-4 w-4" />}

      {/* Button tanpa icon */}
      {/* <Button label="Kirim Sekarang" color="primary" /> */}

      {/* Button dengan icon di kanan */}
      {/* <Button label="Lihat Selengkapnya" iconRight={ArrowRight} color="primary" /> */}

      {/* Button Rounded & Rounded Full */}
      {/* <Button label="Pesan" variant="rounded" color="success" />
      <Button label="Chat Admin" variant="rounded-full" color="outline" /> */}

      {/* Button custom warna */}
      {/* <Button
        label="Custom"
        variant="rounded"
        color="custom"
        customColor={{
          bg: "bg-yellow-400",
          text: "text-black",
          border: "border-yellow-500",
          hoverBg: "bg-yellow-500",
          hoverText: "text-white",
        }}
      /> */}

      {/* Button Full Width */}
      {/* <Button label="Checkout Sekarang" color="primary" fullWidth /> */}

      {/* Button Loading State */}
      {/* <Button label="Memproses..." loading color="primary" /> */}
    </button>
  );
};
