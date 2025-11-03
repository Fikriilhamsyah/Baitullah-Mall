"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { InputField } from "../ui/InputField";
import CheckboxGroup from "../ui/CheckboxGroup";

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function FilterSidebar({ open, onClose }: FilterSidebarProps) {
  const [category, setCategory] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);

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
            className="fixed top-0 right-0 w-70 max-w-full h-full bg-white shadow-xl z-50 flex flex-col"
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
            <div className="p-4">
              <p className="text-md font-normal text-neutral-600 mb-8">Menampilkan produk</p>
              <div className="space-y-6">
                  <div>
                      <p className="text-md font-bold text-neutral-700 mb-2">Harga</p>
                      <div className="flex items-center">
                          <p className="text-md font-normal text-neutral-600 mr-2">Rp</p>
                          <div className="grid grid-cols-2 gap-2">
                              <InputField type="number" placeholder="Min" />
                              <InputField type="number" placeholder="Max" />
                          </div>
                      </div>
                  </div>
                  <div>
                      <p className="text-md font-bold text-neutral-700 mb-2">Kategori</p>
                      <div>
                          <CheckboxGroup
                              options={[
                                  { label: "Pakaian & Ihram", value: "pakaian_ihram" },
                                  { label: "Aksesoris Ibadah", value: "aksesoris_ibadah" },
                                  { label: "Perlengkapan Travel", value: "perlengkapan_travel" },
                                  { label: "Kesehatan & Kebersihan", value: "kesehatan_kebersihan" },
                                  { label: "Buku Panduan", value: "buku_panduan" },
                                  { label: "Oleh-oleh & Souvenir", value: "oleh_oleh_souvenir" },
                                  { label: "Paket Bundling", value: "paket_bundling" },
                              ]}
                              selected={category}
                              onChange={setCategory}
                          />
                      </div>
                  </div>
                  <div>
                      <p className="text-md font-bold text-neutral-700 mb-2">Gender</p>
                      <div>
                          <CheckboxGroup
                              options={[
                                  { label: "Pria", value: "pria" },
                                  { label: "Wanita", value: "wanita" },
                                  { label: "Unisex", value: "unisex" },
                              ]}
                              selected={gender}
                              onChange={setGender}
                          />
                      </div>
                  </div>
              </div>
          </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
