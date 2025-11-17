import { IProduk } from "../types/IProduk";

export const ProductsData: IProduk[] = [
    // Produk dengan VARIAN & DISKON (jenis = uang)
    {
        id: 1,
        nama_produk: "Bantal Leher Travel",
        deskripsi: "Bantal leher empuk untuk perjalanan",
        harga: 85000,
        stok: 25,
        kategori_id: 2,
        jenis_id: 1,
        gambar_utama: "/img/bantal.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 2,
            nama_kategori: "Aksesoris Ibadah",
            deskripsi: "Tasbih, sajadah, dll",
            gambar_icon: "/icons/aksesori.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembayaran dengan uang",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        varian: [
            {
                id: 1,
                produk_id: 1,
                warna: "Biru",
                ukuran: null,
                stok: 20,
                tambahan_harga: 10000,
                kode_varian: "#87CEEB",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
            {
                id: 2,
                produk_id: 1,
                warna: "Hitam",
                ukuran: null,
                stok: 5,
                tambahan_harga: 0,
                kode_varian: "#000000",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],

        diskon: [
            {
                id: 1,
                produk_id: 1,
                varian_id: 1,
                persentase: "50",
                harga_potongan: 50000,
                tanggal_mulai: "2025-10-25 00:00:00",
                tanggal_selesai: "2025-11-05 23:59:59",
                aktif: 1,
                created_at: "2025-10-29T13:46:55.000000Z",
            },
        ],

        koleksi: [
            {
                id: 1,
                nama_koleksi: "Pria",
                deskripsi: "Koleksi pria",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
                pivot: { produk_id: 1, koleksi_id: 1 },
            },
        ],
    },

    // Produk pembelian POIN (diskon otomatis null)
    {
        id: 2,
        nama_produk: "Tasbih Digital",
        deskripsi: "Tasbih digital penghitung otomatis",
        harga: 3,
        stok: 90,
        kategori_id: 2,
        jenis_id: 2,
        gambar_utama: "/img/tasbih-digital.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 2,
            nama_kategori: "Aksesoris Ibadah",
            deskripsi: "Perlengkapan ibadah",
            gambar_icon: "/icons/tasbih.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 2,
            nama_jenis: "poin",
            deskripsi: "Pembayaran menggunakan poin",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        varian: [
            {
            id: 1,
            produk_id: 3,
            warna: "Hitam",
            ukuran: null,
            stok: 90,
            tambahan_harga: 0,
            kode_varian: "#000000",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],

        diskon: null, // otomatis null karena jenis = poin

        koleksi: [
            {
                id: 4,
                nama_koleksi: "Lainnya",
                deskripsi: "Tidak masuk gender apapun",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
                pivot: { produk_id: 3, koleksi_id: 4 },
            },
        ],
    },

    // Produk tanpa VARIAN dan tanpa DISKON
    {
        id: 3,
        nama_produk: "Sabun Travel Halal",
        deskripsi: "Sabun cair halal ukuran kecil",
        harga: 45000,
        stok: 120,
        kategori_id: 3,
        jenis_id: 1,
        gambar_utama: "/img/sabun.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 3,
            nama_kategori: "Kesehatan & Kebersihan",
            deskripsi: "Peralatan kebersihan",
            gambar_icon: "/icons/clean.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembayaran dengan uang",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        varian: null,

        diskon: null,

        koleksi: [
            {
            id: 4,
            nama_koleksi: "Lainnya",
            deskripsi: "Tidak masuk kategori gender",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
            pivot: { produk_id: 2, koleksi_id: 4 },
            },
        ],
    },

    // Produk TANPA KOLEKSI → otomatis masuk "Lainnya"
    {
        id: 4,
        nama_produk: "Botol Minum Travel",
        deskripsi: "Botol minum lipat untuk perjalanan",
        harga: 65000,
        stok: 70,
        kategori_id: 3,
        jenis_id: 1,
        gambar_utama: "/img/botol.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 3,
            nama_kategori: "Kesehatan & Kebersihan",
            deskripsi: "Perlengkapan sanitasi",
            gambar_icon: "/icons/botol.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembayaran dengan uang",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        varian: [
            {
            id: 1,
            produk_id: 4,
            warna: "Biru",
            ukuran: null,
            stok: 70,
            tambahan_harga: 0,
            kode_varian: "#00AEEF",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],

        diskon: null,

        koleksi: [
            {
                id: 4,
                nama_koleksi: "Lainnya",
                deskripsi: "Tidak masuk gender apapun",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
                pivot: { produk_id: 4, koleksi_id: 4 },
            },
        ],
    },

    // Produk dengan banyak varian kombinasi warna + ukuran
    {
        id: 5,
        nama_produk: "Jaket Travel Premium",
        deskripsi: "Jaket ringan dan hangat untuk perjalanan jauh",
        harga: 150000,
        stok: 200,
        kategori_id: 1,
        jenis_id: 1,
        gambar_utama: "/img/jaket-travel.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 1,
            nama_kategori: "Pakaian & Ihram",
            deskripsi: "Semua pakaian kebutuhan ibadah",
            gambar_icon: "/icons/pakaian.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembayaran menggunakan uang",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        varian: [
            {
                id: 1,
                produk_id: 5,
                warna: "Biru",
                ukuran: "S",
                stok: 30,
                tambahan_harga: 0,
                kode_varian: "#0000FF",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
            {
                id: 2,
                produk_id: 5,
                warna: "Biru",
                ukuran: "M",
                stok: 40,
                tambahan_harga: 0,
                kode_varian: "#0000FF",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
            {
                id: 3,
                produk_id: 5,
                warna: "Biru",
                ukuran: "L",
                stok: 35,
                tambahan_harga: 5000,
                kode_varian: "#0000FF",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
            {
                id: 4,
                produk_id: 5,
                warna: "Biru",
                ukuran: "XL",
                stok: 20,
                tambahan_harga: 10000,
                kode_varian: "#0000FF",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },

            {
                id: 5,
                produk_id: 5,
                warna: "Merah",
                ukuran: "S",
                stok: 25,
                tambahan_harga: 0,
                kode_varian: "#FF0000",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
            {
                id: 6,
                produk_id: 5,
                warna: "Merah",
                ukuran: "M",
                stok: 30,
                tambahan_harga: 0,
                kode_varian: "#FF0000",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
            {
                id: 7,
                produk_id: 5,
                warna: "Merah",
                ukuran: "L",
                stok: 25,
                tambahan_harga: 5000,
                kode_varian: "#FF0000",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            }
        ],

        diskon: [
            {
                id: 1,
                produk_id: 5,
                varian_id: 3, // Biru ukuran L
                persentase: "20",
                harga_potongan: 30000,
                tanggal_mulai: "2025-11-01 00:00:00",
                tanggal_selesai: "2025-11-30 23:59:59",
                aktif: 1,
                created_at: "2025-11-01T10:00:00.000000Z",
            },
            {
                id: 2,
                produk_id: 5,
                varian_id: 7, // Merah ukuran L
                persentase: "15",
                harga_potongan: 22500,
                tanggal_mulai: "2025-11-05 00:00:00",
                tanggal_selesai: "2025-11-15 23:59:59",
                aktif: 1,
                created_at: "2025-11-05T10:00:00.000000Z",
            }
        ],

        koleksi: [
            {
                id: 3,
                nama_koleksi: "Unisex",
                deskripsi: "Untuk pria dan wanita",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
                pivot: { produk_id: 5, koleksi_id: 3 }
            }
        ]
    },
]