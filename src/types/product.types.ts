// Mendefinisikan tipe data untuk kategori produk
export type ProductCategory =
  | "Pakaian & Ihram"
  | "Aksesoris Ibadah"
  | "Perlengkapan Travel"
  | "Kesehatan & Kebersihan"
  | "Buku & Panduan"
  | "Paket Bundling";

// Opsi untuk setiap tipe varian (mis: "Merah", "XL")
export interface VariantOption {
  id: string;
  value: string; // "Merah", "XL", "Pria"
  priceModifier: number; // Penyesuai harga (mis: +20000 untuk XL)
}

// Tipe varian (mis: "Warna", "Ukuran")
export interface VariantType {
  id: string;
  name: "Warna" | "Ukuran" | "Gender"; // Tipe varian yang diizinkan
  options: VariantOption[];
}

// Interface utama untuk Produk
export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Harga dasar
  category: ProductCategory;
  imageUrl: string;
  stock: number;
  variants?: VariantType[]; // Varian bersifat opsional
}
