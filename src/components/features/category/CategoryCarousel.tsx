"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Package } from "lucide-react";
import type { ICategory } from "@/types/ICategory";

// Hooks
import { useCategories } from "@hooks/useCategories";

// const categories: IProductCategory[] = [
//   "Pakaian & Ihram",
//   "Aksesoris Ibadah",
//   "Perlengkapan Travel",
//   "Kesehatan & Kebersihan",
//   "Buku & Panduan",
//   "Oleh-oleh & Souvenir",
//   "Paket Bundling",
// ];

const kategoriMapNameToId: Record<string, number> = {
  "Pakaian & Ihram": 1,
  "Aksesoris Ibadah": 2,
  "Perlengkapan Travel": 3,
  "Kesehatan & Kebersihan": 4,
  "Buku & Panduan": 5,
  "Oleh-oleh & Souvenir": 6,
  "Paket Bundling": 7,
};

// const categoryImages: Partial<Record<IProductCategory, string>> = {
//   "Pakaian & Ihram": "/img/banner/banner-kategori-pakaian-ihram.webp",
//   "Aksesoris Ibadah": "/img/banner/banner-kategori-aksesoris-ibadah.webp",
//   "Perlengkapan Travel": "/img/banner/banner-kategori-perlengkapan-travel.webp",
//   "Kesehatan & Kebersihan": "/img/banner/banner-kategori-kesehatan-kebersihan.webp",
//   "Buku & Panduan": "/img/banner/banner-kategori-buku-panduan.webp",
//   "Oleh-oleh & Souvenir": "/img/banner/banner-kategori-oleh-oleh-souvenir.webp",
//   "Paket Bundling": "/img/banner/banner-kategori-paket-bundling.webp",
// };

export function CategoryCarousel() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [indicatorPos, setIndicatorPos] = useState(0);
  const [indicatorWidth] = useState(50);
  const { categories, loading, error } = useCategories();
  const categoryList = categories?? [];

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollRatio = el.scrollLeft / (el.scrollWidth - el.clientWidth);
    const availableWidth = 100 - indicatorWidth;
    setIndicatorPos(scrollRatio * availableWidth);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full mt-2">
      <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar space-x-4 scroll-smooth">
        {Array.isArray(categoryList) &&
          categoryList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/productlist?kategori_id=${cat.id}&category=${encodeURIComponent(cat.nama_kategori)}&page=1`)}
              className="flex-shrink-0 w-20 md:w-34 flex flex-col items-center text-neutral-700 font-medium"
            >
              <div className="mb-2 flex items-center justify-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${cat.gambar_icon}`}
                  alt={cat.nama_kategori}
                  width={46}
                  height={46}
                  className="object-contain rounded-full"
                />
              </div>

              <span className="text-center text-xs sm:text-sm leading-tight">
                {cat.nama_kategori}
              </span>
            </button>
        ))}
      </div>

      <div className="relative mt-2 h-1 bg-white rounded-full w-12 mx-auto">
        <div
          className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
          style={{ width: `${indicatorWidth}%`, left: `${indicatorPos}%` }}
        />
      </div>
    </section>
  );
}
