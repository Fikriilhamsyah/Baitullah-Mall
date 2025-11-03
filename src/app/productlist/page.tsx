"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Components
import ProductList from "@/components/features/product/ProductList";
import ProductDetail from "@/components/features/product/ProductDetail";
import { HeroSection } from "@components/features/home/HeroSection";
import { PromoBanner } from "@/components/features/home/promo/PromoSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
const SliderSection = dynamic(
  () => import("@/components/features/home/SliderSection.client"),
  {
    ssr: false,
  }
);

// Data
import { slides } from "@/data/SlidesData";
import { CategorySlider } from "@/components/features/category/CategorySlider";
import { InputField } from "@/components/ui/InputField";
import CheckboxGroup from "@/components/ui/CheckboxGroup";

// Halaman Home
export default function HomePage() {
  const [category, setCategory] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
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
    <div>
      {/* Hero Section (mobile only) */}
      <div className="block md:hidden">
        <HeroSection filterButtonLabel={true} />
      </div>

      {/* Product List */}
      <section className="md:container md:mx-auto md:px-6 pb-8 md:pt-[161px]">
        <div id="produk" className="w-full">
          <div className="flex justify-between items-center container mx-auto px-4 md:px-0 py-4 md:py-0 md:pb-6">
            <h2 className="text-md md:text-xl font-normal text-neutral-600">Beranda/Semua Produk</h2>
            <div className="hidden md:flex items-center">
                <p className="text-md font-normal text-neutral-600 w-full">Urutkan Berdasarkan</p>
                <InputField
                    type="select"
                    // label="Kategori Produk"
                    options={[
                        { value: "terbaru", label: "Produk Terbaru" },
                        { value: "terlaris", label: "Produk Terlaris" },
                        { value: "termahal", label: "Harga: Tinggi ke Rendah" },
                        { value: "termurah", label: "Harga: Rendah ke Tinggi" },
                    ]}
                />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="hidden md:block col-span-3 bg-neutral-100 h-fit p-4">
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
            <div className="col-span-12 md:col-span-9">
                <ProductList onProductSelect={(id) => setSelectedProductId(id)} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
