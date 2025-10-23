import { Product } from "../types/product.types";

// Ini adalah data yang akan disimulasikan sebagai respons dari API
export const dummyProducts: Product[] = [
  {
    id: "P1001",
    name: "Kain Ihram Pria Premium",
    description:
      "Kain ihram tanpa jahitan dengan bahan katun premium yang menyerap keringat.",
    basePrice: 350000,
    category: "Pakaian & Ihram",
    imageUrl: "https://placehold.co/600x400/ffffff/111111?text=Kain+Ihram",
    stock: 150,
    variants: [
      {
        id: "V_UKURAN",
        name: "Ukuran",
        options: [
          { id: "UK_M", value: "M", priceModifier: 0 },
          { id: "UK_L", value: "L", priceModifier: 0 },
          { id: "UK_XL", value: "XL", priceModifier: 25000 },
          { id: "UK_XXL", value: "XXL", priceModifier: 50000 },
        ],
      },
      {
        id: "V_GENDER",
        name: "Gender",
        options: [{ id: "G_PRIA", value: "Pria", priceModifier: 0 }],
      },
    ],
  },
  {
    id: "P1002",
    name: "Gamis Wanita Syar'i",
    description: "Gamis longgar dan nyaman untuk ibadah, bahan adem.",
    basePrice: 450000,
    category: "Pakaian & Ihram",
    imageUrl: "https://placehold.co/600x400/ffffff/111111?text=Gamis+Wanita",
    stock: 80,
    variants: [
      {
        id: "V_WARNA_G",
        name: "Warna",
        options: [
          { id: "W_PUTIH", value: "Putih", priceModifier: 0 },
          { id: "W_HITAM", value: "Hitam", priceModifier: 0 },
          { id: "W_NAVY", value: "Navy", priceModifier: 0 },
        ],
      },
      {
        id: "V_UKURAN_G",
        name: "Ukuran",
        options: [
          { id: "UK_M", value: "M", priceModifier: 0 },
          { id: "UK_L", value: "L", priceModifier: 0 },
          { id: "UK_XL", value: "XL", priceModifier: 15000 },
        ],
      },
    ],
  },
  {
    id: "A2001",
    name: "Tasbih Digital LED",
    description:
      "Tasbih digital dengan lampu LED agar mudah menghitung di tempat gelap.",
    basePrice: 75000,
    category: "Aksesoris Ibadah",
    imageUrl: "https://placehold.co/600x400/ffffff/111111?text=Tasbih+Digital",
    stock: 300,
    variants: [
      {
        id: "V_WARNA_T",
        name: "Warna",
        options: [
          { id: "WT_HITAM", value: "Hitam", priceModifier: 0 },
          { id: "WT_PUTIH", value: "Putih", priceModifier: 0 },
          { id: "WT_BIRU", value: "Biru", priceModifier: 0 },
          { id: "WT_PINK", value: "Pink", priceModifier: 5000 },
        ],
      },
    ],
  },
  {
    id: "T3001",
    name: "Botol Semprot Wudhu",
    description:
      "Botol spray praktis untuk berwudhu di perjalanan (travel size).",
    basePrice: 35000,
    category: "Perlengkapan Travel",
    imageUrl: "https://placehold.co/600x400/ffffff/111111?text=Botol+Wudhu",
    stock: 500,
  },
  {
    id: "K4001",
    name: "Sabun & Shampoo Non-Parfum",
    description:
      "Paket sabun dan shampoo halal tanpa parfum, aman untuk ihram.",
    basePrice: 120000,
    category: "Kesehatan & Kebersihan",
    imageUrl: "https://placehold.co/600x400/ffffff/111111?text=Sabun+Ihram",
    stock: 200,
  },
  {
    id: "B5001",
    name: "Buku Panduan Manasik Haji & Umroh",
    description: "Buku panduan lengkap dan praktis, dilengkapi doa-doa.",
    basePrice: 90000,
    category: "Buku & Panduan",
    imageUrl: "https://placehold.co/600x400/ffffff/111111?text=Buku+Manasik",
    stock: 120,
  },
  {
    id: "Z6001",
    name: "Paket Bundling Umroh Lengkap",
    description:
      "Paket lengkap: Kain Ihram, Sabuk, Botol Wudhu, dan Tasbih Digital.",
    basePrice: 550000,
    category: "Paket Bundling",
    imageUrl: "https://placehold.co/600x400/ffffff/111111?text=Paket+Bundling",
    stock: 50,
  },
];
