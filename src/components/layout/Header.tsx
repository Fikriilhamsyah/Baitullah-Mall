"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Components
import { MobileSidebar } from "./MobileSidebar";
import SignIn from "../features/auth/SignIn";
import SignUp from "../features/auth/SignUp";
import Dropdown from "@/components/ui/Dropdown";
import { useToast } from "@/components/ui/Toast";

// Context
import { useSearch } from "@/context/SearchContext";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import { useCartByIdUser } from "@/hooks/useCartByIdUser";

// Hooks
import usePoin from "@/hooks/usePoin";

// Icons
import { navIcons } from "@utils/helpers";
import {
  Home,
  Package,
  Tag,
  UserRound,
  LogOut,
  Instagram,
  Facebook,
  Youtube,
  ShoppingCart,
  Search,
  ChevronDown,
} from "lucide-react";
import { formatPointsToRupiah } from "@/types/IUser";

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
  // { id: 6, href: "/about", label: "Promo" },
];

const navLinksMobile = [
  {
    title: "Menu",
    items: [
      { href: "/", label: "Beranda", icon: Home },
      { href: "/productlist", label: "Produk", icon: Package },
      // { href: "/promo", label: "Promo", icon: Tag },
    ],
  },
  {
    title: "Akun",
    items: [
      { href: "/profile", label: "Profil", icon: UserRound },
      { href: "/logout", label: "Keluar", icon: LogOut },
    ],
  },
];

const Header: React.FC = () => {
  const hydrated = useAuth((s) => s.hydrated);
  if (!hydrated) return null;

  const router = useRouter();
  const pathname = usePathname();

  const { cartByIdUser, loading: cartByIdUserLoading, error: cartByIdUserError } = useCartByIdUser();
  const { poin, loading: poinLoading, error: poinError, refetch } = usePoin();
  const cartCount = cartByIdUser.length;

  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 🔍 Search logic
  const { searchTerm, setSearchTerm, handleSearch } = useSearch();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  // Placeholder animated
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState("");
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const user = useAuth((state) => state.user);

  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { showToast } = useToast();

  // ✅ Ambil query dari URL (misal ?query=tas)
  const queryParam = searchParams.get("query") || "";

  const handleLogout = () => {
    useAuth.getState().logout();
    showToast("Berhasil logout", "success");
    router.push("/");
  };

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

  // Animated placeholder effect
  useEffect(() => {
    // Stop animasi jika user mengetik manual
    if (isInputFocused || searchTerm.trim().length > 0) {
      setAnimatedPlaceholder("");
      return;
    }

    const currentKeyword = metaKeywords[keywordIndex];

    let typingSpeed = isDeleting ? 50 : 100; // lebih cepat saat menghapus

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Mengetik
        const nextText = currentKeyword.slice(0, charIndex + 1);
        setAnimatedPlaceholder(nextText);
        setCharIndex((prev) => prev + 1);

        // Jika sudah lengkap → mulai jeda lalu delete
        if (nextText === currentKeyword) {
          setTimeout(() => setIsDeleting(true), 1000); // jeda 1 detik
        }
      } else {
        // Menghapus
        const nextText = currentKeyword.slice(0, charIndex - 1);
        setAnimatedPlaceholder(nextText);
        setCharIndex((prev) => prev - 1);

        // Jika sudah terhapus → lanjut ke keyword berikutnya
        if (nextText === "") {
          setIsDeleting(false);
          setKeywordIndex((prev) => (prev + 1) % metaKeywords.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, keywordIndex, searchTerm]);

  // Cursor blinking effect
  useEffect(() => {
    if (isInputFocused) return;

    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, [isInputFocused]);

  const sidebarLinks =
    user === null
      ? [...navLinksMobile.filter((s) => s.title !== "Akun")]
      : [...navLinksMobile];

  const badgeRightClass = (() => {
    if (cartCount > 99) return "-right-5";
    if (cartCount >= 10) return "-right-4";
    return "-right-3";
  })();

  const myPoinEntry = React.useMemo(() => {
    if (!user || poin.length === 0) return null;
    return poin.find(
      (p) => Number(p.id_users) === Number(user.id)
    ) ?? null;
  }, [poin, user]);

  const myPoinNumber = React.useMemo(() => {
    if (!hydrated || !user) return 0;

    const entry = poin.find(
      (p) => Number(p.id_users) === Number(user.id)
    );

    return entry ? Number(entry.total_score_sum) || 0 : 0;
  }, [hydrated, poin, user]);

  const renderSecondaryNav = () => (
    <nav
      className={`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isScrolled ? "py-3" : "py-3"
      }`}
    >
      {/* 🔸 Main bar */}
      <div className="flex justify-between items-center gap-4">
        {/* Kiri: Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="hidden lg:block w-10 h-10" />
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
          <Link href="/" className="flex lg:hidden items-center">
            <img
              src="/img/logo/logo-baitullah-mall.webp"
              alt="Baitullah Mall"
              className="h-9 lg:h-12 w-auto object-contain transition-all"
            />
          </Link>
        </div>

        {/* Tengah: Search + Nav */}
        <div className="hidden lg:flex mx-10">
          {/* Logo */}
          <Link href="/">
            <img
              src="/img/logo/logo-baitullah-mall.webp"
              alt="Baitullah Mall"
              className="h-9 lg:h-12 w-auto object-contain transition-all"
            />
          </Link>
        </div>

        {/* Kanan: Cart & Profile */}
        <div className="flex items-center gap-4">
          {user === null ? (
            <button
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                openModal({
                  title: "Masuk",
                  size: "md",
                  mobileMode: "full",
                  content: (<SignIn />),
                });
              }}
            >
              <ShoppingCart className="w-7 h-7 text-neutral-700 hover:text-black transition" />
            </button>
          ) : (
            <div className="relative flex-shrink-0 cursor-pointer">
              <Link href="/cart">
                <ShoppingCart className="w-7 h-7 text-neutral-700 hover:text-black transition" />
              </Link>
              {cartCount > 0 && (
                <span
                  className={`absolute -top-3 ${badgeRightClass} inline-flex items-center justify-center py-1 px-2 text-[10px] font-semibold text-white bg-primary-500 rounded-full border-2 border-white z-10`}
                  aria-label={`${cartCount} item di keranjang`}
                  aria-live="polite"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
          )}

          <div className="block lg:hidden">
            {user === null ? (
              <button
                className="flex-shrink-0 block lg:hidden cursor-pointer"
                onClick={() => {
                  openModal({
                    title: "Masuk",
                    size: "md",
                    mobileMode: "full",
                    content: (<SignIn />),
                  });
                }}
              >
                <UserRound className="w-7 h-7 text-neutral-700 hover:text-black transition" />
              </button>
            ) : (
              <Dropdown
                trigger={
                  <UserRound className="w-7 h-7 text-neutral-700 hover:text-black transition" />
                }
              >
                <div className="flex flex-col text-sm">
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:bg-gray-100 text-left cursor-pointer">
                    <UserRound className="w-4 h-4" />
                    Profil
                  </Link>
                  <button className="flex items-center gap-2 px-3 py-2 text-primary-500 hover:bg-red-50 text-left cursor-pointer" onClick={() => handleLogout()} >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderDefaultNav = () => (
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
        {user !== null ? (
          <Dropdown
            trigger={
              <div className="flex items-center gap-2 cursor-pointer">
                {user.profile_photo_path ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BAITULLAH}/storage/${user.profile_photo_path}`}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center w-6 h-6 rounded-full bg-gray-200">
                    <UserRound className="w-4 h-4 text-neutral-600 hover:text-neutral-900" />
                  </div>
                )}
                <p className="text-sm text-neutral-600">{user.name}</p>
                <ChevronDown className="h-6 w-6 text-neutral-500" />
              </div>
            }
            className="flex items-center gap-2"
          >
            <div>
              <div className="px-3 py-2">
                <div className="border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-1">
                    {user.profile_photo_path ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BAITULLAH}/storage/${user.profile_photo_path}`}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-6 h-6 rounded-full bg-gray-200">
                        <UserRound className="w-4 h-4 text-neutral-600 hover:text-neutral-900" />
                      </div>
                    )}
                    <p className="text-xs text-neutral-600">{user.name}</p>
                  </div>
                  {poinLoading ? (
                      <p className="text-sm text-gray-500 text-center mt-1">Memuat poin...</p>
                  ) : poinError ? (
                      <p className="text-sm text-red-500 text-center mt-1">Gagal memuat poin</p>
                  ) : myPoinEntry ? (
                  <p className="text-base font-bold text-green-600 text-center mt-1">
                      {formatPointsToRupiah(myPoinNumber)} Poin
                  </p>
                  ) : (
                      <p className="text-sm text-gray-500 text-center mt-1">0 Poin</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col text-sm">
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:bg-gray-100 text-left cursor-pointer">
                  <UserRound className="w-4 h-4" />
                  Profil
                </Link>
                <button className="flex items-center gap-2 px-3 py-2 text-primary-500 hover:bg-red-50 text-left cursor-pointer" onClick={() => handleLogout()} >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          </Dropdown>
        ) : (
          <div className="flex items-center gap-2">
            <button
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              onClick={() =>
                openModal({
                  title: "Masuk",
                  size: "md",
                  mobileMode: "normal",
                  content: (<SignIn />),
                })
              }
            >
              Masuk
            </button>
            <span className="text-sm text-neutral-400">|</span>
            <button
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              onClick={() =>
                openModal({
                  title: "Daftar",
                  size: "md",
                  mobileMode: "normal",
                  content: (<SignUp />),
                })
              }
            >
              Daftar
            </button>
          </div>
        )}
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
                placeholder={
                  !isInputFocused && searchTerm.length === 0
                    ? `${animatedPlaceholder}${cursorVisible ? " |" : ""}`
                    : ""
                }
                value={searchTerm}
                onFocus={() => {
                  setIsInputFocused(true);
                  setShowSuggestions(suggestions.length > 0);
                }}

                onBlur={() => {
                  setIsInputFocused(false);

                  // Reset animasi supaya mulai dari awal
                  if (searchTerm.length === 0) {
                    setAnimatedPlaceholder("");
                    setCharIndex(0);
                    setIsDeleting(false);
                  }
                }}

                onChange={(e) => {
                  const value = e.target.value;
                  setSearchTerm(value);

                  // Jika kosong → tampilkan semua produk
                  if (value.trim().length === 0) {
                    handleSearch("");
                  }
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
        <div className="flex gap-4">
          {user === null ? (
            <button
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                openModal({
                  title: "Masuk",
                  size: "md",
                  mobileMode: "full",
                  content: (<SignIn />),
                });
              }}
            >
              <ShoppingCart className="w-7 h-7 text-neutral-700 hover:text-black transition" />
            </button>
          ) : (
            <div className="relative flex-shrink-0 cursor-pointer">
              <Link href="/cart">
                <ShoppingCart className="w-7 h-7 text-neutral-700 hover:text-black transition" />
              </Link>
              {cartCount > 0 && (
                <span
                  className={`absolute -top-3 ${badgeRightClass} inline-flex items-center justify-center py-1 px-2 text-[10px] font-semibold text-white bg-primary-500 rounded-full border-2 border-white z-10`}
                  aria-label={`${cartCount} item di keranjang`}
                  aria-live="polite"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
          )}

          <div className="block lg:hidden">
            {user === null ? (
              <button
                className="flex-shrink-0 block lg:hidden cursor-pointer"
                onClick={() => {
                  openModal({
                    title: "Masuk",
                    size: "md",
                    mobileMode: "full",
                    content: (<SignIn />),
                  });
                }}
              >
                <UserRound className="w-7 h-7 text-neutral-700 hover:text-black transition" />
              </button>
            ) : (
              <Dropdown
                trigger={
                  <UserRound className="w-7 h-7 text-neutral-700 hover:text-black transition" />
                }
              >
                <div className="flex flex-col text-sm">
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-neutral-600 hover:bg-gray-100 text-left cursor-pointer">
                    <UserRound className="w-4 h-4" />
                    Profil
                  </Link>
                  <button className="flex items-center gap-2 px-3 py-2 text-primary-500 hover:bg-red-50 text-left cursor-pointer" onClick={() => handleLogout()} >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const isCheckoutPage = pathname.startsWith("/checkout");

  return (
    <header className="w-full">
      <div
        className={`fixed top-0 z-40 w-full bg-white/80 backdrop-blur-md safari-backdrop will-change-transform transform-gpu border-b border-gray-200 transition-shadow duration-300 ${
          pathname === "/profile" && !isScrolled ? "shadow-2xl" : ""
        }`}
      >
        {isCheckoutPage ? renderSecondaryNav() : renderDefaultNav()}
      </div>

      {/* 📱 Sidebar Mobile */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        links={sidebarLinks}
        activePath={pathname}
      />
    </header>
  );
};

export default Header;
