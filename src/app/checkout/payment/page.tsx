"use client";
import React, { useEffect, useState, } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// UI
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import RadioGroup from "@/components/ui/RadioGroup";
import { useToast } from "@/components/ui/Toast";

// Utils
import { formatPrice } from "@/utils/formatters";
import { formatDecimal } from "@/utils/formatDecimal";

// Hooks
import { usePayment } from "@/hooks/usePayment";
import { useAuth } from "@/context/AuthContext";
import { useCheckoutFlow } from "@/hooks/useCheckoutFlow";

// Types
import { IPayment } from "@/types/IPayment";

interface CheckoutItem {
  cart_id: number;
  nama_produk: string;
  warna?: string | null;
  ukuran?: string | null;
  qty: number;
  unit_price: number;
  subtotal: number;
  gambar?: string | null;
  jenis?: string;
}

interface CheckoutPayload {
  kode_order: string;
  items: CheckoutItem[];
  alamat: string;
  ongkir: number;
  subtotal: number;
  total: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { postPayment, loading } = usePayment();
  const user = useAuth((s) => s.user);

  const [hydrated, setHydrated] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] =
    useState<"VA" | "Direct Transfer">("VA");

  const [payload, setPayloadState] = useState<CheckoutPayload | null>(null);
  const setPayload = useCheckoutFlow((s) => s.setPayload);
  const clear = useCheckoutFlow((s) => s.clear);

  const [paying, setPaying] = useState(false);

  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");

  const checkoutFlowPayload = useCheckoutFlow((s) => s.payload);

  const paymentLockRef = React.useRef(false);

  // 🔹 Load payload dari zustand / sessionStorage
  useEffect(() => {
    if (checkoutFlowPayload?.kode_order) {
      if (orderCode && checkoutFlowPayload.kode_order !== orderCode) {
        showToast("Data checkout tidak sesuai", "error");
        router.replace("/checkout");
        return;
      }

      setPayloadState(checkoutFlowPayload);
      setPageLoading(false);
      return;
    }

    // 2️⃣ FALLBACK: sessionStorage (refresh / reload)
    const raw = sessionStorage.getItem("checkout_payload");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);

        if (!parsed?.kode_order) throw new Error("Invalid payload");

        if (orderCode && parsed.kode_order !== orderCode) {
          showToast("Data checkout tidak sesuai", "error");
          router.replace("/checkout");
          return;
        }

        // sinkronkan kembali ke zustand
        setPayload(parsed);
        setPayloadState(parsed);
        setPageLoading(false);
        return;
      } catch {
        // lanjut ke redirect
      }
    }

    // 3️⃣ GAGAL TOTAL → redirect aman
    const timer = setTimeout(() => {
      showToast("Data checkout tidak ditemukan", "error");
      router.replace("/checkout");
    }, 500);

    return () => clearTimeout(timer);
  }, [checkoutFlowPayload, orderCode]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (pageLoading) return <LoadingSpinner />;
  if (!payload) return null;

  const isAllPoin =
  payload.items.every(
    (it: CheckoutItem) =>
      String(it.jenis ?? "").toLowerCase() === "poin"
  );

  // ===============================
  // 🔥 PAYMENT HANDLER (FIXED)
  // ===============================
  const handlePayment = async () => {
    if (paymentLockRef.current) return;
    paymentLockRef.current = true;

    if (!user) {
      showToast("Harap login", "error");
      return;
    }

    if (!payload?.kode_order) {
      showToast("Kode order tidak valid", "error");
      return;
    }

    if (isAllPoin) {
      showToast("Pesanan poin tidak memerlukan pembayaran", "info");
      clear();
      sessionStorage.removeItem("checkout_payload");
      router.replace("/orders");
      return;
    }

    if (paying) return;
    setPaying(true);

    const paymentPayload: IPayment = {
      external_id: payload.kode_order, // ✅ WAJIB
      amount: payload.total,
      payer_email: user.email,
      description: `Pembayaran Pesanan ${payload.kode_order}`,
    };

    try {
      setPaying(false);
      const res = await postPayment(paymentPayload);

      showToast("Silakan lanjutkan pembayaran", "success");

      console.table(res);

      const redirectUrl =
        res.data?.invoice_url ||
        res.data?.redirect_url ||
        res.data?.payment_url;

      console.log("Redirecting to payment URL:", redirectUrl);

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

    } catch (err: any) {
      paymentLockRef.current = false;
      if (err?.response?.status === 429) {
        showToast(
          "Pembayaran sedang diproses. Silakan cek halaman pembayaran.",
          "info"
        );
        return;
      }

      showToast(err?.message || "Gagal memproses pembayaran", "error");
    }
  };

  if (!payload) {
    return (
      <div className="pt-[80px] md:pt-[89px] lg:pt-[161px] container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-2">Pembayaran</h1>
        <p className="text-gray-600 mb-4">
          Data checkout tidak ditemukan.
        </p>
        <Link href="/">
          <Button label="Kembali ke Beranda" color="primary" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[92px]">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Ringkasan Pembayaran</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {/* Account */}
            <div className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-semibold mb-4">Akun Pengguna</h3>
              <div>
                {user ? (
                  <div className="text-sm text-neutral-600">
                    {user.name} • {user.email} • {user.phone}
                  </div>
                ) : (
                  <div className="text-sm text-red-600">
                    Anda belum login. Silakan{" "}
                    <Link href="/login" className="underline">
                      login
                    </Link>{" "}
                    untuk melanjutkan.
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            {payload.items.map((it: CheckoutItem, idx: number) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow" >
                <h3 className="font-semibold mb-4">Barang Dibeli</h3>
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded overflow-hidden">
                    {it.gambar ? (
                      <img
                        src={it.gambar}
                        alt={it.nama_produk}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">{it.nama_produk}</div>
                    <div className="text-sm text-gray-600">
                      {it.warna} {it.ukuran && `• ${it.ukuran}`}
                    </div>
                    <div className="text-sm mt-1">
                      x{it.qty} •{" "}
                      {String(it.jenis ?? "").toLowerCase() === "poin"
                        ? `${formatDecimal(it.subtotal)} Poin`
                        : formatPrice(it.subtotal)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Address */}
            <div className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-semibold mb-4">Alamat Pengiriman</h3>
              <div className="text-sm text-neutral-600">{payload.alamat}</div>
            </div>

            {/* Payment Method */}
            {/* <div className="bg-white rounded-xl p-4 shadow">
              <h3 className="font-semibold mb-4">Metode Pembayaran</h3>
              <RadioGroup
                name="paymentMethod"
                options={[
                  { label: "Virtual Account", value: "VA" },
                  { label: "Direct Transfer", value: "Direct Transfer" },
                ]}
                selected={paymentMethod}
                onChange={(val) =>
                  setPaymentMethod(val as "VA" | "Direct Transfer")
                }
              />
            </div> */}
          </div>

          {/* Summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-[92px] bg-white rounded-xl shadow p-4">
              <div className="font-semibold mb-2">Ringkasan Pembayaran</div>

              <div className="flex justify-between text-sm mb-1">
                <span>Subtotal</span>
                <span>{formatPrice(payload.subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm mb-1">
                <span>Ongkir</span>
                <span>{formatPrice(payload.ongkir)}</span>
              </div>

              <div className="flex justify-between font-bold mt-3">
                <span>Total</span>
                <span className="text-green-600">
                  {isAllPoin
                    ? `${formatDecimal(payload.total)} Poin`
                    : formatPrice(payload.total)}
                </span>
              </div>

              <Button
                label="Lanjutkan Bayar"
                fullWidth
                className="mt-4"
                onClick={handlePayment}
                disabled={loading || paying}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
          <div className="container mx-auto">
              <div className=" bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-md py-3 px-3 flex items-center justify-between gap-3" style={{ boxShadow: "0 -6px 20px rgba(0,0,0,0.06)" }}>
                  <div>
                      <div className="text-base font-semibold">Total</div>
                      <div className="text-lg font-extrabold text-[#299A4D]">
                        {isAllPoin
                          ? `${formatDecimal(payload.total)} Poin`
                          : formatPrice(payload.total)}
                      </div>
                  </div>
                  <Button
                    label="Lanjutkan Bayar"
                    color="primary"
                    onClick={handlePayment}
                    disabled={loading || paying}
                  />
              </div>
          </div>
      </div>
    </div>
  );
}
