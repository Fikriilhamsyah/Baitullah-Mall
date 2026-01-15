"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// Hooks
import { useCategories } from "@hooks/useCategories";
import { env } from "process";

// 🧩 Data kategori contoh
// const categories = [
//   {
//     id: 1,
//     kategori_id: 1,
//     name: "Pakaian & Ihram",
//     image: "/img/banner/banner-kategori-pakaian-ihram.webp",
//     link: "#",
//   },
//   {
//     id: 2,
//     kategori_id: 2,
//     name: "Aksesoris Ibadah",
//     image: "/img/banner/banner-kategori-aksesoris-ibadah.webp",
//     link: "#",
//   },
//   {
//     id: 3,
//     kategori_id: 3,
//     name: "Perlengkapan Travel",
//     image: "/img/banner/banner-kategori-perlengkapan-travel.webp",
//     link: "#",
//   },
//   {
//     id: 4,
//     kategori_id: 4,
//     name: "Kesehatan & Kebersihan",
//     image: "/img/banner/banner-kategori-kesehatan-kebersihan.webp",
//     link: "#",
//   },
//   {
//     id: 5,
//     kategori_id: 5,
//     name: "Buku & Panduan",
//     image: "/img/banner/banner-kategori-buku-panduan.webp",
//     link: "#",
//   },
//   {
//     id: 6,
//     kategori_id: 6,
//     name: "Oleh-oleh & Souvenir",
//     image: "/img/banner/banner-kategori-oleh-oleh-souvenir.webp",
//     link: "#",
//   },
//   {
//     id: 7,
//     kategori_id: 7,
//     name: "Paket Bundling",
//     image: "/img/banner/banner-kategori-paket-bundling.webp",
//     link: "#",
//   },
// ];

export const CategorySlider: React.FC = () => {
  const router = useRouter();
  const [swiper, setSwiper] = useState<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const { categories, loading, error } = useCategories();
  const categoryList = categories ?? [];

  useEffect(() => {
    if (!swiper || !prevRef.current || !nextRef.current) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();

    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, [swiper, prevRef, nextRef]);

  return (
    <div id="category" className="relative w-full">
        <Swiper
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={8}
          onSwiper={(instance) => setSwiper(instance)}
            onSlideChange={(s) => {
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
          }}
          breakpoints={{
            640: { slidesPerView: 4, spaceBetween: 12 },
            768: { slidesPerView: 5, spaceBetween: 16 },
          }}
          className="w-full"
        >
            {Array.isArray(categoryList) &&
              categoryList.map((cat) => (
              <SwiperSlide key={cat.id}>
                  <button
                    onClick={() => router.push(`/productlist?kategori_id=${cat.id}&category=${encodeURIComponent(cat.nama_kategori)}&page=1`)}
                    className="flex flex-col items-center space-y-3 group"
                  >
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#299A4D]/30 group-hover:border-[#299A4D] transition-all duration-300">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${cat.gambar_icon}`}
                      alt={cat.nama_kategori}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <p className="text-sm md:text-base font-medium text-gray-700 group-hover:text-[#299A4D] transition-colors duration-300">
                    {cat.nama_kategori}
                  </p>
                  </button>
              </SwiperSlide>
            ))}
        </Swiper>

        {/* Tombol Prev */}
        <button
            ref={prevRef}
            className={`absolute flex justify-center items-center -left-3 top-1/2 -translate-y-1/2 z-20
              bg-[#299A4D]/60 hover:bg-[#299A4D] text-white/80 hover:text-white
              h-8 w-8 md:h-12 md:w-12 rounded-full shadow-md transition
              ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}
            `}
        >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Tombol Next */}
        <button
            ref={nextRef}
            className={`absolute flex justify-center items-center -right-3 top-1/2 -translate-y-1/2 z-20
              bg-[#299A4D]/60 hover:bg-[#299A4D] text-white/80 hover:text-white
              h-8 w-8 md:h-12 md:w-12 rounded-full shadow-md transition
              ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}
            `}
        >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
    </div>
  );
};
