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
    const searchUrl =
      trimmed.length === 0
        ? "/productlist"
        : `/productlist?query=${encodeURIComponent(trimmed)}`;

    // 🔹 Hindari navigasi ke URL yang sama
    const currentUrl = window.location.pathname + window.location.search;
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
