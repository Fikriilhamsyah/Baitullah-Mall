"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const Toast = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Container UI */}
      <div className="fixed top-4 left-4 md:left-auto right-4 flex flex-col space-y-2 z-[10001]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 rounded-md text-white shadow-md animate-fade-in
              ${toast.type === "success" && "bg-primary-500"}
              ${toast.type === "error" && "bg-danger-500"}
              ${toast.type === "warning" && "bg-warning-500"}
              ${toast.type === "info" && "bg-accent-500"}
            `}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
