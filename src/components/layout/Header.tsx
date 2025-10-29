"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navIcons } from "@utils/helpers";
import { MobileSidebar } from "./MobileSidebar";
import { Home, Package, Tag, UserRound, LogOut } from "lucide-react"; // 🧩 tambah icon

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Produk" },
  { href: "/about", label: "Pria" },
  { href: "/about", label: "Wanita" },
  { href: "/about", label: "Promo" },
];

// 🧩 navLinksMobile dengan subjudul + icon
const navLinksMobile = [
  {
    title: "Menu",
    items: [
      { href: "/", label: "Beranda", icon: Home },
      { href: "/products", label: "Produk", icon: Package },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Kiri: Tombol menu + logo */}
          <div className="flex items-center gap-2">
            {/* Tombol Menu Mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {navIcons.menu}
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/img/logo/logo-baitullah-mall.webp"
                alt="Baitullah Mall"
                className="h-7 lg:h-10"
              />
            </Link>
          </div>

          {/* Kanan (Mobile) */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/cart"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {navIcons.cart}
            </Link>
            <Link
              href="/account"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {navIcons.account}
            </Link>
          </div>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Sidebar Modular */}
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
