"use client";
import React, { useState, useEffect, useRef } from "react";

// Components
import { CategoryCarousel } from "@/components/features/category/CategoryCarousel";
import { FilterSidebar } from "@components/features/FilterSidebar";
import { InputField } from "@/components/ui/InputField";

// Icons
import { Search, ListFilter } from "lucide-react";

// Context
import { useSearch } from "@/context/SearchContext";

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
  metaKeywords?: string[];
  title?: string;
  categoryFilter?: true | false;
  filterButtonLabel?: true | false;
  defaultSearch?: string;
  onSearch?: (query: string) => void;

  // 🔹 Tambahan props filter dari ProductPage
  totalCount?: number;
  totalAll?: number;
  category?: string[];
  gender?: string[];
  productType?: string[];
  sortBy?: string;
  minPrice?: number | "";
  maxPrice?: number | "";
  onChangeCategory?: (val: string[]) => void;
  onChangeGender?: (val: string[]) => void;
  onChangeSort?: (val: string) => void;
  onChangeMinPrice?: (val: number | "") => void;
  onChangeMaxPrice?: (val: number | "") => void;
  onChangeProductType?: (val: string[]) => void;
  onResetFilters?: () => void;
}

export function HeroSection(props: HeroSectionProps) {
  // 🧩 STATE UTAMA UNTUK FILTER
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [category, setCategory] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [productType, setProductType] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Data dummy agar tidak error (bisa dihubungkan ke API di kemudian hari)
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalAll, setTotalAll] = useState<number>(0);

  // 🔍 SEARCH STATE
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const { searchTerm, setSearchTerm, handleSearch } = useSearch();

  // ✅ Sinkronisasi defaultSearch
  useEffect(() => {
    if (props.defaultSearch) {
      setSearchTerm(props.defaultSearch);
    }
  }, [props.defaultSearch, setSearchTerm]);

  // ✅ Panggil props.onSearch() saat defaultSearch berubah
  useEffect(() => {
    if (props.defaultSearch && props.onSearch) {
      props.onSearch(props.defaultSearch);
    }
  }, [props.defaultSearch]);

  // ✅ Filter saran berdasarkan searchTerm
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const source = props.metaKeywords ?? metaKeywords;
      const filtered = source.filter((kw) =>
        kw.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, props.metaKeywords]);

  // ✅ Tutup dropdown saran ketika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handler pencarian
  const handleSearchClick = () => {
    if (searchTerm.trim().length > 0) {
      handleSearch(searchTerm.trim());
      if (props.onSearch) props.onSearch(searchTerm.trim());
      setShowSuggestions(false);
    }
  };

  // ✅ Handler Reset Filter
  const handleResetFilters = () => {
    setCategory([]);
    setGender([]);
    setProductType([]);
    setSortBy("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <section>
      <div className="w-full bg-white hero-mobile-container md:hero-tablet-container px-4 md:px-6 py-4 md:py-6 pt-[80px] md:pt-[89px] text-white">
        <div className="container mx-auto">
          <div className="relative flex items-center gap-2">
            {/* 🔍 Input Search */}
            <div ref={inputRef} className="flex-grow relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  if (value.trim().length === 0) {
                    handleSearch("");
                    if (props.onSearch) props.onSearch("");
                  }
                }}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchTerm.trim().length > 0) {
                    e.preventDefault();
                    handleSearchClick();
                  }
                }}
                className="w-full px-5 py-2.5 pr-12 rounded-md bg-white text-neutral-800 placeholder-neutral-400 border border-[#33C060] focus:outline-none focus:ring-1 focus:ring-[#33C060] transition"
              />

              {/* 🔘 Tombol Search */}
              <button
                type="button"
                disabled={searchTerm.trim().length === 0}
                onClick={handleSearchClick}
                className={`
                  absolute right-1 top-1/2 -translate-y-1/2 
                  p-2.5 rounded-md transition cursor-pointer
                  ${
                    searchTerm.trim().length === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#33C060] hover:bg-[#299A4D] text-white"
                  }
                `}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* 🔽 Dropdown Saran */}
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

            {/* ⚙️ Tombol Filter */}
            {props.filterButtonLabel && (
              <button
                onClick={() => setIsFilterOpen(true)}
                className="bg-transparent"
              >
                <ListFilter
                  size={24}
                  strokeWidth={3}
                  className="text-primary-500"
                />
              </button>
            )}
          </div>

          {/* 🧭 Category Carousel */}
          {props.categoryFilter && <CategoryCarousel />}

          {/* 🪟 Sidebar Filter */}
          <FilterSidebar
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            totalCount={props.totalCount || 0}
            totalAll={props.totalAll || 0}
            category={props.category || []}
            gender={props.gender || []}
            sortBy={props.sortBy || ""}
            minPrice={props.minPrice || ""}
            maxPrice={props.maxPrice || ""}
            productType={props.productType || []}
            onChangeCategory={props.onChangeCategory || (() => {})}
            onChangeGender={props.onChangeGender || (() => {})}
            onChangeSort={props.onChangeSort || (() => {})}
            onChangeMinPrice={props.onChangeMinPrice || (() => {})}
            onChangeMaxPrice={props.onChangeMaxPrice || (() => {})}
            onChangeProductType={props.onChangeProductType || (() => {})}
            onResetFilters={props.onResetFilters || (() => {})}
          />
        </div>
      </div>
    </section>
  );
}
