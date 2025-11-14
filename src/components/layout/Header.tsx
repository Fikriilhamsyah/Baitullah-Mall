"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// Components
import { MobileSidebar } from "./MobileSidebar";

// Context
import { useSearch } from "@/context/SearchContext";

// Icons
import { navIcons } from "@utils/helpers";
import {
  Home,
  Package,
  Tag,
  UserRound,
  Coins,
  LogOut,
  Instagram,
  Facebook,
  Youtube,
  ShoppingCart,
  Search,
  X
} from "lucide-react";

// 🧠 Dummy meta keywords (bisa ganti dari API)
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

const navLinks = [
  { id: 1, href: "/", label: "Beranda" },
  { id: 2, href: "/productlist", label: "Produk" },
  { id: 3, href: "/about", label: "Tukar Poin" },
  { id: 4, href: "/about", label: "Pria" },
  { id: 5, href: "/about", label: "Wanita" },
  { id: 6, href: "/about", label: "Promo" },
];

const navLinksMobile = [
  {
    title: "Menu",
    items: [
      { href: "/", label: "Beranda", icon: Home },
      { href: "/productlist", label: "Produk", icon: Package },
      { href: "/products", label: "Tukar Poin", icon: Coins },
      { href: "/promo", label: "Promo", icon: Tag },
    ],
  },
  {
    title: "Akun",
    items: [
      { href: "/account", label: "Profil", icon: UserRound },
      { href: "/logout", label: "Keluar", icon: LogOut },
    ],
  },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔍 Search logic
  const { searchTerm, setSearchTerm, handleSearch } = useSearch();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  // ✅ Ambil query dari URL (misal ?query=tas)
  const queryParam = searchParams.get("query") || "";

  // 🧠 Filter suggestion
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

  // 🧱 Klik luar untuk tutup dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-full">
      <div className="fixed top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <nav
          className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            isScrolled ? "py-3" : "py-3"
          }`}
        >
          {/* 🔝 Topbar */}
          <div className="hidden lg:flex justify-between items-center pb-5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 font-normal">Ikuti Kami</span>
                <a href="#" aria-label="Instagram" className="hover:scale-110 transition">
                  <Instagram className="w-4 h-4 text-neutral-600 hover:text-neutral-900" />
                </a>
                <a href="#" aria-label="Facebook" className="hover:scale-110 transition">
                  <Facebook className="w-4 h-4 text-neutral-600 hover:text-neutral-900" />
                </a>
                <a href="#" aria-label="YouTube" className="hover:scale-110 transition">
                  <Youtube className="w-4 h-4 text-neutral-600 hover:text-neutral-900" />
                </a>
              </div>
              <span className="text-sm text-neutral-400">|</span>
              <a href="https://baitullah.co.id/" target="_blank" className="text-sm text-neutral-600 hover:text-neutral-900 font-normal transition">
                Beli Paket Haji & Umroh
              </a>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Masuk
              </button>
              <span className="text-sm text-neutral-400">|</span>
              <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Daftar
              </button>
            </div>
          </div>

          {/* 🔸 Main bar */}
          <div className="flex justify-between items-center gap-4">
            {/* Kiri: Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-md text-neutral-600 hover:bg-gray-100 focus:ring-2 focus:ring-primary-500"
                >
                  {navIcons.menu}
                </button>
              </div>

              {/* Logo */}
              <Link href="/" className="flex items-center">
                <img
                  src="/img/logo/logo-baitullah-mall.webp"
                  alt="Baitullah Mall"
                  className="h-9 lg:h-12 w-auto object-contain transition-all"
                />
              </Link>
            </div>

            {/* Tengah: Search + Nav */}
            <div className="hidden lg:flex flex-col w-full mx-10">
              {/* 🔍 Search Bar with Suggestion */}
              <div ref={inputRef} className="relative flex justify-center w-full mb-3">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);

                      // Jika kosong → tampilkan semua produk
                      if (value.trim().length === 0) {
                        handleSearch("");
                      }
                    }}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchTerm.trim().length > 0) {
                        e.preventDefault();
                        handleSearch(searchTerm.trim());
                        setShowSuggestions(false);
                      }
                    }}
                    className="w-full px-5 py-2.5 pr-12 rounded-md bg-white text-neutral-800 placeholder-neutral-400 border border-[#33C060] focus:outline-none focus:ring-1 focus:ring-[#33C060] transition"
                  />
                  <button
                    type="button"
                    disabled={searchTerm.trim().length === 0}
                    onClick={() => handleSearch(searchTerm)}
                    className={`
                      absolute right-1 top-1/2 -translate-y-1/2 
                      p-2.5 rounded-md transition cursor-pointer
                      ${searchTerm.trim().length === 0 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                        : "bg-[#33C060] hover:bg-[#299A4D] text-white"}
                    `}
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  {/* 🔡 Suggestion dropdown */}
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
              </div>

              {/* 🔗 Nav Link */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.id}
                        href={link.href}
                        className={`text-xs font-normal transition-colors ${
                          isActive
                            ? "text-neutral-900"
                            : "text-neutral-600 hover:text-neutral-900 font-semibold"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Kanan: Cart & Profile */}
            <div className="flex items-center gap-4">
              <Link href="/cart" className="flex-shrink-0">
                <ShoppingCart className="w-7 h-7 text-neutral-700 hover:text-black transition" />
              </Link>
              <Link href="/profile" className="flex-shrink-0 block lg:hidden">
                <UserRound className="w-7 h-7 text-neutral-700 hover:text-black transition" />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* 📱 Sidebar Mobile */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        links={navLinksMobile}
        activePath={pathname}
      />
    </header>
  );
};

export default Header;
