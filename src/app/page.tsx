"use client"; // Diperlukan untuk useState (memilih produk)

import React, { useState } from "react";
import ProductList from "@components/features/ProductList";
import ProductDetail from "@components/features/ProductDetail";

// Ini adalah Halaman Home Anda
export default function HomePage() {
  // State untuk menentukan halaman (daftar atau detail)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  return (
    // container, padding, dll. sudah diatur di RootLayout
    <>
      {selectedProductId ? (
        // Tampilkan Halaman Detail
        <ProductDetail
          id={selectedProductId}
          onBack={() => setSelectedProductId(null)}
        />
      ) : (
        // Tampilkan Halaman Daftar Produk
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Produk Pilihan
          </h1>
          <ProductList onProductSelect={(id) => setSelectedProductId(id)} />
        </>
      )}
    </>
  );
}
