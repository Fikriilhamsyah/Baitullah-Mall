export type OrderStatus =
  | "pending"   // Menunggu pembayaran
  | "paid"      // Sudah dibayar / diproses
  | "shipping"  // Dalam pengiriman
  | "done"      // Selesai
  | "cancel";   // Dibatalkan

export interface OrderItem {
  id: number;
  order_id: number;
  kode_order: string;
  kode_varian: string;
  jumlah: number;
  harga: number;     // dari string → number
  subtotal: number;  // dari string → number
  created_at: string;
  updated_at: string;
  gambar: string;
}


export interface Order {
  id: number;
  kode_order: string;
  user_id: number;

  total_harga: number;
  ongkir: number;
  final_harga: number;

  status: OrderStatus;

  alamat: string;

  created_at: string;
  updated_at: string;

  // Xendit
  xendit_external_id?: string | null;
  xendit_payment_url?: string | null;
  xendit_invoice_id?: string | null;
  payment_status?: OrderStatus;

  details: OrderItem[];
}
