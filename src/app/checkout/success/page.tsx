"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderCode = searchParams.get("order");

  const router = useRouter();

  const handleBackToOrders = () => {
    if (typeof window === "undefined") return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (isDesktop) {
      router.push("/profile?tab=orders");
    } else {
      router.push("/profile/orders");
    }
  };

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[92px]">
        <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col items-center">
            {/* ICON */}
            <div className="relative flex justify-center mb-4">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100">
                    <CheckCircle2 className="w-14 h-14 text-green-600" />
                </div>
            </div>

            {/* TITLE */}
            <h1 className="relative text-2xl font-extrabold text-gray-800 mb-2">
                Pembayaran Berhasil 🎉
            </h1>

            {/* DESC */}
            <p className="relative text-sm text-gray-600 mb-5 leading-relaxed">
                Terima kasih! Pembayaran Anda telah berhasil diproses dan
                pesanan Anda sedang kami siapkan.
            </p>

            {/* ORDER CODE */}
            {orderCode && (
            <div className="relative mb-5">
                <div className="text-xs text-gray-500 mb-1">
                    Kode Order
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 font-semibold text-gray-800 tracking-wide">
                    {orderCode}
                </div>
            </div>
            )}

            {/* INFO */}
            <div className="relative text-sm text-gray-600 mb-6">
                Anda dapat memantau status pesanan kapan saja melalui halaman
                <span className="font-semibold text-gray-800"> Pesanan Saya</span>.
            </div>

            {/* ACTION */}
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-1/2 relative">
                <Button
                    label="Lihat Pesanan Saya"
                    fullWidth
                    className="font-semibold"
                    onClick={handleBackToOrders}
                />

                <Button
                    label="Kembali ke Beranda"
                    fullWidth
                    onClick={() => router.push("/")}
                />
            </div>

            {/* FOOTER NOTE */}
            <div className="relative mt-6 text-xs text-gray-400">
                Invoice pembayaran telah dikirim ke email Anda
            </div>
        </div>
    </div>
  );
}
