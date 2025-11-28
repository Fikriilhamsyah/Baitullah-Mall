export type IStatus = "active" | "non-active";

export interface ICategory {
    id: number;
    nama_kategori: string;
    deskripsi: string | null;
    gambar_icon: string | null;
    status: IStatus;
    created_at: string;
    updated_at: string;
    produk_count: number;
}