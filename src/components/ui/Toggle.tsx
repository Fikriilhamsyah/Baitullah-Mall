"use client";
import React from "react";
import { cn } from "@utils/helpers";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  placeholder,
  disabled = false,
  className,
}) => {
  return (
    <label
      className={cn(
        "grid grid-cols-12 items-center justify-between gap-3 cursor-pointer select-none w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="col-span-10 space-y-2">
        {/* LABEL */}
        {label && (
            <div className="text-sm text-neutral-700">{label}</div>
        )}
        {placeholder && (
            <div className="text-xs text-neutral-500">{placeholder}</div>
        )}
      </div>
      {/* SWITCH */}
      <div className="col-span-2 flex justify-end">
        <div
            role="switch"
            aria-checked={checked}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && onChange(!checked)}
            onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                onChange(!checked);
            }
            }}
            className={cn(
            "relative w-11 h-6 rounded-full transition-colors",
            checked ? "bg-primary-500" : "bg-gray-300",
            disabled ? "pointer-events-none" : "cursor-pointer"
            )}
        >
            {/* THUMB */}
            <span
            className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                checked && "translate-x-5"
            )}
            />
        </div>
      </div>
    </label>
  );
};

export default Toggle;
