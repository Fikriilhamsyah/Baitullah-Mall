"use client"; // Diperlukan untuk useState (memilih produk)

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Component
import ProductList from "@/components/features/product/ProductList";
import ProductDetail from "@/components/features/product/ProductDetail";
import { HeroSection } from "@components/features/home/HeroSection";
import { PromoBanner } from "@/components/features/home/promo/PromoSection";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/Button";
const SliderSection = dynamic(() => import("@/components/features/home/SliderSection.client"), {
  ssr: false,
});

// Data
import { slides } from "@/data/SlidesData";

// Icons
import { ArrowRight, Search, User } from "lucide-react";

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
        // Tampilkan Halaman Utama (Home)
        <>
          {/* 3. Hero Section */}
          <div className="block md:hidden">
            <HeroSection />
          </div>

          {/* 2. Slider/Gallery di atas */}
          <SliderSection slides={slides} autoPlay />
          
          {/* 3. Promo Banner */}
          <PromoBanner />

          {/* 4. Banner Paragraph */}
          <div className="py-4 md:py-6">
            <div className="w-full h-full aspect-[2.32/1]">
              <div className="banner-paragraf w-full h-full">
                <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6 flex flex-col justify-center items-center h-full">
                  <h4 className="text-md md:text-4xl font-extrabold text-neutral-900 text-center mb-1 md:mb-4">
                    Hai, kami Baitullah Mall
                  </h4>
                  <p className="text-xs md:text-2xl font-normal text-neutral-900 text-center">
                    Baitullah Mall adalah marketplace perlengkapan Haji dan Umroh berkualitas, yang mendukung jamaah dan memberdayakan produk lokal untuk bersaing di pasar global.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Product List Section */}
          <section className="md:container md:mx-auto md:px-6 pb-8">
            <div id="produk" className="w-full">
              <div className="container mx-auto px-4 md:px-0">
                <h2 className="text-md font-bold text-neutral-900 pb-2">
                  Produk Pilihan
                </h2>
              </div>
              <ProductList onProductSelect={(id) => setSelectedProductId(id)} />
            </div>
          </section>
        </>
      )}
    </>
  );
}

