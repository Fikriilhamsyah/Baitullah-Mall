"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";

import { useOrderByCode } from "@/hooks/useOrderByCode";
import { ORDER_STATUS_MAP } from "@/constants/orderStatus";
import { OrderItem } from "@/types/IOrder";

const OrderDetailPage = () => {
  const { kode_order } = useParams<{ kode_order: string }>();
  const router = useRouter();

  const {
    order,
    loading,
    error,
  } = useOrderByCode(kode_order);

  console.table(order)

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <div className="pt-[80px] md:pt-[89px] lg:pt-[161px] text-center text-sm text-neutral-500">
        Memuat detail pesanan...
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */
  if (error || !order) {
    return (
      <div className="pt-[80px] md:pt-[89px] lg:pt-[161px] container mx-auto px-4">
        <p className="text-sm text-gray-500">
          {error ?? "Pesanan tidak ditemukan"}
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

  /* ---------------- SUCCESS ---------------- */
  return (
    <div className="pt-[80px] md:pt-[100px] lg:pt-[160px]">
      <div className="container mx-auto px-4 md:px-6 space-y-4">

        {/* Back */}
        <Link
          href="/profile/orders"
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali ke Pesanan
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-neutral-500">Order</p>
          <h1 className="text-lg font-semibold">
            {order.kode_order}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full bg-neutral-100">
              {ORDER_STATUS_MAP[order.status].label}
            </span>
            <span className="text-xs text-neutral-400">
              {new Date(order.created_at).toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="text-sm font-semibold">Produk</h3>

          {order.details.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 items-center"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_PATH}/storage/${item.gambar}`}
                alt={item.kode_varian}
                className="w-16 h-16 rounded-lg object-cover border"
              />

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.kode_varian}
                </p>
                <p className="text-xs text-neutral-500">
                  Qty: {item.jumlah}
                </p>
              </div>

              <p className="text-sm font-semibold">
                Rp {item.subtotal.toLocaleString("id-ID")}
              </p>
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
            <span>{order.metode_pembayaran}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Ongkir</span>
            <span>
              Rp {order.ongkir.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary-500">
              Rp {order.final_harga.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Payment Action */}
        {order.payment_status === "PENDING" && order.xendit_payment_url && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <button
              onClick={() => {
                router.push(`/checkout/payment?order=${order.kode_order}`)
              }}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-lg transition"
            >
              Lanjutkan Pembayaran
            </button>
          </div>
        )}

        {/* Info */}
        <div className="flex items-center gap-3 rounded-lg bg-neutral-50 border p-4">
          <Info className="h-5 w-5 text-primary-500" />
          <p className="text-sm text-neutral-600">
            Detail pesanan diambil langsung dari sistem dan akan
            diperbarui otomatis jika status berubah.
          </p>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailPage;
