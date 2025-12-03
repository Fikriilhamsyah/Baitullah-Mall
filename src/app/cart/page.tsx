"use client";

import React, { useMemo, useState, useEffect } from "react";

// Hooks
import { useCart } from "@/hooks/useCart";
import { useCartByIdUser } from "@/hooks/useCartByIdUse";
import { useProducts } from "@hooks/useProducts";

// Components
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";

// Utils
import { formatPrice } from "@/utils/formatters";

// Icons
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { cart, loading: cartLoading, error: cartError } = useCart();
  const { cartByIdUser, loading: cartByIdUserLoading, error: cartByIdUserError } = useCartByIdUser();
  const { products, loading: productsLoading, error: productsError } = useProducts();

  const loading = cartLoading || productsLoading;
  const error = cartError || productsError;

  // State untuk selected item (cartItem.id)
  const [selected, setSelected] = useState<number[]>([]);
  // State untuk kuantitas lokal per cart item id
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // Inisialisasi quantities saat cart berubah
  useEffect(() => {
    if (!Array.isArray(cartByIdUser)) return;
    const init: Record<number, number> = {};
    cartByIdUser.forEach((c: any) => {
      init[c.id] = Number(c.qty) || 1;
    });
    setQuantities(init);
    // optional: select semua item saat load awal
    setSelected(cartByIdUser.map((c: any) => c.id));
  }, [cartByIdUser]);

  // Buat map kode_varian -> { product, variant } supaya mudah render
  const cartWithProduct = useMemo(() => {
    if (!Array.isArray(cartByIdUser) || !Array.isArray(products)) return [];

    return cartByIdUser.map((c: any) => {
      // cari produk yang punya varian dengan kode_varian == c.kode_varian
      let matchedProduct: any = null;
      let matchedVariant: any = null;

      for (const p of products) {
        if (!Array.isArray(p.varian)) continue;
        const v = p.varian.find((x: any) => String(x.kode_varian) === String(c.kode_varian));
        if (v) {
          matchedProduct = p;
          matchedVariant = v;
          break;
        }
      }

      // gunakan quantities local jika ada, fallback ke c.qty
      const qtyLocal = quantities[c.id] ?? Number(c.qty) ?? 1;
      const price = Number(c.harga) || 0;
      const subtotal = price * qtyLocal;

      return {
        cartItem: c,
        product: matchedProduct,
        variant: matchedVariant,
        subtotal,
        qtyLocal,
        price,
      };
    });
    // quantities dimasukkan agar memo recalculated saat berubah
  }, [cartByIdUser, products, quantities]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={String(error)} />;

  // total hanya hitung yang dipilih
  const totalSelected = cartWithProduct.reduce((s: number, it: any) => {
    if (!selected.includes(it.cartItem.id)) return s;
    return s + (it.subtotal || 0);
  }, 0);

  // helper toggle select
  const toggleSelect = (id: number) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // helper select all / none
  const toggleSelectAll = () => {
    if (selected.length === cartWithProduct.length) {
      setSelected([]);
    } else {
      setSelected(cartWithProduct.map((it: any) => it.cartItem.id));
    }
  };

  // quantity handlers (mirip ProductDetail)
  const updateQuantity = (cartId: number, newQty: number, max?: number) => {
    if (Number.isNaN(newQty) || newQty < 1) newQty = 1;
    if (typeof max === "number" && newQty > max) newQty = max;
    setQuantities((prev) => ({ ...prev, [cartId]: newQty }));
  };

  const increment = (cartId: number, max?: number) => {
    setQuantities((prev) => {
      const cur = prev[cartId] ?? 1;
      const nxt = typeof max === "number" ? Math.min(cur + 1, max) : cur + 1;
      return { ...prev, [cartId]: nxt };
    });
  };

  const decrement = (cartId: number) => {
    setQuantities((prev) => {
      const cur = prev[cartId] ?? 1;
      const nxt = Math.max(1, cur - 1);
      return { ...prev, [cartId]: nxt };
    });
  };

  // jika tidak ada item selected, disable checkout
  const canCheckout = selected.length > 0;

  return (
    // pb-28 untuk memberi ruang pada fixed bottom bar di mobile sehingga konten tidak tertutup
    <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0 pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <h1 className="text-2xl font-bold mb-2">Keranjang</h1>
      <h2 className="text-sm font-normal text-gray-500 mb-6">Cek item sebelum melakukan pemesanan</h2>

      {cartWithProduct.length === 0 ? (
        <div className="text-gray-500">Keranjang kosong.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KIRI: Daftar item (dengan checkbox & qty controls) */}
          <div className="col-span-1 lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.length === cartWithProduct.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4"
                  aria-label="Pilih semua item"
                />
                <span className="text-sm">Pilih semua</span>
              </div>
              <div className="text-sm text-gray-600">Item: {cartWithProduct.length}</div>
            </div>

            <div className="space-y-4">
              {cartWithProduct.map((item: any) => {
                const { cartItem, product, variant, price } = item;
                // gunakan local quantities jika ada
                const qty = quantities[cartItem.id] ?? Number(cartItem.qty) ?? 1;
                // gunakan stok varian jika ada, atau fallback stok tinggi
                const maxStock = variant?.stok ?? 999999;

                const itemSubtotal = (Number(price) || 0) * qty;

                return (
                  <article
                    key={cartItem.id}
                    className="bg-white p-3 md:p-4 rounded-xl shadow-sm flex flex-col gap-2 md:gap-3"
                    aria-labelledby={`cart-item-${cartItem.id}`}
                  >
                    <div className="flex items-start justify-between">
                        <div className="flex gap-1 md:gap-3">
                            <div className="flex items-start gap-3 w-full md:w-auto">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(cartItem.id)}
                                    onChange={() => toggleSelect(cartItem.id)}
                                    className="h-4 w-4 mt-1"
                                    aria-label={`Pilih item ${cartItem.kode_varian}`}
                                />

                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-200">
                                    {variant?.gambar ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${variant.gambar}`}
                                        alt={product?.nama_produk ?? cartItem.kode_varian}
                                        className="w-full h-full object-cover"
                                    />
                                    ) : product?.gambar_utama ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${product.gambar_utama}`}
                                        alt={product?.nama_produk}
                                        className="w-full h-full object-cover"
                                    />
                                    ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs bg-gray-100 text-gray-500">
                                        No Image
                                    </div>
                                    )}
                                </div>
                            </div>

                            {/* Info + controls (mengisi ruang) */}
                            <div>
                                <h3 id={`cart-item-${cartItem.id}`} className="text-xs md:text-sm lg:text-md font-semibold leading-tight overflow-hidden text-ellipsis line-clamp-2">
                                    {product?.nama_produk ?? `Variant ${cartItem.kode_varian}`}
                                </h3>

                                <div className="mt-1 text-xs text-gray-500 space-y-1">
                                    {variant?.warna && <div>Warna: <span className="font-medium text-gray-700">{variant.warna}</span></div>}
                                    {/* tampilkan ukuran jika ada */}
                                    {variant?.ukuran !== null && variant?.ukuran !== undefined && variant?.ukuran !== "" && (
                                    <div>Ukuran: <span className="font-medium text-gray-700">{variant.ukuran}</span></div>
                                    )}
                                    {/* tambahan harga varian */}
                                    {/* {variant?.tambahan_harga ? (
                                    <div>Tambahan harga varian: <span className="font-medium text-gray-700">{formatPrice(Number(variant.tambahan_harga))}</span></div>
                                    ) : null} */}
                                    {/* berat */}
                                    {/* {variant?.berat !== undefined && variant?.berat !== null && (
                                    <div>Berat: <span className="font-medium text-gray-700">{variant.berat} gr</span></div>
                                    )} */}
                                    {/* stok */}
                                    {/* <div>Stok varian: <span className="font-medium text-gray-700">{variant?.stok ?? "N/A"}</span></div> */}
                                    {/* jika produk memiliki kategori atau jenis, tampilkan ringkas */}
                                    {/* {product?.kategori?.nama_kategori && <div>Kategori: <span className="font-medium text-gray-700">{product.kategori.nama_kategori}</span></div>} */}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => alert("Implement delete API")}
                            className="text-sm text-red-600 hover:text-red-700"
                            aria-label={`Hapus ${cartItem.kode_varian}`}
                            title="Hapus item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* kanan: qty + subtotal + aksi (rata kanan di desktop, stacked di mobile) */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => decrement(cartItem.id)}
                                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                                aria-label={`Kurangi jumlah ${cartItem.kode_varian}`}
                            >
                                –
                            </button>

                            <div>
                                <InputField
                                    type="number"
                                    min={1}
                                    max={maxStock}
                                    value={qty}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (Number.isNaN(val)) return;
                                        updateQuantity(cartItem.id, val, maxStock);
                                    }}
                                    className="text-center"
                                    aria-label={`Jumlah ${cartItem.kode_varian}`}
                                />
                            </div>

                            <button
                                onClick={() => increment(cartItem.id, maxStock)}
                                className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                                aria-label={`Tambah jumlah ${cartItem.kode_varian}`}
                            >
                                +
                            </button>
                        </div>

                        <div className="text-xs md:text-sm font-semibold text-right md:text-right">
                            Subtotal: {formatPrice(itemSubtotal)}
                        </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* KANAN: Total + Checkout (sticky pada lg ke atas) */}
          <aside className="hidden lg:block col-span-1 lg:col-span-4">
            <div className="lg:sticky lg:top-[160px]">
              <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
                <div className="text-base md:text-lg lg:text-xl font-semibold text-black">Ringkasan Pesanan</div>

                <div className="text-sm text-gray-600">Item dipilih: <span className="font-medium">{selected.length}</span></div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-bold">{formatPrice(totalSelected)}</div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    label="Lanjutkan ke Checkout"
                    color="primary"
                    onClick={() => {
                      if (!canCheckout) return;
                      const payload = selected.map((id) => {
                        const ci = cart.find((c: any) => c.id === id);
                        return {
                          cart_id: id,
                          user_id: ci?.user_id ?? null,
                          kode_varian: ci?.kode_varian,
                          qty: quantities[id] ?? ci?.qty,
                          harga: ci?.harga,
                        };
                      });
                      console.log("Checkout payload:", payload);
                      alert("Implement checkout API — lihat console untuk payload contoh.");
                    }}
                    disabled={!canCheckout}
                  />
                  <div className="text-xs text-gray-500">Dengan klik "Checkout", Anda telah menyetujui Syarat & Ketentuan</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* MOBILE: bottom bar fixed (hanya tampil di < lg) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="container mx-auto">
          <div
            className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-md py-3 px-3 flex items-center justify-between gap-3"
            style={{ boxShadow: "0 -6px 20px rgba(0,0,0,0.06)" }}
          >
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Dipilih: <span className="font-medium">{selected.length}</span></span>
              <span className="text-base font-semibold">{formatPrice(totalSelected)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                label="Checkout"
                color="primary"
                onClick={() => {
                  if (!canCheckout) return;
                  const payload = selected.map((id) => {
                    const ci = cart.find((c: any) => c.id === id);
                    return {
                      cart_id: id,
                      user_id: ci?.user_id ?? null,
                      kode_varian: ci?.kode_varian,
                      qty: quantities[id] ?? ci?.qty,
                      harga: ci?.harga,
                    };
                  });
                  console.log("Checkout payload (mobile):", payload);
                  alert("Implement checkout API — lihat console untuk payload contoh.");
                }}
                disabled={!canCheckout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
