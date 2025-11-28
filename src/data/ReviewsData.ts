import { IProductReview } from "@/types/IProductReview";
import { ProductsData } from "@/data/ProductsData";

export const ReviewsData: IProductReview[] = [
  {
    id: 1,
    product: ProductsData[4], // Jaket Travel Premium
    user_name: "Ahmad Fauzi",
    user_avatar: "/avatars/user1.png",

    rating: 5,
    review_text:
      "Kualitas jaketnya bagus banget! Bahannya adem, nyaman dipakai, dan ukurannya pas. Dipakai buat perjalanan umroh kemarin juga enak banget.",

    warna: "Biru",
    ukuran: "L",

    media: {
      images: ["/review-img/jaket1.jpg", "/review-img/jaket2.jpg"],
      videos: ["/review-video/jaket-video.mp4"],
    },

    created_at: "2025-11-10T14:20:00",

    admin_reply: null,
  },

  {
    id: 2,
    product: ProductsData[0], // Bantal Leher Travel
    user_name: "Siti Lestari",
    user_avatar: null,

    rating: 4,
    review_text:
      "Bantalnya empuk dan nyaman, tapi pengiriman agak lama. Warna birunya cakep banget.",

    warna: "Biru",
    ukuran: null,

    media: {
      images: [],
      videos: ["/review-video/bantal-video.mp4"],
    },

    created_at: "2025-11-08T09:50:00",

    admin_reply: {
      admin_id: 1,
      admin_name: "Admin Baitullah",
      reply_text: "Terima kasih banyak kak Siti atas kepercayaannya! 🙏",
      created_at: "2025-11-21",
    },
  },

  {
    id: 3,
    product: ProductsData[1], // Sarung Tangan Ihram
    user_name: "Rizky Pratama",
    user_avatar: "/avatars/user2.png",

    rating: 5,
    review_text:
      "Sangat membantu saat musim dingin di Madinah. Bahannya halus dan tebal, mantap!",

    warna: "Putih",
    ukuran: "M",

    media: {
      images: ["/review-img/sarungtangan1.jpg"],
      videos: [],
    },

    created_at: "2025-11-05T18:10:00",

    admin_reply: null,
  },

  {
    id: 4,
    product: ProductsData[2], // Tas Selempang Travel
    user_name: "Fadhilah Rahma",
    user_avatar: "/avatars/user3.png",

    rating: 5,
    review_text:
      "Tasnnya kuat, muat banyak, dan cocok untuk membawa paspor, HP, serta barang kecil lainnya.",

    warna: "Hitam",
    ukuran: null,

    media: {
      images: ["/review-img/tas1.jpg"],
      videos: [],
    },

    created_at: "2025-11-02T11:35:00",

    admin_reply: {
      admin_id: 1,
      admin_name: "Admin Baitullah",
      reply_text:
        "Alhamdulillah kak Fadhilah cocok 🙏 Semoga tasnya bermanfaat selama ibadah.",
      created_at: "2025-11-22",
    },
  },

  {
    id: 5,
    product: ProductsData[3], // Masker Travel
    user_name: "Dewi Anggraini",
    user_avatar: null,

    rating: 4,
    review_text:
      "Maskernya lembut dan tidak membuat sesak. Enak dipakai saat perjalanan panjang.",

    warna: "Abu-Abu",
    ukuran: null,

    media: {
      images: [],
      videos: [],
    },

    created_at: "2025-10-30T08:00:00",

    admin_reply: null,
  },

  {
    id: 6,
    product: ProductsData[6], // Paket Bundling Travel
    user_name: "Bahrun Syah",
    user_avatar: "/avatars/user4.png",

    rating: 5,
    review_text:
      "Paket bundlingnya lengkap! Semua kebutuhan untuk perjalanan umroh sudah termasuk. Worth it banget!",

    warna: null,
    ukuran: null,

    media: {
      images: ["/review-img/paket1.jpg", "/review-img/paket2.jpg"],
      videos: [],
    },

    created_at: "2025-10-25T14:10:00",

    admin_reply: {
      admin_id: 1,
      admin_name: "Admin Baitullah",
      reply_text: "Terima kasih kak! Semoga perjalanan ibadahnya lancar dan berkah 🙏",
      created_at: "2025-11-23",
    },
  },

  {
    id: 7,
    product: ProductsData[1], // Sarung Tangan Ihram
    user_name: "Fitri Handayani",
    user_avatar: "/avatars/user5.png",

    rating: 3,
    review_text:
      "Bahannya bagus, tapi ukuran agak kecil buat saya. Next time mungkin pesan ukuran lebih besar.",

    warna: "Putih",
    ukuran: "S",

    media: {
      images: [],
      videos: [],
    },

    created_at: "2025-10-20T09:20:00",

    admin_reply: null,
  },

  {
    id: 8,
    product: ProductsData[4], // Jaket Travel Premium
    user_name: "Yusuf Hamzah",
    user_avatar: "/avatars/user6.png",

    rating: 5,
    review_text:
      "Dipakai saat musim dingin Mekkah, sangat hangat tapi tidak bikin gerah. Recommended!",

    warna: "Hitam",
    ukuran: "XL",

    media: {
      images: ["/review-img/jaket3.jpg"],
      videos: ["/review-video/jaket3-video.mp4"],
    },

    created_at: "2025-10-15T13:45:00",

    admin_reply: {
      admin_id: 1,
      admin_name: "Admin Baitullah",
      reply_text:
        "MasyaAllah terima kasih kak Yusuf 🙏 Semoga jaketnya bermanfaat selama ibadah.",
      created_at: "2025-11-25",
    },
  },

  {
    id: 9,
    product: ProductsData[2], // Tas Selempang Travel
    user_name: "Nadila Putri",
    user_avatar: "/avatars/user7.png",

    rating: 4,
    review_text:
      "Modelnya simpel tapi elegan. Jahitannya rapi dan kualitasnya bagus.",

    warna: "Coklat",
    ukuran: null,

    media: {
      images: ["/review-img/tas2.jpg"],
      videos: [],
    },

    created_at: "2025-10-10T15:20:00",

    admin_reply: null,
  },

  {
    id: 10,
    product: ProductsData[0], // Bantal Leher Travel
    user_name: "Dimas Arif",
    user_avatar: "/avatars/user8.png",

    rating: 5,
    review_text:
      "Bantal travel terbaik yang pernah saya beli. Nyaman, empuk, dan sangat membantu tidur di pesawat.",

    warna: "Hitam",
    ukuran: null,

    media: {
      images: [],
      videos: [],
    },

    created_at: "2025-10-05T17:00:00",

    admin_reply: {
      admin_id: 1,
      admin_name: "Admin Baitullah",
      reply_text: "Terima kasih kak Dimas 🙏 Senang mendengar bantalnya cocok!",
      created_at: "2025-11-26",
    },
  },
];
