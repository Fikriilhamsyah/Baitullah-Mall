"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { DUMMY_ORDERS } from "@/types/IOrder";
import { ORDER_STATUS_MAP } from "@/constants/orderStatus";

const OrderDetailPage = () => {
  const { order_number } = useParams();
  const router = useRouter();

  const order = DUMMY_ORDERS.find(
    (o) => o.order_number === order_number
  );

  if (!order) {
    return (
      <div className="pt-[100px] container mx-auto px-4">
        <p className="text-sm text-gray-500">
          Pesanan tidak ditemukan.
        </p>
        <button
          onClick={() => router.back()}
          className="text-primary-500 text-sm mt-2"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 space-y-4">

        {/* Back */}
        <Link
          href="/profile?tab=orders"
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali ke Pesanan
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Order</p>
          <h1 className="text-lg font-semibold">
            {order.order_number}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-100">
              {ORDER_STATUS_MAP[order.status].label}
            </span>
            <span className="text-xs text-neutral-400">
              {order.date}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold">Produk</h3>

          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex gap-4 items-center"
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover border"
              />

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-500">
                  Qty: {item.qty}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
          <h3 className="text-sm font-semibold">
            Informasi Pembayaran
          </h3>

          <div className="flex justify-between text-sm">
            <span>Metode</span>
            <span>{order.payment_method}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary-500">
              Rp {order.total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Action */}
        {order.status === "2" && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <button
              onClick={() => {
                // arahkan ke halaman pembayaran / gateway
                router.push(`/payment/${order.order_number}`);
              }}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-lg transition"
            >
              Lanjutkan Pembayaran
            </button>

            <p className="mt-2 text-xs text-neutral-500 text-center">
              Selesaikan pembayaran agar pesanan dapat diproses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;
