"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

// Hooks
import { useCart } from "@/hooks/useCart";
import { useCartByIdUser } from "@/hooks/useCartByIdUse";
import { useProducts } from "@hooks/useProducts";
import useDeleteCartById from "@/hooks/useDeleteCartById";
import { usePostCart } from "@/hooks/useCartPost";

// Components
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import { useToast } from "@/components/ui/Toast";
import { useModal } from "@/context/ModalContext";
import BottomSheet from "@/components/ui/BottomSheet";

// Utils
import { formatPrice } from "@/utils/formatters";
import { formatDecimal } from "@/utils/formatDecimal";

// Icons
import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, loading: cartLoading, error: cartError } = useCart();
  const { cartByIdUser, loading: cartByIdUserLoading, error: cartByIdUserError, refetch } = useCartByIdUser();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { deleteCart, loading: deleteLoading, error: deleteError } = useDeleteCartById();
  const { postCart, loading: postCartLoading } = usePostCart();

  const { showToast } = useToast();
  const openModal = useModal(s => s.openModal);
  const closeModal = useModal(s => s.closeModal);

  const loading = cartLoading || productsLoading || cartByIdUserLoading;
  const error = cartError || productsError || cartByIdUserError;

  // State untuk selected item (cartItem.id)
  const [selected, setSelected] = useState<number[]>([]);
  // State untuk kuantitas lokal per cart item id
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  // Tab aktif berdasarkan id_jenis (null jika belum ada)
  const [activeJenis, setActiveJenis] = useState<number | null>(null);
  // state untuk menyimpan id item yang sedang dihapus (loading per-item)
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // Inisialisasi quantities saat cart berubah
  useEffect(() => {
    if (!Array.isArray(cartByIdUser)) return;
    const init: Record<number, number> = {};
    cartByIdUser.forEach((c: any) => {
      init[c.id] = Number(c.qty) || 1;
    });
    setQuantities(init);

    // optional: select semua item di jenis pertama saat load awal
    const jenisFirst = cartByIdUser.length > 0 ? cartByIdUser[0].id_jenis ?? null : null;
    setActiveJenis(jenisFirst);

    // pilih semua items di jenis pertama secara default
    if (jenisFirst != null) {
      const idsOfFirst = cartByIdUser.filter((c: any) => Number(c.id_jenis) === Number(jenisFirst)).map((c: any) => c.id);
      setSelected(idsOfFirst);
    } else {
      setSelected([]);
    }
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

  // GROUP BY id_jenis (menggunakan data langsung dari cartItem)
  const groups = useMemo(() => {
    const map = new Map<number, { id_jenis: number; nama_jenis: string; items: any[] }>();
    for (const it of cartWithProduct) {
      const ji = Number(it.cartItem.id_jenis ?? 0);
      const nama = it.cartItem.nama_jenis ?? (ji === 2 ? "Poin" : "Uang");
      if (!map.has(ji)) {
        map.set(ji, { id_jenis: ji, nama_jenis: nama, items: [] });
      }
      map.get(ji)!.items.push(it);
    }
    // convert to array and sort by id_jenis
    return Array.from(map.values()).sort((a, b) => a.id_jenis - b.id_jenis);
  }, [cartWithProduct]);

  // displayedItems: hanya item dari jenis aktif (tidak ada 'Semua')
  const displayedItems = useMemo(() => {
    if (activeJenis === null) return [];
    return cartWithProduct.filter((it) => Number(it.cartItem.id_jenis ?? 0) === Number(activeJenis));
  }, [cartWithProduct, activeJenis]);

  // total hanya hitung yang dipilih
  const totalSelectedValue = useMemo(() => {
    return cartWithProduct.reduce((s: number, it: any) => {
      if (!selected.includes(it.cartItem.id)) return s;
      return s + (it.subtotal || 0);
    }, 0);
  }, [cartWithProduct, selected]);

  // determine selected types set to enforce same-type checkout
  const selectedJenisSet = useMemo(() => {
    const set = new Set<number>();
    for (const id of selected) {
      const found = cartWithProduct.find((it: any) => it.cartItem.id === id);
      if (found) set.add(Number(found.cartItem.id_jenis ?? 0));
    }
    return set;
  }, [selected, cartWithProduct]);

  const selectedIsSingleJenis = selectedJenisSet.size <= 1 && selected.length > 0;
  const selectedIsPoin = (() => {
    if (selected.length === 0) return false;
    if (!selectedIsSingleJenis) return false;
    const anySelected = cartWithProduct.find((it: any) => selected.includes(it.cartItem.id));
    if (!anySelected) return false;
    const nama = String(anySelected.cartItem.nama_jenis ?? "").toLowerCase();
    return nama === "poin";
  })();

  // helper toggle select
  const toggleSelect = (id: number) => {
    const clicked = cartWithProduct.find((it: any) => it.cartItem.id === id);
    if (!clicked) return;

    const clickedJenis = Number(clicked.cartItem.id_jenis ?? 0);

    // jika selected kosong => pilih biasa
    if (selected.length === 0) {
      setSelected([id]);
      return;
    }

    // jika sudah ada selected dan jenis berbeda dengan clicked => gantikan seluruh selection
    const existingJenis = Array.from(selectedJenisSet)[0];
    if (existingJenis !== undefined && Number(existingJenis) !== Number(clickedJenis)) {
      // ganti pilihan agar selalu single-jenis
      setSelected([id]);
      return;
    }

    // kalau jenis sama, toggle normal (add/remove)
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // helper select all / none (apply only to displayed items — jenis aktif)
  const toggleSelectAll = () => {
    if (!activeJenis) return;
    const displayedIds = displayedItems.map((it: any) => it.cartItem.id);
    const allSelected = displayedIds.every((id) => selected.includes(id));
    if (allSelected) {
      // unselect displayed
      setSelected((prev) => prev.filter((id) => !displayedIds.includes(id)));
    } else {
      // sebelum menambah, pastikan kita tidak sedang memilih jenis lain.
      // jika ada selected dengan jenis berbeda, replace selection dengan displayedIds.
      const currentJenis = Array.from(selectedJenisSet)[0];
      if (currentJenis !== undefined && Number(currentJenis) !== Number(activeJenis)) {
        // replace
        setSelected(displayedIds);
      } else {
        // merge (same jenis)
        setSelected((prev) => Array.from(new Set([...prev, ...displayedIds])));
      }
    }
  };

  // quantity handlers
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
  const canCheckout = selectedIsSingleJenis && selected.length > 0;

  // === NOW it's safe to early-return because all Hooks have been called ===
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={String(error)} />;

  // render tabs: only per jenis (no "Semua")
  const renderTabs = () => {
    return (
      <div className="flex gap-2 overflow-auto">
        {groups.map((g) => {
          const active = g.id_jenis === activeJenis;
          return (
            <button
              key={g.id_jenis}
              onClick={() => {
                setActiveJenis(g.id_jenis);
                // ketika pindah tab, otomatis sesuaikan selected: pilih semua items di tab baru
                const ids = g.items.map((it: any) => it.cartItem.id);
                setSelected(ids);
              }}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${active ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-700 border-gray-200 cursor-pointer"}`}
            >
              {g.nama_jenis} <span className={`ml-1 text-xs ${active ? "text-white" : "text-gray-500"}`}>({g.items.length})</span>
            </button>
          );
        })}
      </div>
    );
  };

  const confirmDelete = async (cartId: number) => {
    try {
      setDeletingId(cartId);

      // close any open UI
      try { closeModal(); } catch (e) { /* ignore */ }
      setBottomSheetOpen(false);

      const res = await deleteCart(cartId);

      if (!res) {
        showToast("Gagal menghapus item. Coba lagi.", "error");
        return;
      }

      if (typeof res.success !== "undefined" && res.success === false) {
        showToast(res.message ?? "Gagal menghapus item.", "error");
        return;
      }

      if (typeof refetch === "function") {
        await refetch();
      }

      setSelected((prev) => prev.filter((id) => id !== cartId));

      showToast(res.message ?? "Item berhasil dihapus dari keranjang.", "success");

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cart:updated", { detail: { userId: cartByIdUser?.[0]?.user_id ?? null } }));
      }
    } catch (err: any) {
      console.error("Gagal menghapus item keranjang:", err);
      const message = err?.message ?? "Gagal menghapus item. Silakan coba lagi.";
      showToast(message, "error");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  // helper untuk membuka UI konfirmasi sesuai ukuran layar
  const handleDeleteClick = (cartId: number) => {
    // detect small devices (mobile + tablet) using window width < 1024 (tailwind 'lg' breakpoint)
    const isSmall = typeof window !== "undefined" ? window.innerWidth < 1024 : true;
    setConfirmId(cartId);

    if (isSmall) {
      setBottomSheetOpen(true);
    } else {
      openModal({
        title: "Hapus Item",
        size: "md",
        mobileMode: "full",
        content: (
          <div className="space-y-4">
            <div className="mt-4 space-y-2">
              <div className="text-sm font-semibold">Hapus item dari keranjang?</div>
              <div className="text-xs text-gray-600">Item akan dihapus dan tidak dapat dikembalikan.</div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                label="Batal"
                color="secondary"
                onClick={() => {
                  try { closeModal(); } catch (e) {}
                  setConfirmId(null);
                }}
              />
              <Button
                label="Hapus"
                color="primary"
                onClick={() => confirmDelete(cartId)}
              />
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0 pt-0">
        <h1 className="text-2xl font-bold mb-2">Keranjang</h1>
        <h2 className="text-sm font-normal text-gray-500 mb-4">Cek item sebelum melakukan pemesanan</h2>

        {/* Tabs (only per jenis) */}
        {renderTabs()}
      </div>

      {displayedItems.length === 0 ? (
        <div>
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0 flex flex-col items-center space-y-4">
            <div className="w-48 h-48 flex items-center justify-center mb-4">
              <svg width="192" height="192" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <rect x="1" y="5" width="22" height="15" rx="3" fill="#F8FAFC"/>
                <path d="M3 7.5H21" stroke="#E6EEF5" strokeWidth="1.2"/>
                <path d="M7 11h10" stroke="#C9D8E6" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="8.5" cy="15.5" r="1.6" fill="#E6EEF5"/>
                <circle cx="15.5" cy="15.5" r="1.6" fill="#E6EEF5"/>
                <path d="M9.5 6.5c0-1.1.9-2 2-2h0c1.1 0 2 .9 2 2v1" stroke="#B7C9DB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center">Tidak ada item di tab ini</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Tidak ada item pada jenis yang dipilih. Coba jenis lain atau tambahkan produk terlebih dahulu.
            </p>

            <div className="flex items-center gap-3">
              <Link href="/productlist" passHref>
                <Button label="Telusuri Produk" color="primary" />
              </Link>

              <Link href="/" passHref>
                <Button label="Kembali ke Beranda" color="secondary" />
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* KIRI: Daftar item (dengan checkbox & qty controls) */}
            <div className="col-span-1 lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={displayedItems.length > 0 && displayedItems.every(it => selected.includes(it.cartItem.id))}
                    onChange={toggleSelectAll}
                    className="h-4 w-4"
                    aria-label="Pilih semua item di jenis ini"
                  />
                  <span className="text-sm">Pilih semua (jenis)</span>
                </div>
                <div className="text-sm text-gray-600">Item di jenis: {displayedItems.length}</div>
              </div>

              <div className="space-y-4">
                {displayedItems.map((item: any) => {
                  const { cartItem, product, variant, price } = item;
                  const qty = quantities[cartItem.id] ?? Number(cartItem.qty) ?? 1;
                  const maxStock = variant?.stok ?? 999999;
                  const itemSubtotal = (Number(price) || 0) * qty;
                  const isPoin = String(cartItem.nama_jenis ?? "").toLowerCase() === "poin";

                  const isDeleting = deletingId === cartItem.id;

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

                              <div>
                                  <h3 id={`cart-item-${cartItem.id}`} className="text-xs md:text-sm lg:text-md font-semibold leading-tight overflow-hidden text-ellipsis line-clamp-2">
                                      {product?.nama_produk ?? `Variant ${cartItem.kode_varian}`}
                                  </h3>

                                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                                      {variant?.warna && <div>Warna: <span className="font-medium text-gray-700">{variant.warna}</span></div>}
                                      {variant?.ukuran !== null && variant?.ukuran !== undefined && variant?.ukuran !== "" && (
                                      <div>Ukuran: <span className="font-medium text-gray-700">{variant.ukuran}</span></div>
                                      )}
                                  </div>
                              </div>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(cartItem.id)}
                            disabled={isDeleting}
                            aria-busy={isDeleting}
                            className={`text-sm ${isDeleting ? "text-red-300 cursor-not-allowed" : "text-red-600 hover:text-red-700 cursor-pointer"}`}
                            aria-label={`Hapus ${cartItem.kode_varian}`}
                            title="Hapus item"
                          >
                              <Trash2 className="w-4 h-4" />
                          </button>
                      </div>

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
                              Subtotal:{" "}
                              {isPoin
                                ? `${formatDecimal(itemSubtotal)} Poin`
                                : formatPrice(itemSubtotal)}
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
                    <div className="text-xl font-bold">
                      {selectedIsPoin
                        ? `${formatDecimal(totalSelectedValue)} Poin`
                        : formatPrice(totalSelectedValue)}
                    </div>
                  </div>

                  {!selectedIsSingleJenis && selected.length > 0 && (
                    <div className="text-sm text-red-600">
                      Pilihan harus berasal dari jenis yang sama (Uang atau Poin) untuk melanjutkan ke checkout.
                    </div>
                  )}

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
              <span className="text-base font-semibold">
                {selectedIsPoin ? `${formatDecimal(totalSelectedValue)} Poin` : formatPrice(totalSelectedValue)}
              </span>
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

      {/* BottomSheet konfirmasi untuk mobile/tablet */}
      <BottomSheet open={bottomSheetOpen} onClose={() => { setBottomSheetOpen(false); setConfirmId(null); }}>
        <div className="py-2">
          <div className="text-sm font-semibold mb-2">Hapus item dari keranjang?</div>
          <div className="text-xs text-gray-600 mb-4">Item akan dihapus dan tidak dapat dikembalikan.</div>

          <div className="flex justify-end gap-2">
            <Button
              label="Batal"
              color="secondary"
              onClick={() => {
                setBottomSheetOpen(false);
                setConfirmId(null);
              }}
            />
            <Button
              label={deletingId === confirmId ? "Menghapus..." : "Hapus"}
              color="primary"
              onClick={() => {
                if (confirmId != null) confirmDelete(confirmId);
              }}
              disabled={deletingId === confirmId}
            />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
