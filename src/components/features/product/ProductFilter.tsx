"use client";
import React, { useEffect, useState } from "react";

// Icons
import { X } from "lucide-react";

// Framer Motion
import { motion, AnimatePresence } from "framer-motion";

// Components
import { InputField } from "../../ui/InputField";
import CheckboxGroup from "../../ui/CheckboxGroup";
import { Button } from "../../ui/Button";

// Hooks
import { useCategories } from "@hooks/useCategories";
import { useCollection } from "@hooks/useCollection";
import { usePaymentType } from "@/hooks/usePaymentType";

interface ProductFilterProps {
  open: boolean;
  onClose: () => void;

  // 🔹 Props sinkronisasi dari ProductPage
  totalCount: number;
  totalAll: number;
  category: string[];
  collectionFilter: string[];
  paymentTypeFilter: string[];
  sortBy: string;
  minPrice: number | "";
  maxPrice: number | "";
  productType: string[];

  onChangeCategory: (val: string[]) => void;
  onChangeCollectionFilter: (val: string[]) => void;
  onChangePaymentTypeFilter: (val: string[]) => void;
  onChangeSort: (val: string) => void;
  onChangeMinPrice: (val: number | "") => void;
  onChangeMaxPrice: (val: number | "") => void;
  onChangeProductType: (val: string[]) => void;

  onResetFilters: () => void;
}

export function ProductFilter({
  open,
  onClose,
  totalCount,
  totalAll,
  category,
  collectionFilter,
  paymentTypeFilter,
  sortBy,
  minPrice,
  maxPrice,
  productType,
  onChangeCategory,
  onChangeCollectionFilter,
  onChangePaymentTypeFilter,
  onChangeSort,
  onChangeMinPrice,
  onChangeMaxPrice,
  onChangeProductType,
  onResetFilters,
}: ProductFilterProps) {
  const { categories, loading: loadingCategories, error: categoryError } = useCategories();
  const { collection, loading: loadingCollection, error: collectionError } = useCollection();
  const { paymentType, loading: loadingPaymentType, error: paymentTypeError } = usePaymentType();

  const categoryList = Array.isArray(categories) ? categories : [];
  const collectionList = Array.isArray(collection) ? collection : [];
  const paymentTypeList = Array.isArray(paymentType) ? paymentType : [];

  // 🔒 Disable scroll body ketika sidebar aktif
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 z-10">
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
            <div className="p-4 flex-1 overflow-y-auto">
              {/* ✅ Jumlah produk tersinkronisasi */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm md:text-md font-normal text-neutral-600">
                  Menampilkan produk
                </p>
                <p className="text-sm md:text-md font-semibold text-primary-600">
                  {totalCount} / {totalAll}
                </p>
              </div>

              <div className="space-y-6">
                {/* Harga */}
                <div>
                  <p className="text-sm md:text-md font-bold text-neutral-700 mb-2">
                    Harga
                  </p>
                  <div className="flex items-center">
                    <p className="text-sm md:text-md font-normal text-neutral-600 mr-2">
                      Rp
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <InputField
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) =>
                          onChangeMinPrice(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                      <InputField
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) =>
                          onChangeMaxPrice(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Urutkan Berdasarkan */}
                <div>
                  <InputField
                    type="select"
                    label="Urutkan Berdasarkan"
                    options={[
                      { value: "terbaru", label: "Produk Terbaru" },
                      { value: "terlaris", label: "Produk Terlaris" },
                      { value: "termahal", label: "Harga: Tinggi ke Rendah" },
                      { value: "termurah", label: "Harga: Rendah ke Tinggi" },
                    ]}
                    value={sortBy}
                    onChange={(e) => onChangeSort(e.target.value)}
                  />
                </div>

                {/* Jenis Pembayaran Produk */}
                <div>
                  <p className="text-sm md:text-md font-bold text-neutral-700 mb-2">
                    Jenis Pembayaran Produk
                  </p>
                  <CheckboxGroup
                    options={paymentTypeList.map((pay) => ({ label: pay.nama_jenis, value: pay.nama_jenis, }))}
                    selected={paymentTypeFilter}
                    onChange={onChangePaymentTypeFilter}
                  />
                </div>

                {/* Kategori */}
                <div>
                  <p className="text-sm md:text-md font-bold text-neutral-700 mb-2">
                    Kategori
                  </p>
                  <CheckboxGroup
                    options={categoryList.map(cat => ({ label: cat.nama_kategori, value: cat.nama_kategori }))}
                    selected={category}
                    onChange={onChangeCategory}
                  />
                </div>

                {/* Koleksi / Gender */}
                <div>
                  <p className="text-sm md:text-md font-bold text-neutral-700 mb-2">
                    Gender
                  </p>
                  <CheckboxGroup
                    options={collectionList.map(col => ({ label: col.nama_koleksi, value: col.nama_koleksi }))}
                    selected={collectionFilter}
                    onChange={onChangeCollectionFilter}
                  />
                </div>

                {/* Tombol aksi */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    label="Atur Ulang"
                    variant="rounded"
                    color="custom"
                    customColor={{
                      bg: "bg-white",
                      text: "text-primary-500",
                      border: "border-primary-500",
                      hoverBg: "bg-primary-500",
                      hoverText: "text-black",
                    }}
                    onClick={onResetFilters}
                  />
                  <Button
                    label="Terapkan"
                    color="primary"
                    variant="rounded"
                    fullWidth={true}
                    onClick={onClose}
                  />
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
