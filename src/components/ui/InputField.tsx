// components/ui/InputField.tsx
"use client";
import React from "react";
import { cn } from "@utils/helpers";
import { LucideIcon, Eye, EyeOff } from "lucide-react";

type ChangeHandler =
  | React.ChangeEventHandler<HTMLInputElement>
  | React.ChangeEventHandler<HTMLTextAreaElement>
  | React.ChangeEventHandler<HTMLSelectElement>;

export type Option = { value: string; label: string };

interface InputFieldProps {
  label?: string;
  icon?: LucideIcon;
  variant?: "default" | "rounded";
  type?: "text" | "number" | "textarea" | "select" | "email" | "password";
  options?: Option[];
  autoComplete?: string;
  id?: string;
  name?: string;
  required?: boolean;
  placeholder?: string;
  value?: any;
  className?: string;
  disabled?: boolean;
  // onChange menerima input/textarea/select
  onChange?: ChangeHandler;
  // allow any other html props (kepraktisan)
  [key: string]: any;
}

/**
 * InputField — unified input/select/textarea component
 */
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
  placeholder,
  disabled,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isTouched, setIsTouched] = React.useState(false);

  /** FIELD ERROR (jika required & sudah disentuh & kosong) */
  const hasError = required && isTouched && (!value || value === "");

  const roundedStyle =
    variant === "rounded" ? "rounded-full" : "rounded-lg";

  const baseClasses = cn(
    "w-full bg-white text-neutral-800 border border-gray-300",
    "focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition-all",
    Icon ? "pl-10" : "pl-4",
    "pr-10 py-2",
    roundedStyle,
    className
  );

  // NUMBER: mencegah angka negatif
  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value;
    if (v === "" || Number(v) >= 0) {
      (onChange as React.ChangeEventHandler<HTMLInputElement>)?.(e);
    } else {
      const ev = {
        ...e,
        target: { ...(e.target as any), value: "0" },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      (onChange as React.ChangeEventHandler<HTMLInputElement>)?.(ev);
    }
  };

  // SELECT handler
  const handleSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    (onChange as React.ChangeEventHandler<HTMLSelectElement>)?.(e);
  };

  // TEXTAREA handler
  const handleTextareaChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    (onChange as React.ChangeEventHandler<HTMLTextAreaElement>)?.(e);
  };

  const handleBlur = () => setIsTouched(true);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}

      <div className="relative flex flex-col gap-1">
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
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleTextareaChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={cn(
              baseClasses,
              "resize-none h-24",
              variant === "rounded" && "rounded-lg"
            )}
            {...props}
          />
        ) : type === "select" ? (
          // SELECT INPUT
          <select
            id={id}
            name={name}
            value={value ?? ""}
            onChange={handleSelectChange}
            onBlur={handleBlur}
            disabled={disabled}
            className={baseClasses}
            {...props}
          >
            <option value="">{placeholder ?? "Pilih..."}</option>
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
            type="number"
            min={0}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleNumberChange}
            onBlur={handleBlur}
            autoComplete={autoComplete}
            disabled={disabled}
            className={baseClasses}
            {...props}
          />
        ) : type === "email" ? (
          <input
            id={id}
            name={name}
            type="email"
            placeholder={placeholder}
            inputMode="email"
            autoComplete={autoComplete ?? "email"}
            value={value ?? ""}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onBlur={handleBlur}
            disabled={disabled}
            className={baseClasses}
            {...props}
          />
        ) : type === "password" ? (
          // PASSWORD INPUT + TOGGLE
          <>
            <input
              id={id}
              name={name}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              value={value ?? ""}
              onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
              onBlur={handleBlur}
              autoComplete={autoComplete ?? "current-password"}
              disabled={disabled}
              className={baseClasses}
              {...props}
            />

            <button
              type="button"
              className="absolute right-3 top-3 text-neutral-600 hover:text-neutral-900 transition"
              onClick={() => setShowPassword((p) => !p)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </>
        ) : (
          // INPUT DEFAULT (text)
          <input
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
            onBlur={handleBlur}
            autoComplete={autoComplete}
            disabled={disabled}
            className={baseClasses}
            {...props}
          />
        )}

        {/* ERROR MESSAGE */}
        {hasError && (
          <p className="text-xs text-red-500">Field ini wajib diisi</p>
        )}
      </div>
    </div>
  );
};

export default InputField;
