export interface Order {
  id: number;
  order_number: string;
  status: "pending" | "success" | "paid" | "expired" | "cancelled";
  total: number;
  date: string;
}

export const DUMMY_ORDERS: Order[] = Array.from({ length: 42 }).map((_, i) => {
  const statuses: Order["status"][] = [
    "pending",
    "success",
    "paid",
    "expired",
    "cancelled",
  ];

  return {
    id: i + 1,
    order_number: `INV-${1000 + i}`,
    status: statuses[i % statuses.length],
    total: 150000 + i * 10000,
    date: "2024-12-01",
  };
});