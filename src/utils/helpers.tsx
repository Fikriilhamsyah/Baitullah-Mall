import React from "react";
import { ProductCategory } from "../types/product.types";
import {
  Shirt,
  Sparkles,
  Navigation,
  HeartPulse,
  BookOpen,
  Package,
} from "lucide-react";

// Ikon untuk setiap kategori
export const categoryIcons: Record<ProductCategory, React.ReactNode> = {
  "Pakaian & Ihram": <Shirt className="w-4 h-4" />,
  "Aksesoris Ibadah": <Sparkles className="w-4 h-4" />,
  "Perlengkapan Travel": <Navigation className="w-4 h-4" />,
  "Kesehatan & Kebersihan": <HeartPulse className="w-4 h-4" />,
  "Buku & Panduan": <BookOpen className="w-4 h-4" />,
  "Paket Bundling": <Package className="w-4 h-4" />,
};
