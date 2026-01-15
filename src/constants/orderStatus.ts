import {
  ClipboardCheck,
  Wallet,
  Package,
  Truck,
  CheckCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { OrderStatus } from "@/types/IOrder";

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  { label: string; icon: any }
> = {
  pending: {
    label: "Menunggu Pembayaran",
    icon: Wallet,
  },
  paid: {
    label: "Pembayaran Diterima",
    icon: ClipboardCheck,
  },
  shipping: {
    label: "Dalam Pengiriman",
    icon: Truck,
  },
  done: {
    label: "Selesai",
    icon: CheckCircle,
  },
  cancel: {
    label: "Dibatalkan",
    icon: XCircle,
  },
};
