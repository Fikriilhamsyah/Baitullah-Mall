"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function FilterSidebar({ open, onClose }: FilterSidebarProps) {
  // 🔒 Disable scroll body ketika sidebar aktif
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup saat komponen unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed top-0 right-0 w-80 max-w-full h-full bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg text-neutral-800">
                Filter Produk
              </h2>
              <button
                onClick={onClose}
                className="text-neutral-600 hover:text-neutral-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Isi filter */}
            <div className="p-4 space-y-4 text-neutral-700">
              <p className="text-sm">Contoh filter kategori, harga, dll...</p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
