export type OrderStatus =
  | "1" // Menunggu Pilih Pembayaran
  | "2" // Menunggu Pembayaran
  | "3" // Menunggu Verifikasi Pembayaran
  | "4" // Order Sedang di Proses
  | "5" // Dalam Pengiriman
  | "6" // Selesai
  | "7"; // Return

export interface OrderItemSummary {
  name: string;
  qty: number;
  thumbnail: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total: number;
  date: string;

  /** tambahan */
  payment_method: "VA" | "E-Wallet" | "Transfer" | "Poin";
  items: OrderItemSummary[];
}


export const DUMMY_ORDERS: Order[] = Array.from({ length: 42 }).map((_, i) => {
  const statuses: OrderStatus[] = ["1", "2", "3", "4", "5", "6", "7"];
  const status = statuses[i % statuses.length];

  return {
    id: i + 1,
    order_number: `INV-${20240000 + i}`,
    status,
    date: `2024-12-${String((i % 28) + 1).padStart(2, "0")}`,
    total: 350000 + i * 25000,

    payment_method:
      status === "1"
        ? "VA"
        : status === "2"
        ? "E-Wallet"
        : status === "3"
        ? "Transfer"
        : status === "6"
        ? "Poin"
        : "VA",

    items: [
      {
        name: "Paket Umrah Reguler",
        qty: 1,
        thumbnail: "/images/dummy/umrah.jpg",
      },
      ...(i % 3 === 0
        ? [
            {
              name: "Koper Kabin",
              qty: 1,
              thumbnail: "/images/dummy/koper.jpg",
            },
          ]
        : []),
    ],
  };
});
