"use client";
import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductImageGalleryProps {
  images: any; // bisa produk object
  name: string;
  layout?: "mobile" | "desktop";
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images: product,
  name,
  layout = "desktop",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const mainSwiperRef = useRef<any>(null);
  const thumbsContainerRef = useRef<HTMLDivElement>(null);

  // 🔹 Siapkan array gambar: varian + gambar utama
  // intentionally keep null entries so indexes remain stable
  const images: (string | null)[] = [
    product?.gambar_utama ?? null,
    ...(Array.isArray(product?.varian) ? product.varian.map((v: any) => v?.gambar ?? null) : []),
  ];

  const totalImages = images.length;

  // ✅ Scroll thumbnail ke tengah saat activeIndex berubah
  useEffect(() => {
    const container = thumbsContainerRef.current;
    if (!container) return;
    const activeThumb = container.children[activeIndex] as HTMLElement | undefined;
    if (activeThumb) {
      const containerWidth = container.offsetWidth;
      const thumbCenter = activeThumb.offsetLeft + activeThumb.offsetWidth / 2;
      const scrollPosition = thumbCenter - containerWidth / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  const handleThumbClick = (index: number) => {
    if (mainSwiperRef.current) {
      mainSwiperRef.current.slideTo(index);
    } else {
      setActiveIndex(index);
    }
  };

  // open preview only if image exists
  const openPreview = (index: number) => {
    const img = images[index];
    if (!img) return; // don't open modal for null images
    setPreviewImage(img);
    setActiveIndex(index);
    setIsModalOpen(true);
  };

  const closePreview = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
  };

  const handleNextImage = () => {
    const nextIndex = (activeIndex + 1) % images.length;
    setActiveIndex(nextIndex);
    if (images[nextIndex]) setPreviewImage(images[nextIndex]);
    mainSwiperRef.current?.slideTo(nextIndex);
  };

  const handlePrevImage = () => {
    const prevIndex = (activeIndex - 1 + images.length) % images.length;
    setActiveIndex(prevIndex);
    if (images[prevIndex]) setPreviewImage(images[prevIndex]);
    mainSwiperRef.current?.slideTo(prevIndex);
  };

  // shared classes for main image area and placeholder to keep consistent size
  const mainImageClass = "w-full h-auto aspect-[4/5] object-cover cursor-pointer transition-transform duration-200 hover:scale-[1.02]";
  const placeholderMainClass = "w-full h-auto aspect-[4/5] bg-neutral-200 flex items-center justify-center text-gray-400";

  return (
    <>
      <div
        className={`relative ${
          layout === "mobile"
            ? "block lg:hidden pt-[65px]"
            : "hidden lg:block sticky top-[160px] self-start"
        }`}
      >
        {/* Tombol Navigasi */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
          onClick={() => mainSwiperRef.current?.slidePrev()}
          aria-label="Prev image"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/70 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white"
          onClick={() => mainSwiperRef.current?.slideNext()}
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>

        {/* Swiper Gambar Utama */}
        <Swiper
          modules={[Navigation, Thumbs]}
          onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          spaceBetween={10}
          className={`${layout === "desktop" ? "rounded-xl shadow-md overflow-hidden" : "overflow-hidden"}`}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="relative">
                {img ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${img}`}
                    alt={`${name}-${index}`}
                    className={mainImageClass}
                    onClick={() => openPreview(index)}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/600x400/eeeeee/aaaaaa?text=Image+Error")
                    }
                  />
                ) : (
                  // placeholder div with same aspect ratio
                  <div
                    className={placeholderMainClass}
                    onClick={() => {
                      /* don't open preview for placeholder */
                    }}
                    role="img"
                    aria-label="No image"
                  >
                    <span className="text-sm">No image</span>
                  </div>
                )}

                {/* Counter Gambar */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                  {activeIndex + 1}/{totalImages}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* 🔹 Thumbnail Scrollable */}
        {images.length > 1 && (
          <div
            ref={thumbsContainerRef}
            className={`flex gap-3 mt-4 overflow-x-auto scrollbar-hide ${layout === "mobile" ? "px-4 md:px-6 py-1" : "p-1"}`}
          >
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => handleThumbClick(index)}
                className={`flex-shrink-0 w-14 h-14 md:w-20 md:h-20 cursor-pointer rounded-lg border border-neutral-300 overflow-hidden transition-all flex items-center justify-center ${
                  activeIndex === index ? "ring-2 ring-[#33C060] scale-105" : "hover:ring-1 hover:ring-[#33C060]"
                }`}
                aria-hidden={img ? "false" : "true"}
              >
                {img ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${img}`}
                    alt={`${name}-thumb-${index}`}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/600x400/eeeeee/aaaaaa?text=Image+Error")
                    }
                    // clicking thumbnail should not open modal; only main image opens modal
                  />
                ) : (
                  // thumbnail placeholder keeps same box size
                  <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔍 Modal Preview Gambar */}
      {isModalOpen && previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closePreview}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tombol Tutup */}
            <button
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
              onClick={closePreview}
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Tombol Navigasi */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
                  onClick={handlePrevImage}
                  aria-label="Prev preview"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg"
                  onClick={handleNextImage}
                  aria-label="Next preview"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Gambar Preview */}
            <img
              src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${previewImage}`}
              alt="Preview"
              className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-xl"
            />

            {/* Counter di Modal */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-1 rounded-full">
              {activeIndex + 1}/{totalImages}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;
