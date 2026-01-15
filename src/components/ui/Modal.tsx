"use client";
import { useModal } from "@/context/ModalContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal() {
  const { isOpen, content, title, size, closeModal } = useModal();

  // ESC close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  // Lock body scroll
  useEffect(() => {
    document.body.classList.toggle("bs-locked", isOpen);
    return () => document.body.classList.remove("bs-locked");
  }, [isOpen]);

  const widthClass = {
    sm: "md:max-w-[380px]",
    md: "md:max-w-[520px]",
    lg: "md:max-w-[720px]",
  }[size || "md"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[1001] flex items-end md:items-center justify-center">
            <motion.div
              className={`
                w-screen h-screen md:h-auto
                bg-white shadow-xl flex flex-col
                rounded-none md:rounded-xl
                max-h-screen md:max-h-[calc(100vh-80px)]
                ${widthClass}
                pointer-events-auto
              `}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", damping: 20, stiffness: 220 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b rounded-t-none md:rounded-t-xl sticky top-0 bg-white z-10">
                <div className="w-6" />
                <h1 className="text-lg font-semibold text-center">
                  {title}
                </h1>
                <X
                  className="w-6 h-6 cursor-pointer text-neutral-600 hover:text-neutral-900"
                  onClick={closeModal}
                />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                <div className="pt-20 md:pt-0 h-full">
                  {content}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
