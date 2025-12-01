import { IProduct } from "../types/IProduct";

export const ProductsData: IProduct[] = [
    // Produk dengan VARIAN & DISKON (jenis = uang)
    {
        id: 1,
        nama_produk: "Bantal Leher Travel",
        deskripsi: "Bantal leher empuk yang dirancang khusus untuk memberikan kenyamanan maksimal selama perjalanan jauh. Terbuat dari bahan berkualitas tinggi yang lembut di kulit dan mampu menopang leher secara ergonomis. Cocok digunakan saat naik pesawat, bus, kereta, atau perjalanan kendaraan pribadi agar tidur lebih nyaman dan mengurangi pegal di area leher.",
        harga: 85000,
        stok: 25,
        kategori_id: 2,
        jenis_id: 1,
        koleksi_id: 1,
        gambar_utama: "/img/bantal.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 2,
            nama_kategori: "Aksesoris Ibadah",
            deskripsi: "Beragam aksesoris ibadah yang membantu jamaah merasa lebih nyaman dan praktis selama perjalanan dan pelaksanaan ibadah.",
            gambar_icon: "/icons/aksesori.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembayaran dilakukan menggunakan mata uang rupiah secara langsung.",
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
                berat: null,
                gambar: null,
                tambahan_harga: 10000,
                kode_warna: "#87CEEB",
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
                berat: null,
                gambar: null,
                tambahan_harga: 0,
                kode_warna: "#000000",
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
                deskripsi: "Pilihan produk yang cocok untuk kebutuhan perjalanan dan aktivitas laki-laki, baik santai maupun ibadah.",
                koleksi_count: 0,
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],
    },

    // Produk pembelian POIN (diskon otomatis null)
    {
        id: 2,
        nama_produk: "Tasbih Digital",
        deskripsi: "Tasbih digital praktis dengan tombol penghitung otomatis yang memudahkan pengguna dalam melakukan dzikir tanpa perlu menghitung secara manual. Didesain ringkas sehingga nyaman digenggam, serta memiliki tampilan layar jelas yang memudahkan penglihatan di berbagai kondisi pencahayaan. Sangat ideal digunakan selama ibadah, perjalanan, atau aktivitas harian.",
        harga: 3,
        stok: 90,
        kategori_id: 2,
        jenis_id: 2,
        koleksi_id: 4,
        gambar_utama: "/img/tasbih-digital.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 2,
            nama_kategori: "Aksesoris Ibadah",
            deskripsi: "Berbagai alat pendukung ibadah yang memudahkan dan memberi kenyamanan saat beribadah.",
            gambar_icon: "/icons/tasbih.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 2,
            nama_jenis: "poin",
            deskripsi: "Pembelian produk dilakukan menggunakan poin yang diperoleh dari sistem reward.",
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
                berat: null,
                gambar: null,
                tambahan_harga: 0,
                kode_warna: "#000000",
                kode_varian: "#000000",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],

        diskon: null,

        koleksi: [
            {
                id: 4,
                nama_koleksi: "Lainnya",
                deskripsi: "Kategori untuk produk yang dapat digunakan oleh siapa saja tanpa batasan gender atau peruntukan.",
                koleksi_count: 0,
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],
    },

    // Produk tanpa VARIAN dan tanpa DISKON
    {
        id: 3,
        nama_produk: "Sabun Travel Halal",
        deskripsi: "Sabun cair halal berukuran kecil yang sangat cocok dibawa saat bepergian. Formulanya lembut di kulit, aman untuk berbagai jenis kulit termasuk kulit sensitif. Dikemas dalam botol yang praktis dan tidak mudah bocor, membuatnya ideal untuk perjalanan ibadah, perjalanan bisnis, maupun aktivitas outdoor.",
        harga: 45000,
        stok: 120,
        kategori_id: 3,
        jenis_id: 1,
        koleksi_id: 4,
        gambar_utama: "/img/sabun.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 3,
            nama_kategori: "Kesehatan & Kebersihan",
            deskripsi: "Produk-produk kebersihan yang membantu menjaga kesehatan dan kenyamanan selama perjalanan.",
            gambar_icon: "/icons/clean.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembayaran menggunakan rupiah secara langsung.",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        varian: null,
        diskon: null,

        koleksi: [
            {
                id: 4,
                nama_koleksi: "Lainnya",
                deskripsi: "Kategori umum untuk berbagai produk yang tidak memiliki penyesuaian khusus.",
                koleksi_count: 0,
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],
    },

    // Produk TANPA KOLEKSI → otomatis masuk "Lainnya"
    {
        id: 4,
        nama_produk: "Botol Minum Travel",
        deskripsi: "Botol minum lipat yang praktis untuk dibawa kemana saja. Didesain dari bahan food-grade yang aman dan tidak meninggalkan bau. Bentuknya fleksibel namun tetap kuat, sangat cocok untuk perjalanan jauh, aktivitas luar ruangan, ataupun penggunaan sehari-hari. Membantu menjaga hidrasi tanpa harus membawa botol besar yang memakan tempat.",
        harga: 65000,
        stok: 70,
        kategori_id: 3,
        jenis_id: 1,
        koleksi_id: 4,
        gambar_utama: "/img/botol.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 3,
            nama_kategori: "Kesehatan & Kebersihan",
            deskripsi: "Kumpulan produk yang mendukung sanitasi dan kebersihan pribadi selama perjalanan.",
            gambar_icon: "/icons/botol.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembelian menggunakan mata uang rupiah.",
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
                berat: null,
                gambar: null,
                tambahan_harga: 0,
                kode_warna: "#00AEEF",
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
                deskripsi: "Kategori universal yang cocok untuk semua pengguna.",
                koleksi_count: 0,
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },
        ],
    },

    // Produk dengan banyak varian kombinasi warna + ukuran
    {
        id: 5,
        nama_produk: "Jaket Travel Premium",
        deskripsi: "Jaket travel premium yang dirancang untuk memberikan kenyamanan maksimal dalam berbagai kondisi perjalanan. Terbuat dari bahan ringan namun mampu memberikan kehangatan yang optimal pada cuaca dingin. Memiliki desain stylish, adem dipakai, dan tidak membuat gerah. Cocok digunakan untuk perjalanan umroh, trip luar negeri, pendakian ringan, hingga aktivitas harian.",
        harga: 150000,
        stok: 200,
        kategori_id: 1,
        jenis_id: 1,
        koleksi_id: 3,
        gambar_utama: "/img/jaket-travel.png",
        created_at: "2025-10-29T13:46:55.000000Z",
        updated_at: "2025-10-29T13:46:55.000000Z",

        kategori: {
            id: 1,
            nama_kategori: "Pakaian & Ihram",
            deskripsi: "Koleksi pakaian ibadah serta perlengkapan tekstil untuk kenyamanan selama perjalanan.",
            gambar_icon: "/icons/pakaian.png",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        jenis: {
            id: 1,
            nama_jenis: "uang",
            deskripsi: "Pembayaran dilakukan menggunakan mata uang rupiah.",
            created_at: "2025-10-29T13:46:55.000000Z",
            updated_at: "2025-10-29T13:46:55.000000Z",
        },

        varian: [
            // BIRU S,M,L,XL
            {
                id: 1,
                produk_id: 5,
                warna: "Biru",
                ukuran: "S",
                stok: 30,
                berat: null,
                gambar: null,
                tambahan_harga: 0,
                kode_warna: "#0000FF",
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
                berat: null,
                gambar: null,
                tambahan_harga: 0,
                kode_warna: "#0000FF",
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
                berat: null,
                gambar: null,
                tambahan_harga: 5000,
                kode_warna: "#0000FF",
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
                berat: null,
                gambar: null,
                tambahan_harga: 10000,
                kode_warna: "#0000FF",
                kode_varian: "#0000FF",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            },

            // MERAH S,M,L
            {
                id: 5,
                produk_id: 5,
                warna: "Merah",
                ukuran: "S",
                stok: 25,
                berat: null,
                gambar: null,
                tambahan_harga: 0,
                kode_warna: "#FF0000",
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
                berat: null,
                gambar: null,
                tambahan_harga: 0,
                kode_warna: "#FF0000",
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
                berat: null,
                gambar: null,
                tambahan_harga: 5000,
                kode_warna: "#FF0000",
                kode_varian: "#FF0000",
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            }
        ],

        diskon: [
            {
                id: 1,
                produk_id: 5,
                varian_id: 3,
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
                varian_id: 7,
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
                deskripsi: "Produk yang cocok digunakan baik oleh pria maupun wanita berkat desainnya yang universal dan nyaman.",
                koleksi_count: 0,
                created_at: "2025-10-29T13:46:55.000000Z",
                updated_at: "2025-10-29T13:46:55.000000Z",
            }
        ]
    },
];
