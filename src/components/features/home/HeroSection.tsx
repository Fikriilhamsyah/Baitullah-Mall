"use client";
import React, { useState, useEffect, useRef } from "react";

// Components
import { CategoryCarousel } from "@/components/features/category/CategoryCarousel";
import { FilterSidebar } from "@components/features/FilterSidebar";
import { InputField } from "@/components/ui/InputField";

// Icons
import { Search, ListFilter } from "lucide-react";
import { filter } from "framer-motion/client";

// Dummy data (bisa diganti dengan hasil dari API)
const metaKeywords = [
  "Tas Ihram",
  "Kain Ihram",
  "Sabuk Haji",
  "Buku Panduan Umroh",
  "Obat Perjalanan",
  "Travel Set",
  "Botol Spray Wudhu",
  "Masker Haji",
  "Sandal Haji",
];

interface HeroSectionProps {
  metaKeywords?: string[]; // bisa dikirim dari parent
  title?: string;
  filterButtonLabel?: true | false; // tampilkan label pada tombol filter
  onSearch?: (query: string) => void; // contoh event callback
}

export function HeroSection(props: HeroSectionProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLDivElement>(null);

  // 🔍 Filter meta keywords berdasarkan input
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = metaKeywords.filter((kw) =>
        kw.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // 🧱 Tutup dropdown saat klik di luar input
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section>
      <div className="w-full bg-white hero-mobile-container md:hero-tablet-container px-4 md:px-6 py-4 md:py-6 pt-[80px] text-white">
        <div className="container mx-auto">
          {/* 🔍 Search bar + Filter button */}
          <div className="relative flex items-center gap-2 mb-2">
            <div ref={inputRef} className="flex-grow relative">
              <InputField
                placeholder="Cari produk..."
                icon={Search}
                variant="rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
              />

              {/* 🔡 Keyword suggestion dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute mt-1 left-0 right-0 bg-white text-neutral-800 shadow-md rounded-lg overflow-hidden z-20">
                  {suggestions.map((kw, index) => (
                    <li
                      key={index}
                      onClick={() => {
                        setSearchTerm(kw);
                        setShowSuggestions(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {kw}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 🧩 Filter Button */}
            {props.filterButtonLabel && (
              <button
                onClick={() => setIsFilterOpen(true)}
                className="bg-transparent"
              >
                <ListFilter size={24} className="text-primary-500" />
              </button>
            )}
          </div>

          {/* 🧭 Category Carousel */}
          <CategoryCarousel />

          {/* 🧱 Sidebar Filter */}
          <FilterSidebar
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
      </div>
    </section>
  );
}
