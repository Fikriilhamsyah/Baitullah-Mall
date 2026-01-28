  "use client";  
  
  import React, { useRef, useState, useEffect } from "react";
  import { Swiper, SwiperSlide } from "swiper/react";
  import { Navigation } from "swiper/modules";
  import "swiper/css";
  import "swiper/css/navigation";
  import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
  import Link from "next/link";
  import { promoBanners } from "@/data/PromoBannersData";
  import { Button } from "../../../ui/Button";

  export const PromoBannerSlider: React.FC = () => {
    const [swiper, setSwiper] = useState<any>(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    // 🔧 Hook untuk update navigation setelah tombol render
    useEffect(() => {
      if (!swiper || !prevRef.current || !nextRef.current) return;

      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;

      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();

      // Update state awal
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    }, [swiper, prevRef, nextRef]);

    return (
      <div className="relative w-full">
        <Swiper
          modules={[Navigation]}
          slidesPerView={2}
          spaceBetween={8}
          onSwiper={(instance) => setSwiper(instance)}
          onSlideChange={(s) => {
            setIsBeginning(s.isBeginning);
            setIsEnd(s.isEnd);
          }}
          breakpoints={{
            768: { slidesPerView: 3, spaceBetween: 16 }, // tablet
            1024: { slidesPerView: 4, spaceBetween: 16 }, // desktop
          }}
          className="w-full"
        >
          {promoBanners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Link
                href={banner.link || "#"}
                className="relative block w-full h-full aspect-[238/297] overflow-hidden rounded-3xl md:rounded-2xl"
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
                  <Button
                    label="Belanja Sekarang"
                    iconRight={ArrowRight}
                    color="primary"
                    shadow="lg"
                  />
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Tombol Prev */}
        <button
          ref={prevRef}
          className={`absolute flex justify-center items-center -left-4 top-1/2 -translate-y-1/2 z-20
            bg-[#299A4D]/60 hover:bg-[#299A4D] text-white/70 hover:text-white
            h-10 lg:h-16 w-10 lg:w-16 text-2xl rounded-full shadow-md transition
            ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Tombol Next */}
        <button
          ref={nextRef}
          className={`absolute flex justify-center items-center -right-4 top-1/2 -translate-y-1/2 z-20
            bg-[#299A4D]/60 hover:bg-[#299A4D] text-white/70 hover:text-white
            h-10 lg:h-16 w-10 lg:w-16 text-2xl rounded-full shadow-md transition
            ${isEnd ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    );
  };
