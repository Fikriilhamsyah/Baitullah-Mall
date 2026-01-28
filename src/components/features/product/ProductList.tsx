"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Hooks
import { useProducts } from "@hooks/useProducts";

// Components
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import ProductCard from "./ProductCard";
import Pagination from "@/components/ui/Pagination";

// Icons
import { SearchX } from "lucide-react";

interface ProductListProps {
  paymentType?: "uang" | "poin";
  showPagination?: boolean;
  searchQuery?: string;
}

const ITEMS_PER_PAGE = 12;

const ProductList: React.FC<ProductListProps> = ({
  paymentType,
  showPagination = true,
  searchQuery = "",
}) => {
  const { products, loading, error } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);

  console.table(products)

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Filter berdasarkan paymentType & searchQuery
  const filteredProducts = products.filter((p) => {
    const matchesType = paymentType
      ? p.jenis.nama_jenis.toLowerCase() === paymentType.toLowerCase()
      : true;

    const matchesQuery = searchQuery
      ? p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesType && matchesQuery;
  });

  // Hitung total halaman
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Produk di halaman aktif
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Grid Produk */}
      {paginatedProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:grid-cols-4 md:gap-4 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {paginatedProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        // 🔍 Produk tidak ditemukan
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center h-64 text-gray-500"
        >
          {/* simple friendly SVG */}
          <svg width="192" height="192" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="1" y="5" width="22" height="15" rx="3" fill="#F8FAFC"/>
            <path d="M3 7.5H21" stroke="#E6EEF5" strokeWidth="1.2"/>
            <path d="M7 11h10" stroke="#C9D8E6" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="8.5" cy="15.5" r="1.6" fill="#E6EEF5"/>
            <circle cx="15.5" cy="15.5" r="1.6" fill="#E6EEF5"/>
            <path d="M9.5 6.5c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v1" stroke="#B7C9DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-lg font-medium">Produk tidak ditemukan</p>
          <p className="text-sm text-gray-400 mt-1 text-center max-w-sm">
            Coba ubah kata kunci pencarian atau periksa filter yang kamu gunakan.
          </p>
        </motion.div>
      )}

      {/* Pagination */}
      {showPagination && filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
};

export default ProductList;
