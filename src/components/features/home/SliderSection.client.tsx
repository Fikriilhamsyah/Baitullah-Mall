"use client";
import React, { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlidesData } from "@/data/SlidesData";

interface SliderProps {
  slides: SlidesData[];
  autoPlay?: boolean;
}

export default function SliderClient({ slides, autoPlay = true }: SliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current;
    if (swiper.params.navigation) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
    }
    if (swiper.params.pagination) {
      swiper.params.pagination.el = paginationRef.current;
    }
    swiper.navigation.init();
    swiper.navigation.update();
    swiper.pagination.init();
    swiper.pagination.update();
  }, []);

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        centeredSlides
        spaceBetween={30}
        autoplay={autoPlay ? { delay: 3000, disableOnInteraction: false } : false}
        pagination={{
          clickable: true,
          el: paginationRef.current,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        className="w-full overflow-hidden h-[56.25vw] lg:h-screen"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title || `Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute flex justify-center items-center left-4 top-1/2 -translate-y-1/2 z-10 bg-[#299A4D]/60 hover:bg-[#299A4D] text-white/60 hover:text-white h-10 lg:h-16 w-10 lg:w-16 text-2xl rounded-full shadow-md transition"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        ref={nextRef}
        className="absolute flex justify-center items-center right-4 top-1/2 -translate-y-1/2 z-10 bg-[#299A4D]/60 hover:bg-[#299A4D] text-white/60 hover:text-white h-10 lg:h-16 w-10 lg:w-16 text-2xl rounded-full shadow-md transition"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Custom Pagination */}
      <div
        ref={paginationRef}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3 z-10 custom-pagination"
      ></div>

      {/* Custom Pagination Style */}
      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          opacity: 0.6;
          transition: all 0.3s;
        }

        .custom-pagination .swiper-pagination-bullet-active {
          background: #299a4d;
          width: 24px;
          border-radius: 8px;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
