"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: (value: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchTerm: "",
  setSearchTerm: () => {},
  handleSearch: () => {},
});

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔹 Sinkronkan searchTerm dengan URL query (biar input selalu up-to-date)
  useEffect(() => {
    const query = searchParams.get("query") || "";
    setSearchTerm(query);
  }, [searchParams]);

  const handleSearch = (value: string) => {
    if (typeof window === "undefined") return;

    const trimmed = value.trim();
    const currentPath = window.location.pathname;

    // 1️⃣ Jika masih di Home dan search kosong → jangan navigasi
    if (currentPath === "/" && trimmed.length === 0) {
      setSearchTerm("");
      return;
    }

    // 2️⃣ Jika kosong, cek dulu apakah user sedang di product detail
    //    Jika iya → jangan pindah halaman
    if (trimmed.length === 0) {
      if (currentPath.startsWith("/product") && currentPath !== "/productlist") {
        // sedang di product detail → jangan redirect
        setSearchTerm("");
        return;
      }

      // kalau sedang di productlist → reset query
      if (currentPath === "/productlist") {
        router.replace("/productlist");
        return;
      }
    }

    // 3️⃣ Jika ada teks → arahkan ke productlist?query=
    const searchUrl = `/productlist?query=${encodeURIComponent(trimmed)}`;
    const currentUrl = currentPath + window.location.search;

    if (currentUrl !== searchUrl) {
      router.replace(searchUrl);
    }
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
