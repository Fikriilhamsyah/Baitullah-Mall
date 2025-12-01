"use client";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlidesData } from "@/data/SlidesData";

type SlideType = typeof SlidesData[number];

interface SliderProps {
  slides: SlideType[];
  autoPlay?: boolean;
}

export default function SliderClient({ slides, autoPlay = true }: SliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6 lg:pt-[161px]">
        <div className="relative w-full group">
          {ready && (
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              centeredSlides
              spaceBetween={30}
              autoplay={
                autoPlay
                  ? { delay: 3000, disableOnInteraction: false }
                  : false
              }
              /** ========= FIX TYPE ERROR ========= **/
              pagination={{
                clickable: true,
                el: paginationRef.current as any,
              }}
              navigation={{
                prevEl: prevRef.current as any,
                nextEl: nextRef.current as any,
              }}
              onAfterInit={(swiper) => {
                if (
                  !prevRef.current ||
                  !nextRef.current ||
                  !paginationRef.current
                )
                  return;

                const nav = swiper.params.navigation as any;
                nav.prevEl = prevRef.current;
                nav.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();

                const pag = swiper.params.pagination as any;
                pag.el = paginationRef.current;
                swiper.pagination.init();
                swiper.pagination.update();
              }}
              className="w-full h-full aspect-[4/2] md:aspect-[8.5/2] overflow-visible rounded-3xl md:rounded-2xl"
            >
              {slides.map((slide, i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-full">
                    <img
                      src={slide.imageLg}
                      alt={slide.title || `Slide ${i + 1}`}
                      className="hidden lg:block w-full h-full object-cover"
                    />
                    <img
                      src={slide.imageMdSm}
                      alt={slide.title || `Slide ${i + 1}`}
                      className="block lg:hidden w-full h-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Tombol navigasi kiri */}
          <button
            ref={prevRef}
            className={`
              absolute -left-5 md:-left-8 top-1/2 -translate-y-1/2 z-20
              flex justify-center items-center
              bg-white text-black
              h-10 w-10 lg:h-14 lg:w-14 rounded-full shadow-lg
              transition-all duration-500
              opacity-0 translate-y-4
              group-hover:opacity-100 group-hover:-translate-y-4
            `}
          >
            <ChevronLeft className="w-5 h-5 lg:w-7 lg:h-7" />
          </button>

          {/* Tombol navigasi kanan */}
          <button
            ref={nextRef}
            className={`
              absolute -right-5 md:-right-8 top-1/2 -translate-y-1/2 z-20
              flex justify-center items-center
              bg-white text-black
              h-10 w-10 lg:h-14 lg:w-14 rounded-full shadow-lg
              transition-all duration-500
              opacity-0 translate-y-4
              group-hover:opacity-100 group-hover:-translate-y-4
            `}
          >
            <ChevronRight className="w-5 h-5 lg:w-7 lg:h-7" />
          </button>

          {/* Custom Pagination */}
          <div
            ref={paginationRef}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-[9999] custom-pagination"
          />
        </div>

        {/* Pagination style */}
        <style jsx global>{`
          .custom-pagination .swiper-pagination-bullet {
            width: 10px !important;
            height: 10px !important;
            border-radius: 50%;
            background: white !important;
            opacity: 0.6 !important;
            transition: all 0.3s ease !important;
          }

          .custom-pagination .swiper-pagination-bullet-active {
            background: white !important;
            width: 24px !important;
            border-radius: 8px !important;
            opacity: 1 !important;
          }
        `}</style>
      </div>
    </div>
  );
}
