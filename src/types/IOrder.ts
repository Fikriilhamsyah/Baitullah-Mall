export type OrderStatus =
  | "1" // Menunggu Pilih Pembayaran
  | "2" // Menunggu Pembayaran
  | "3" // Menunggu Verifikasi Pembayaran
  | "4" // Order Sedang di Proses
  | "5" // Dalam Pengiriman
  | "6" // Selesai
  | "7"; // Return

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total: number;
  date: string;
}


export const DUMMY_ORDERS: Order[] = Array.from({ length: 42 }).map((_, i) => {
  const statuses: Order["status"][] = ["1", "2", "3", "4", "5", "6", "7"];

  return {
    id: i + 1,
    order_number: `INV-${1000 + i}`,
    status: statuses[i % statuses.length],
    total: 150000 + i * 10000,
    date: "2024-12-01",
  };
});