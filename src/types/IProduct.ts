export type IProductCategory =
  | "Pakaian & Ihram"
  | "Aksesoris Ibadah"
  | "Perlengkapan Travel"
  | "Kesehatan & Kebersihan"
  | "Buku & Panduan"
  | "Paket Bundling";

export interface IVariantOption {
  id: string;
  value: string;
  priceModifier: number;
}

export interface IVariantType {
  id: string;
  name: "Warna" | "Ukuran" | "Gender";
  options: IVariantOption[];
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: IProductCategory;
  imageUrl: string;
  images?: string[];
  stock: number;
  rating?: number;
  variants?: IVariantType[];
}
