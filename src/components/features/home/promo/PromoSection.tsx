import React from 'react';
import { Tag } from 'lucide-react';
import { PromoBannerSlider } from './PromoBannerSlider';

export function PromoBanner() {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
      <h2 className="text-md md:text-2xl font-bold text-neutral-900 pb-2 md:pb-8">
        Promo
      </h2>
      {/* <img className="w-full h-full object-cover aspect-video" src="/img/banner/banner-promo-5.webp" alt="Promo Banner" /> */}
      <PromoBannerSlider />
    </section>
  );
}
