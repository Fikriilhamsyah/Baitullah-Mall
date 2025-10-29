import { IProduct } from "../types/IProduct";

export const dummyProducts: IProduct[] = [
  {
    id: "P1001",
    name: "Kain Ihram Pria Premium",
    description:
      "Kain ihram tanpa jahitan dengan bahan katun premium yang lembut dan mudah menyerap keringat.",
    basePrice: 350000,
    category: "Pakaian & Ihram",
    imageUrl: "/img/product-list/kain-ihram-1.jpg",
    images: [
      "/img/product-detail/kain-ihram-1.jpg",
      "/img/product-detail/kain-ihram-2.jpg",
      "/img/product-detail/kain-ihram-3.jpg",
    ],
    stock: 150,
    rating: 4.6,
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
    name: "Gamis Wanita Syar'i Premium",
    description:
      "Gamis longgar, nyaman, dan adem, cocok untuk ibadah dan aktivitas harian.",
    basePrice: 450000,
    category: "Pakaian & Ihram",
    imageUrl: "/img/product-list/bantal-leher-2.jpg",
    images: [
      "/img/product-detail/gamis-wanita-1.jpg",
      "/img/product-detail/gamis-wanita-2.jpg",
    ],
    stock: 80,
    rating: 4.8,
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
      {
        id: "V_GENDER_G",
        name: "Gender",
        options: [{ id: "G_WANITA", value: "Wanita", priceModifier: 0 }],
      },
    ],
  },
  {
    id: "A2001",
    name: "Tasbih Digital LED",
    description:
      "Tasbih digital dengan layar LED dan penghitung otomatis. Cocok digunakan di tempat gelap.",
    basePrice: 75000,
    category: "Aksesoris Ibadah",
    imageUrl: "/img/product-list/tas-kabin-2.jpg",
    images: [
      "/img/product-detail/tasbih-digital-1.jpg",
      "/img/product-detail/tasbih-digital-2.jpg",
    ],
    stock: 300,
    rating: 4.3,
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
    name: "Botol Semprot Wudhu Portable",
    description:
      "Botol spray praktis untuk berwudhu di perjalanan, desain ergonomis dan mudah dibawa.",
    basePrice: 35000,
    category: "Perlengkapan Travel",
    imageUrl: "/img/product-list/koper-1.jpg",
    images: [
      "/img/product-detail/botol-wudhu-1.jpg",
      "/img/product-detail/botol-wudhu-2.jpg",
    ],
    stock: 500,
    rating: 4.5,
  },
  {
    id: "K4001",
    name: "Sabun & Shampoo Non-Parfum Ihram",
    description:
      "Paket sabun dan shampoo halal tanpa parfum, aman digunakan saat ihram.",
    basePrice: 120000,
    category: "Kesehatan & Kebersihan",
    imageUrl: "/img/product-list/koper-2.jpg",
    images: [
      "/img/product-detail/sabun-ihram-1.jpg",
      "/img/product-detail/sabun-ihram-2.jpg",
    ],
    stock: 200,
    rating: 4.7,
  },
  {
    id: "B5001",
    name: "Buku Panduan Manasik Haji & Umroh",
    description:
      "Panduan lengkap ibadah haji dan umroh, disertai doa-doa dan panduan praktik.",
    basePrice: 90000,
    category: "Buku & Panduan",
    imageUrl: "/img/product-list/sabuk-ihram-1.jpg",
    images: [
      "/img/product-detail/buku-manasik-1.jpg",
      "/img/product-detail/buku-manasik-2.jpg",
    ],
    stock: 120,
    rating: 4.9,
  },
  {
    id: "Z6001",
    name: "Paket Bundling Umroh Lengkap",
    description:
      "Paket lengkap berisi Kain Ihram, Sabuk, Botol Wudhu, dan Tasbih Digital.",
    basePrice: 550000,
    category: "Paket Bundling",
    imageUrl: "/img/product-list/syal-1.jpg",
    images: [
      "/img/product-detail/paket-bundling-1.jpg",
      "/img/product-detail/paket-bundling-2.jpg",
    ],
    stock: 50,
    rating: 4.4,
  },
  {
    id: "T3002",
    name: "Bantal Leher Travel Memory Foam",
    description:
      "Bantal leher empuk dengan memory foam, ideal untuk perjalanan jauh.",
    basePrice: 99000,
    category: "Perlengkapan Travel",
    imageUrl: "/img/product-list/bantal-leher-1.jpg",
    images: [
      "/img/product-detail/bantal-leher-1.jpg",
      "/img/product-detail/bantal-leher-2.jpg",
      "/img/product-detail/bantal-leher-3.jpg",
    ],
    stock: 320,
    rating: 4.3,
    variants: [
      {
        id: "V_WARNA_B",
        name: "Warna",
        options: [
          { id: "WB_ABU", value: "Abu-abu", priceModifier: 0 },
          { id: "WB_NAVY", value: "Navy", priceModifier: 0 },
          { id: "WB_MAROON", value: "Maroon", priceModifier: 0 },
        ],
      },
    ],
  },
];
