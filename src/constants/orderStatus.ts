import {
  ClipboardClock,
  BanknoteArrowUp,
  Package,
  Truck,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

import { OrderStatus } from "@/types/IOrder";

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; icon: any }
> = {
  "1": { label: "Menunggu Pilih Pembayaran", icon: ClipboardClock },
  "2": { label: "Menunggu Pembayaran", icon: BanknoteArrowUp },
  "3": { label: "Menunggu Verifikasi Pembayaran", icon: ClipboardClock },
  "4": { label: "Order Sedang Diproses", icon: Package },
  "5": { label: "Dalam Pengiriman", icon: Truck },
  "6": { label: "Selesai", icon: CheckCircle },
  "7": { label: "Return", icon: RotateCcw },
};
