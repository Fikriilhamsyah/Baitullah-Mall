"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useProducts } from "@hooks/useProducts";

// Components
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import ProductCard from "./ProductCard";
import Pagination from "@/components/ui/Pagination";

// Icons
import { SearchX } from "lucide-react";

interface ProductListProps {
  onProductSelect: (id: string) => void;
  paymentType?: "rupiah" | "poin";
  showPagination?: boolean;
  searchQuery?: string;
}

const ITEMS_PER_PAGE = 8;

const ProductList: React.FC<ProductListProps> = ({
  onProductSelect,
  paymentType,
  showPagination = true,
  searchQuery = "",
}) => {
  const { products, loading, error } = useProducts();
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Filter berdasarkan paymentType & searchQuery
  const filteredProducts = products.filter((p) => {
    const matchesType = paymentType ? p.paymentType === paymentType : true;
    const matchesQuery = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 w-full"
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
              <ProductCard product={product} onSelect={onProductSelect} />
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
          <SearchX className="w-12 h-12 mb-3 text-gray-400" />
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
