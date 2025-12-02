"use client";
import { useModal } from "@/context/ModalContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

// Icons
import { X } from 'lucide-react';

export default function Modal() {
  const { isOpen, content, title, size, mobileMode, closeModal } = useModal();

  // ESC Close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeModal]);

  // Disable body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const widthClass = {
    sm: "max-w-[380px]",
    md: "max-w-[520px]",
    lg: "max-w-[720px]",
  }[size || "md"];

  // mobile modes
  const mobileClass =
    mobileMode === "full"
      ? "w-screen h-screen rounded-none"
      : "mx-4 mt-10 rounded-xl";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* modal */}
          <motion.div
            className={`
              fixed z-[1001] left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              bg-white shadow-xl flex flex-col
              w-screen md:w-full h-screen md:h-auto rounded-none md:rounded-xl
              max-h-[calc(100vh-40px)] mx-0 mt-0 md:mx-4 md:mt-10
              ${widthClass}
            `}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", damping: 18, stiffness: 220 }}
          >
            {/* scrollable content */}
            <div className="overflow-y-auto flex-1 p-6 max-h-[100vh] md:max-h-[70vh] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className='w-6' />
                <h1 className="text-xl font-bold">{title}</h1>
                <X className="w-6 h-6 cursor-pointer" onClick={closeModal} />
              </div>
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
