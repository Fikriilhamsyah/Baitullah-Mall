"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Components
import ProductList from "@/components/features/product/ProductList";
import { HeroSection } from "@components/features/home/HeroSection";
import { PromoBanner } from "@/components/features/home/promo/PromoSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
const SliderSection = dynamic(() => import("@/components/features/home/SliderSection.client"), {
  ssr: false,
});

// Data
import { slides } from "@/data/SlidesData";
import { CategorySlider } from "@/components/features/category/CategorySlider";

// Icons
import { ChevronRight } from "lucide-react";

// Halaman Home
export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Simulasi loading awal halaman
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // misal 1.2 detik
    return () => clearTimeout(timer);
  }, []);

  // Jika loading → tampilkan spinner fullscreen
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Hero Section (mobile only) */}
      <div className="block lg:hidden">
        <HeroSection
          categoryFilter={true}
          filterButtonLabel={false}
          onSearch={(query) => router.push(`/productlist?query=${encodeURIComponent(query)}`)}
        />
      </div>

      {/* Slider Section */}
      <SliderSection slides={slides} autoPlay />

      {/* Promo Banner */}
      <PromoBanner />

      {/* Category Slider */}
      <section className="hidden lg:block container mx-auto px-4 sm:px-6 py-4 md:py-6">
        <div className="container mx-auto px-4 md:px-0">
          <h2 className="text-md md:text-2xl font-bold text-neutral-900 pb-2 md:pb-8">Kategori</h2>
        </div>
        <CategorySlider />
      </section>

      {/* Banner Paragraf */}
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

      {/* Product List */}
      <section className="md:container md:mx-auto md:px-6 pb-8">
        <div id="produk" className="w-full">
          <div className="container mx-auto px-4 md:px-0">
            <h2 className="text-md md:text-2xl font-bold text-neutral-900 pb-2 md:pb-8">Produk Baitullah Mall</h2>
          </div>
          <ProductList
            paymentType="uang"
            showPagination={false}
          />
          <div className="flex justify-center items-center mt-4">
            <Button label="Lihat Produk Lainnya" variant="normal" iconRight={ChevronRight} color="primary" shadow="lg" onClick={() => router.push("/productlist")} />
          </div>
        </div>
      </section>

      {/* Tukar Point */}
      <section className="md:container md:mx-auto md:px-6 pb-8">
        <div id="tukarpoin" className="w-full">
          <div className="container mx-auto px-4 md:px-0">
            <h2 className="text-md md:text-2xl font-bold text-neutral-900 pb-1 md:pb-2">Tukar Poin</h2>
            <p className="text-sm md:text-lg font-normal text-neutral-600 pb-2 md:pb-8">Kumpulkan Poin, Tukar dengan Keberkahan.</p>
          </div>
          <ProductList
            paymentType="poin"
            showPagination={false}
          />
          <div className="flex justify-center items-center mt-4">
            <Button label="Lihat Produk Lainnya" variant="normal" iconRight={ChevronRight} color="primary" shadow="lg" onClick={() => router.push("/productlist")} />
          </div>
        </div>
      </section>
    </>
  );
}
