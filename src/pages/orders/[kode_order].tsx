import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Icons
import { ChevronLeft, Info, Star } from "lucide-react";

// Hooks
import { useOrderByCode } from "@/hooks/useOrderByCode";

// Constants
import { ORDER_STATUS_MAP } from "@/constants/orderStatus";

// Utils
import { decryptOrderCode, encryptOrderCode } from "@/utils/crypto";

// Component
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Types
import { IReview } from "@/types/IReview";

const OrderDetailPage = () => {
  const router = useRouter();
  const { query: routerQuery, isReady } = router;

  const getParam = (key: string): string | null => {
    if (!isReady) return null;
    const value = routerQuery[key];
    if (!value) return null;
    return Array.isArray(value) ? value[0] : String(value);
  };

  const [redirecting, setRedirecting] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  const encryptedOrder = getParam("kode_order");

  const decryptedOrderCode = encryptedOrder
    ? decryptOrderCode(encryptedOrder)
    : undefined;

  useEffect(() => {
    if (!decryptedOrderCode) {
      router.replace("/profile/orders");
    }
  }, [decryptedOrderCode, router]);

  const { order, loading, error } =
    useOrderByCode(decryptedOrderCode);

  if (loading || redirecting) {
    return <LoadingSpinner />;
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

  /* ================= REVIEW FLAG ================= */
  const reviewData: IReview | null = order.review_data ?? null;
  const hasReview = Boolean(reviewData);

  const handlePrintReceipt = () => {
    if (!receiptRef.current) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Pesanan ${order.kode_order}</title>
          <style>
            body {
              font-family: monospace;
              background: #fff;
              padding: 0;
              margin: 0;
            }
            .receipt {
              width: 320px;
              margin: 0 auto;
              padding: 16px;
              color: #000;
            }
            .center {
              text-align: center;
            }
            .bold {
              font-weight: bold;
            }
            .divider {
              border-top: 1px dashed #000;
              margin: 12px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }
            td {
              padding: 4px 0;
              vertical-align: top;
            }
            .right {
              text-align: right;
            }
            .total {
              font-weight: bold;
              font-size: 14px;
            }
            .footer {
              margin-top: 16px;
              font-size: 12px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${receiptRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="pt-[80px] md:pt-[100px] lg:pt-[160px]">
      <div className="container mx-auto px-4 md:px-6 space-y-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-neutral-600 hover:text-neutral-800"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Kembali ke Pesanan
        </button>

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
                src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${item.gambar}`}
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

        {/* ================= RECEIPT ACTION ================= */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <button
            onClick={handlePrintReceipt}
            className="w-full border border-neutral-300 hover:bg-neutral-50 text-sm font-semibold py-3 rounded-lg transition"
          >
            Download / Cetak Struk
          </button>
        </div>

        {/* ================= REVIEW DISPLAY ================= */}
        {hasReview && reviewData && (
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold">
              Ulasan Kamu
            </h3>

            {/* Rating */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    reviewData.rating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* Review Text */}
            <p className="text-sm text-neutral-700">
              {reviewData.review}
            </p>

            {/* Photos */}
            {reviewData.photos?.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {reviewData.photos.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden border"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_PATH}/storage/${img}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Video */}
            {reviewData.video && (
              <div className="relative aspect-video rounded-lg overflow-hidden border bg-black">
                <video
                  src={`${process.env.NEXT_PUBLIC_PATH}/storage/${reviewData.video}`}
                  controls
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* ================= REVIEW ACTION ================= */}
        {order.status === "done" && !hasReview && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Link
              href={`/orders/${encryptOrderCode(order.kode_order)}/review`}
              className="block w-full text-center bg-[#299A4D] hover:bg-[#238B42] text-white text-sm font-semibold py-3 rounded-lg transition"
            >
              Beri Ulasan
            </Link>
          </div>
        )}

        {/* Payment Action */}
        {order.status === "pending" && order.xendit_payment_url && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <button
              onClick={() => {
                const paymentUrl = order.xendit_payment_url;
                if (!paymentUrl) return;

                setRedirecting(true);
                window.location.href = paymentUrl;
              }}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold py-3 rounded-lg transition"
            >
              Mengalihkan ke pembayaran...
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

        {/* ================= RECEIPT CONTENT (PRINT ONLY) ================= */}
        <div className="hidden">
          <div ref={receiptRef}>
            <div className="receipt">
              <div className="center bold">
                BAITULLAH MALL
              </div>
              <div className="center">
                Struk Pembelian
              </div>

              <div className="divider" />

              <table>
                <tbody>
                  <tr>
                    <td>Kode Order</td>
                    <td className="right">{order.kode_order}</td>
                  </tr>
                  <tr>
                    <td>Tanggal</td>
                    <td className="right">
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td className="right">
                      {ORDER_STATUS_MAP[order.status].label}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="divider" />

              <table>
                <tbody>
                  {order.details.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.kode_varian}
                        <br />
                        <small>Qty: {item.jumlah}</small>
                      </td>
                      <td className="right">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="divider" />

              <table>
                <tbody>
                  <tr>
                    <td>Ongkir</td>
                    <td className="right">
                      Rp {order.ongkir.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr className="total">
                    <td>Total</td>
                    <td className="right">
                      Rp {order.final_harga.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="divider" />

              <div className="footer">
                Terima kasih atas pesanan Anda 🙏  
                <br />
                Semoga berkah
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
