"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { categoryIcons } from "@utils/helpers";
import { Package } from "lucide-react";
import type { IProductCategory } from "@/types/IProduct";

const categories: IProductCategory[] = [
  "Pakaian & Ihram",
  "Aksesoris Ibadah",
  "Perlengkapan Travel",
  "Kesehatan & Kebersihan",
  "Buku & Panduan",
  "Oleh-oleh & Souvenir",
  "Paket Bundling",
];

// 🔗 Map kategori ke gambar
const categoryImages: Partial<Record<IProductCategory, string>> = {
  "Pakaian & Ihram": "/img/banner/banner-kategori-pakaian-ihram.webp",
  "Aksesoris Ibadah": "/img/banner/banner-kategori-aksesoris-ibadah.webp",
  "Perlengkapan Travel": "/img/banner/banner-kategori-perlengkapan-travel.webp",
  "Kesehatan & Kebersihan": "/img/banner/banner-kategori-kesehatan-kebersihan.webp",
  "Buku & Panduan": "/img/banner/banner-kategori-buku-panduan.webp",
  "Oleh-oleh & Souvenir": "/img/banner/banner-kategori-oleh-oleh-souvenir.webp",
  "Paket Bundling": "/img/banner/banner-kategori-paket-bundling.webp",
};

export function CategoryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [indicatorPos, setIndicatorPos] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(50);

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
      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar space-x-4 scroll-smooth"
      >
        {categories.map((category) => {
          const imgSrc = categoryImages[category as IProductCategory];
          const IconComponent = categoryIcons[category as IProductCategory];

          return (
            <a
              key={category}
              href={`/kategori/${category.toLowerCase().replace(/ & /g, "-")}`}
              className="flex-shrink-0 w-20 md:w-34 flex flex-col items-center text-neutral-700 font-medium"
            >
              <div className="mb-2 flex items-center justify-center">
                {imgSrc ? (
                  <Image
                    src={imgSrc}
                    alt={category}
                    width={46}
                    height={46}
                    className="object-contain rounded-full"
                  />
                ) : IconComponent ? (
                  React.cloneElement(IconComponent, { size: 24, strokeWidth: 1.5 })
                ) : (
                  <Package size={24} strokeWidth={1.5} />
                )}
              </div>

              <span className="text-center text-xs sm:text-sm leading-tight">
                {category}
              </span>
            </a>
          );
        })}
      </div>

      {/* Scroll Indicator */}
      <div className="relative mt-2 h-1 bg-white rounded-full w-12 mx-auto">
        <div
          className="absolute top-0 left-0 h-full bg-primary-500 rounded-full"
          style={{
            width: `${indicatorWidth}%`,
            left: `${indicatorPos}%`,
          }}
        />
      </div>
    </section>
  );
}
