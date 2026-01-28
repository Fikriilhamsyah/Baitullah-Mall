"use client";

import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

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

  /**
   * 🔹 Sinkronkan searchTerm dengan URL query
   * HANYA ketika user benar-benar berada di /productlist
   */
  useEffect(() => {
    if (!router.isReady) return;

    const isProductList = router.asPath.startsWith("/productlist");

    if (!isProductList) {
      // Kalau pindah halaman → reset state saja
      setSearchTerm("");
      return;
    }

    const query =
      typeof router.query.query === "string"
        ? router.query.query
        : "";

    setSearchTerm(query);
  }, [router.asPath, router.isReady]);

  /**
   * 🔍 Handle search
   */
  const handleSearch = (value: string) => {
    if (!router.isReady) return;

    const trimmed = value.trim();
    const currentPath = router.pathname;

    // 1️⃣ Home + search kosong → tidak navigasi
    if (currentPath === "/" && trimmed.length === 0) {
      setSearchTerm("");
      return;
    }

    // 2️⃣ Search dikosongkan
    if (trimmed.length === 0) {
      // product detail → jangan redirect
      if (currentPath.startsWith("/product") && currentPath !== "/productlist") {
        setSearchTerm("");
        return;
      }

      // productlist → bersihkan query
      if (currentPath === "/productlist") {
        router.replace("/productlist", undefined, { shallow: true });
        setSearchTerm("");
        return;
      }
    }

    // 3️⃣ Ada teks → ke productlist
    const searchUrl = `/productlist?query=${encodeURIComponent(trimmed)}`;

    if (router.asPath !== searchUrl) {
      router.push(searchUrl);
    }
  };

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, handleSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
