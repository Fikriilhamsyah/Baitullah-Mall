import React from "react";
import { ProductCategory } from "../types/IProduct";
import {
  Shirt,
  Sparkles,
  Navigation,
  HeartPulse,
  BookOpen,
  Package,
  Menu,
  Handbag,
  UserRound,
  House,
  Box,
  CreditCard,
} from "lucide-react";

// Icon kategori
export const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  "Pakaian & Ihram": <Shirt className="w-4 h-4" />,
  "Aksesoris Ibadah": <Sparkles className="w-4 h-4" />,
  "Perlengkapan Travel": <Navigation className="w-4 h-4" />,
  "Kesehatan & Kebersihan": <HeartPulse className="w-4 h-4" />,
  "Buku & Panduan": <BookOpen className="w-4 h-4" />,
  "Paket Bundling": <Package className="w-4 h-4" />,
};

// Icon Navbar
export const navIcons = {
  menu: <Menu className="block h-6 w-6" />,
  cart: <Handbag className="h-6 w-6" />,
  account: <UserRound className="h-6 w-6" />,
};

// Helper untuk menggabungkan className conditionally merge class Tailwind
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
