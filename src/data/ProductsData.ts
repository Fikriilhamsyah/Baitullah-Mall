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
    paymentType: "rupiah",
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
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "P1002",
    name: "Mukena Premium Travel",
    description:
      "Mukena bahan parasut ringan dan mudah dilipat, ideal untuk perjalanan ibadah.",
    basePrice: 275000,
    category: "Pakaian & Ihram",
    imageUrl: "/img/product-list/mukena-travel.jpg",
    images: [
      "/img/product-detail/mukena-1.jpg",
      "/img/product-detail/mukena-2.jpg",
    ],
    stock: 120,
    rating: 4.8,
    paymentType: "rupiah",
    variants: [
      {
        id: "V_GENDER",
        name: "Gender",
        options: [{ id: "G_WANITA", value: "Wanita", priceModifier: 0 }],
      },
    ],
    createdAt: "2025-10-03T00:00:00Z",
  },
  {
    id: "P1003",
    name: "Tas Selempang Travel Anti Air",
    description:
      "Tas kecil anti air dengan banyak kompartemen, cocok untuk menyimpan paspor dan uang selama perjalanan.",
    basePrice: 180000,
    category: "Perlengkapan Travel",
    imageUrl: "/img/product-list/tas-travel.jpg",
    images: [
      "/img/product-detail/tas-1.jpg",
      "/img/product-detail/tas-2.jpg",
    ],
    stock: 200,
    rating: 4.4,
    paymentType: "rupiah",
    variants: [
      {
        id: "V_GENDER",
        name: "Gender",
        options: [{ id: "G_UNISEX", value: "Unisex", priceModifier: 0 }],
      },
    ],
    createdAt: "2025-10-05T00:00:00Z",
  },
  {
    id: "P1004",
    name: "Sabun Cair Travel Halal 100ml",
    description:
      "Sabun cair tanpa alkohol dengan ukuran travel-friendly, aman untuk dibawa ke pesawat.",
    basePrice: 45000,
    category: "Kesehatan & Kebersihan",
    imageUrl: "/img/product-list/sabun-travel.jpg",
    images: [
      "/img/product-detail/sabun-1.jpg",
      "/img/product-detail/sabun-2.jpg",
    ],
    stock: 500,
    rating: 4.9,
    paymentType: "rupiah",
    variants: [],
    createdAt: "2025-10-06T00:00:00Z",
  },
  {
    id: "P1005",
    name: "Buku Panduan Haji & Umroh Lengkap",
    description:
      "Panduan lengkap pelaksanaan ibadah haji dan umroh sesuai sunnah, mudah dipahami dan praktis.",
    basePrice: 85000,
    category: "Buku & Panduan",
    imageUrl: "/img/product-list/buku-panduan.jpg",
    images: [
      "/img/product-detail/buku-1.jpg",
      "/img/product-detail/buku-2.jpg",
    ],
    stock: 300,
    rating: 4.7,
    paymentType: "rupiah",
    variants: [],
    createdAt: "2025-10-07T00:00:00Z",
  },
  {
    id: "P1006",
    name: "Souvenir Tasbih Kayu Cendana",
    description:
      "Tasbih 33 butir dari kayu cendana pilihan, aroma lembut dan elegan, cocok untuk oleh-oleh jamaah.",
    basePrice: 65000,
    category: "Oleh-oleh & Souvenir",
    imageUrl: "/img/product-list/tasbih.jpg",
    images: [
      "/img/product-detail/tasbih-1.jpg",
      "/img/product-detail/tasbih-2.jpg",
    ],
    stock: 400,
    rating: 4.5,
    paymentType: "rupiah",
    variants: [
      {
        id: "V_GENDER",
        name: "Gender",
        options: [{ id: "G_UNISEX", value: "Unisex", priceModifier: 0 }],
      },
    ],
    createdAt: "2025-10-08T00:00:00Z",
  },
  {
    id: "P1007",
    name: "Paket Bundling Perlengkapan Umroh",
    description:
      "Paket lengkap perlengkapan umroh berisi kain ihram, sabun halal, dan tas travel kecil.",
    basePrice: 650000,
    category: "Paket Bundling",
    imageUrl: "/img/product-list/paket-bundling.jpg",
    images: [
      "/img/product-detail/paket-1.jpg",
      "/img/product-detail/paket-2.jpg",
    ],
    stock: 100,
    rating: 4.9,
    paymentType: "rupiah",
    variants: [],
    createdAt: "2025-10-09T00:00:00Z",
  },
  {
    id: "P1001_DUP",
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
    paymentType: "rupiah",
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
    createdAt: "2025-10-10T00:00:00Z",
  },
  {
    id: "P1002_DUP",
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
    paymentType: "rupiah",
    variants: [
      {
        id: "V_WARNA_G",
        name: "Warna",
        options: [
          { id: "W_PUTIH", name: "Putih", value: "Putih", priceModifier: 0 },
          { id: "W_HITAM", name: "Hitam", value: "Hitam", priceModifier: 0 },
          { id: "W_NAVY", name: "Navy", value: "Navy", priceModifier: 0 },
          { id: "W_MOCCA", name: "Mocca", value: "#D2B48C", priceModifier: 5000 },
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
    createdAt: "2025-10-11T00:00:00Z",
  },
  {
    id: "A2001",
    name: "Tasbih Digital LED",
    description:
      "Tasbih digital dengan layar LED dan penghitung otomatis. Cocok digunakan di tempat gelap.",
    basePrice: 3,
    category: "Aksesoris Ibadah",
    imageUrl: "/img/product-list/tas-kabin-2.jpg",
    images: [
      "/img/product-detail/tasbih-digital-1.jpg",
      "/img/product-detail/tasbih-digital-2.jpg",
    ],
    stock: 300,
    rating: 3.3,
    paymentType: "poin",
    variants: [
      {
        id: "V_WARNA_T",
        name: "Warna",
        options: [
          { id: "WT_HITAM", name: "Hitam", value: "Hitam", priceModifier: 0 },
          { id: "WT_PUTIH", name: "Putih", value: "Putih", priceModifier: 0 },
          { id: "WT_BIRU", name: "Biru", value: "Biru", priceModifier: 0 },
          { id: "WT_PINK", name: "Pink", value: "#FFC0CB", priceModifier: 5000 },
          { id: "WT_MERAH", name: "Merah", value: "#FF0000", priceModifier: 5000 },
          { id: "WT_NAVY", name: "Navy", value: "Navy", priceModifier: 5000 },
          { id: "WT_HIJAU", name: "Hijau", value: "#008000", priceModifier: 5000 },
        ],
      },
    ],
    createdAt: "2025-10-12T00:00:00Z",
  },
  {
    id: "P1008",
    name: "Baju Koko Premium Bordir Lengan Panjang",
    description:
      "Baju koko dengan bahan katun halus, bordir elegan, dan nyaman dipakai untuk ibadah atau acara resmi.",
    basePrice: 275000,
    category: "Pakaian & Ihram",
    imageUrl: "/img/product-list/baju-koko.jpg",
    images: [
      "/img/product-detail/baju-koko-1.jpg",
      "/img/product-detail/baju-koko-2.jpg",
    ],
    stock: 180,
    rating: 4.7,
    paymentType: "rupiah",
    variants: [
      {
        id: "V_WARNA_KOKO",
        name: "Warna",
        options: [
          { id: "WK_PUTIH", name: "Putih", value: "Putih", priceModifier: 0 },
          { id: "WK_COKLAT", name: "Coklat", value: "#8B4513", priceModifier: 10000 },
          { id: "WK_HITAM", name: "Hitam", value: "Hitam", priceModifier: 15000 },
        ],
      },
      {
        id: "V_UKURAN_KOKO",
        name: "Ukuran",
        options: [
          { id: "UK_M", value: "M", priceModifier: 0 },
          { id: "UK_L", value: "L", priceModifier: 0 },
          { id: "UK_XL", value: "XL", priceModifier: 20000 },
          { id: "UK_XXL", value: "XXL", priceModifier: 30000 },
        ],
      },
    ],
    createdAt: "2025-10-13T00:00:00Z",
  },
  {
    id: "P1009",
    name: "Jaket Travel Muslimah Waterproof",
    description:
      "Jaket ringan tahan air dengan desain panjang menutupi aurat, dilengkapi hoodie dan saku dalam.",
    basePrice: 375000,
    category: "Perlengkapan Travel",
    imageUrl: "/img/product-list/jaket-muslimah.jpg",
    images: [
      "/img/product-detail/jaket-muslimah-1.jpg",
      "/img/product-detail/jaket-muslimah-2.jpg",
    ],
    stock: 95,
    rating: 4.9,
    paymentType: "rupiah",
    variants: [
      {
        id: "V_WARNA_JK",
        name: "Warna",
        options: [
          { id: "W_NAVY", name: "Navy", value: "Navy", priceModifier: 0 },
          { id: "W_ARMY", name: "Army", value: "#4B5320", priceModifier: 5000 },
          { id: "W_MAROON", name: "Maroon", value: "#800000", priceModifier: 5000 },
        ],
      },
      {
        id: "V_UKURAN_JK",
        name: "Ukuran",
        options: [
          { id: "UK_S", value: "S", priceModifier: 0 },
          { id: "UK_M", value: "M", priceModifier: 0 },
          { id: "UK_L", value: "L", priceModifier: 15000 },
          { id: "UK_XL", value: "XL", priceModifier: 25000 },
        ],
      },
    ],
    createdAt: "2025-10-14T00:00:00Z",
  },
  {
    id: "P1010",
    name: "Jaket Travel Muslim Unisex Premium",
    description:
      "Jaket ringan berbahan water-repellent, cocok untuk perjalanan Haji, Umroh, dan wisata halal. Didesain nyaman untuk pria maupun wanita.",
    basePrice: 550000,
    category: "Pakaian & Ihram",
    imageUrl: "/img/product-list/jaket-travel.jpg",
    images: [
      "/img/product-detail/jaket-travel-1.jpg",
      "/img/product-detail/jaket-travel-2.jpg",
      "/img/product-detail/jaket-travel-3.jpg",
    ],
    stock: 180,
    rating: 4.9,
    paymentType: "rupiah",
    variants: [
      {
        id: "V_WARNA_J",
        name: "Warna",
        options: [
          { id: "W_HITAM", name: "Hitam", value: "Hitam", priceModifier: 0 },
          { id: "W_ABU", name: "Abu-abu", value: "Abu-abu", priceModifier: 0 },
          { id: "W_NAVY", name: "Navy", value: "Navy", priceModifier: 0 },
          { id: "W_OLIVE", name: "Hijau Olive", value: "#808000", priceModifier: 20000 },
        ],
      },
      {
        id: "V_UKURAN_J",
        name: "Ukuran",
        options: [
          { id: "UK_S", value: "S", priceModifier: 0 },
          { id: "UK_M", value: "M", priceModifier: 0 },
          { id: "UK_L", value: "L", priceModifier: 20000 },
          { id: "UK_XL", value: "XL", priceModifier: 30000 },
        ],
      },
      {
        id: "V_GENDER_J",
        name: "Gender",
        options: [{ id: "G_PRIA", value: "Pria", priceModifier: 0 }],
      },
    ],
    createdAt: "2025-10-13T00:00:00Z",
  },
];
