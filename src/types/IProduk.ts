// 1. Jenis Pembayaran
export type TPaymentType = "uang" | "poin";

export interface IJenis {
  id: number;
  nama_jenis: TPaymentType;
  deskripsi: string;
  created_at: string;
  updated_at: string;
}

// 2. Kategori Produk
export interface IKategori {
  id: number;
  nama_kategori: string;
  deskripsi: string;
  gambar_icon: string;
  created_at: string;
  updated_at: string;
}

// 3. Varian Produk
// - Jika produk tidak punya varian → tetap 1 object, semua field null
export interface IVarian {
  id: number | null;
  produk_id: number | null;
  warna: string | null;
  ukuran: string | null;
  stok: number | null;
  tambahan_harga: number | null;
  kode_varian: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// 4. Diskon Produk
// - Jika tidak ada → diskon: null
// - Jika jenis="poin", diskon: null juga
export interface IDiskon {
  id: number;
  produk_id: number;
  varian_id: number | null;
  persentase: string;
  harga_potongan: number;
  tanggal_mulai: string;
  tanggal_selesai: string;
  aktif: number;
  created_at: string;
}

// 5. Koleksi Produk / Gender
export type TKoleksiNama = "Pria" | "Wanita" | "Unisex" | "Lainnya";

export interface IKoleksi {
  id: number;
  nama_koleksi: TKoleksiNama;
  deskripsi: string;
  created_at: string;
  updated_at: string;
  pivot: {
    produk_id: number;
    koleksi_id: number;
  };
}

// 6. PRODUK FINAL
export interface IProduk {
  id: number;
  nama_produk: string;
  deskripsi: string;
  harga: number;
  stok: number;
  kategori_id: number;
  jenis_id: number;
  gambar_utama: string;
  created_at: string;
  updated_at: string;

  kategori: IKategori;
  jenis: IJenis;

  varian: IVarian[] | null; // null jika tidak ada
  diskon: IDiskon[] | null; // null jika tidak ada
  koleksi: IKoleksi[]; // minimal 1 (default: Lainnya)
}
