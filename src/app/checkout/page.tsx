// app/checkout/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useToast } from "@/components/ui/Toast";
import { useModal } from "@/context/ModalContext";

// Utils
import { formatPrice } from "@/utils/formatters";
import { formatDecimal } from "@/utils/formatDecimal";

// Context
import { useAuth } from "@/context/AuthContext";
import AddressForm from "@/components/features/Address/AddressForm";

interface CheckoutItem {
  product_id: number;
  nama_produk: string;
  kode_varian: string;
  warna: string | null;
  ukuran: string | null;
  qty: number;
  unit_price: number;
  subtotal: number;
  gambar?: string | null;
  stok_varian?: number;
  jenis?: string;
}

export default function CheckoutPage() {
  const router = useRouter();

  const { showToast } = useToast();
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);

  const [items, setItems] = useState<CheckoutItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const user = useAuth((s) => s.user);

  useEffect(() => {
    // read from sessionStorage
    try {
      const raw = sessionStorage.getItem("checkout_items");
      const at = sessionStorage.getItem("checkout_items_at");
      if (!raw) {
        setItems(null);
        setLoading(false);
        return;
      }
      const parsed = JSON.parse(raw) as CheckoutItem[];
      // small validation
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setItems(null);
        setLoading(false);
        return;
      }
      setItems(parsed);
      setLoading(false);
    } catch (e) {
      console.error("Failed to read checkout_items:", e);
      setItems(null);
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!items || items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-6">Tidak ada item untuk dibayar. Silakan pilih produk terlebih dahulu.</p>
        <div className="flex gap-2">
          <Link href="/"><Button label="Kembali ke Beranda" color="secondary" /></Link>
          <Link href="/productlist"><Button label="Telusuri Produk" color="primary" /></Link>
        </div>
      </div>
    );
  }

  const total = items.reduce((s, it) => s + (it.subtotal || 0), 0);

  const placeOrder = async () => {
    // placeholder: Anda harus mengganti ini dengan API order nyata
    if (!user) {
      showToast("Harap login untuk melanjutkan pembayaran.", "error");
      router.push("/");
      return;
    }

    try {
      // disable UI while "placing"
      setLoading(true);

      // build order payload
      const orderPayload = {
        user_id: user.id,
        items: items.map((it) => ({
          product_id: it.product_id,
          kode_varian: it.kode_varian,
          qty: it.qty,
          harga: it.unit_price,
        })),
        notes,
        total,
      };

      // for now, just log and show toast
      console.log("Order payload (PLACEHOLDER):", orderPayload);
      // TODO: call your order API here (e.g. api.createOrder(orderPayload))

      // clear sessionStorage after place
      sessionStorage.removeItem("checkout_items");
      sessionStorage.removeItem("checkout_items_at");

      showToast("Pesanan berhasil diproses (placeholder). Lihat console untuk payload.", "success");
      // redirect to order success / orders page if exists
      router.push("/orders" /* or "/order-success" */);
    } catch (err: any) {
      console.error("Place order failed:", err);
      showToast(err?.message ?? "Gagal memproses pesanan.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[92px]">
        <div className="container mx-auto px-4 md:px-6 py-12">
            <h1 className="text-2xl font-bold mb-4">Pembayaran</h1>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    {/* Items */}
                    {items.map((it, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 flex gap-4 items-center shadow">
                            <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0 bg-gray-50">
                                {it.gambar ? <img src={it.gambar} alt={it.nama_produk} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No image</div>}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-xs md:text-sm lg:text-md font-semibold leading-tight overflow-hidden text-ellipsis line-clamp-2">{it.nama_produk}</div>
                                    <div className="text-sm text-gray-600">{it.warna || ""} {it.ukuran ? `• ${it.ukuran}` : ""}</div>
                                    <div className="text-sm text-gray-600">Kode: {it.kode_varian}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{it.jenis === "poin" ? `${formatDecimal(it.unit_price)} Poin` : formatPrice(it.unit_price)}</div>
                                    <div className="text-sm text-gray-600">x{it.qty}</div>
                                </div>
                                </div>

                                <div className="mt-3 text-sm text-gray-700">
                                    Subtotal: {it.jenis === "poin" ? `${formatDecimal(it.subtotal)} Poin` : formatPrice(it.subtotal)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Address */}
                    <div className="bg-white rounded-xl p-4 shadow space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm md:text-md lg:text-lg font-semibold">Alamat</div>
                            <button
                                className="text-sm md:text-md lg:text-lg font-semibold text-primary-500 cursor-pointer"
                                onClick={() => {
                                    openModal({
                                    title: "Alamat",
                                    size: "md",
                                    mobileMode: "full",
                                    content: (<AddressForm />),
                                    });
                                }}
                            >
                                Ubah
                            </button>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-black">Muhammad Fikri Ilhamsyah • 085656197428</div>
                            <div className="text-sm text-gray-600">Jl. Pasir Panjang RT.003 RW.002, Des. Jogjogan, Kec. Cisarua, Kab. Bogor, 16750, Cisarua, Kab. Bogor, Jawa Barat, 6285656197428</div>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-white rounded-xl p-4 shadow">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catatan untuk penjual (opsional)</label>
                        <InputField value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contoh: Kirim jam kerja saja" />
                    </div>
                </div>

                <aside className="hidden lg:block space-y-4">
                    <div className="lg:sticky lg:top-[92px]">
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="text-base md:text-lg lg:text-xl font-semibold text-black">Ringkasan Pembayaran</div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-sm text-gray-700">Subtotal</div>
                                <div className="font-semibold">{formatPrice(items.reduce((s, it) => s + it.unit_price * it.qty, 0))}</div>
                            </div>

                            {/* you can add shipping, tax etc. here */}

                            <div className="flex justify-between items-center mt-4">
                                <div className="text-base font-semibold">Total</div>
                                <div className="text-lg font-extrabold text-[#299A4D]">{formatPrice(total)}</div>
                            </div>

                            <div className="mt-4">
                                <Button label="Buat Pesanan" color="primary" fullWidth onClick={placeOrder} />
                            </div>

                            <div className="mt-2">
                                <Button label="Kembali" color="secondary" fullWidth onClick={() => router.back()} />
                            </div>
                        </div>
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
                        <div className="text-lg font-extrabold text-[#299A4D]">{formatPrice(total)}</div>
                    </div>
                    <Button label="Buat Pesanan" color="primary" />
                </div>
            </div>
        </div>
    </div>
  );
}
