"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Hooks
import { useCart } from "@/hooks/useCart";
import { useCartByIdUser } from "@/hooks/useCartByIdUser";
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

/**
 * Alternative implementation using per-item pendingDelta + coalesce timer.
 * - pendingDeltaRef: how many + / - unflushed (can be negative)
 * - flushTimerRef: timeout id per item; when expired we flush one request for the delta
 * - serverQtyRef: last known server qty (for canonical)
 * - quantities state = serverQty + pendingDelta (optimistic)
 */

export default function CartPage() {
  const router = useRouter();

  const { cart, loading: cartLoading, error: cartError } = useCart();
  const { cartByIdUser, loading: cartByIdUserLoading, error: cartByIdUserError, refetch } = useCartByIdUser();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { deleteCart } = useDeleteCartById();
  const { postCart } = usePostCart();

  const { showToast } = useToast();
  const openModal = useModal(s => s.openModal);
  const closeModal = useModal(s => s.closeModal);

  const loading = cartLoading || productsLoading || cartByIdUserLoading;
  const error = cartError || productsError || cartByIdUserError;

  // --- state & refs ---
  const [selected, setSelected] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [qtyLoading, setQtyLoading] = useState<Record<number, boolean>>({});
  const [activeJenis, setActiveJenis] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // server canonical qty (for rollback & compute)
  const serverQtyRef = useRef<Record<number, number>>({});
  // pending delta per item (can be +n or -n). Flushed as single request per coalesce window.
  const pendingDeltaRef = useRef<Record<number, number>>({});
  // per-item timer id for coalescing clicks/changes
  const flushTimerRef = useRef<Record<number, number | null>>({});
  // to avoid concurrent flush race, mark in-flight per item
  const inflightRef = useRef<Record<number, boolean>>({});
  // keep a ref of quantities for sync reads
  const quantitiesRef = useRef<Record<number, number>>({});

  const COALESCE_MS = 250; // adjust: 200-400 ms typical

  // initialize from cartByIdUser
  useEffect(() => {
    if (!Array.isArray(cartByIdUser)) return;
    const init: Record<number, number> = {};
    const server: Record<number, number> = {};
    cartByIdUser.forEach((c: any) => {
      const q = Number(c.qty) || 1;
      init[c.id] = q;
      server[c.id] = q;
    });
    setQuantities(init);
    quantitiesRef.current = { ...init };
    serverQtyRef.current = server;
    // select first jenis by default
    const jenisFirst = cartByIdUser.length > 0 ? cartByIdUser[0].id_jenis ?? null : null;
    setActiveJenis(jenisFirst);
    if (jenisFirst != null) {
      const idsOfFirst = cartByIdUser.filter((c: any) => Number(c.id_jenis) === Number(jenisFirst)).map((c: any) => c.id);
      setSelected(idsOfFirst);
    } else {
      setSelected([]);
    }
  }, [cartByIdUser]);

  useEffect(() => { quantitiesRef.current = { ...quantities }; }, [quantities]);

  // helper: schedule flush for cartId after COALESCE_MS
  const scheduleFlush = (cartId: number) => {
    // clear existing
    const prev = flushTimerRef.current[cartId];
    if (prev) clearTimeout(prev);
    flushTimerRef.current[cartId] = window.setTimeout(() => {
      flushTimerRef.current[cartId] = null;
      void flushPending(cartId);
    }, COALESCE_MS) as unknown as number;
  };

  // flushPending: send one request setting qty = serverQty + pendingDelta
  const flushPending = async (cartId: number) => {
    const delta = pendingDeltaRef.current[cartId] ?? 0;
    if (delta === 0) return; // nothing to do

    // if inflight, wait until finished (we'll be retried via scheduleFlush after inflight toggles)
    if (inflightRef.current[cartId]) {
      // schedule retry shortly
      scheduleFlush(cartId);
      return;
    }

    const serverCurrent = serverQtyRef.current[cartId] ?? 0;
    const target = Math.max(1, serverCurrent + delta);

    // if target equals server, just clear pending
    if (serverCurrent === target) {
      pendingDeltaRef.current[cartId] = 0;
      return;
    }

    inflightRef.current[cartId] = true;
    setQtyLoading((prev) => ({ ...prev, [cartId]: true }));

    // optimistic UI already applied (quantities hold server+delta), but ensure it's set
    setQuantities((prev) => ({ ...prev, [cartId]: target }));
    quantitiesRef.current = { ...quantitiesRef.current, [cartId]: target };

    const cartItem = cart.find((c: any) => c.id === cartId);
    const rollback = serverQtyRef.current[cartId] ?? (cartItem ? Number(cartItem.qty) ?? 1 : 1);
    if (!cartItem) {
      inflightRef.current[cartId] = false;
      setQtyLoading((prev) => ({ ...prev, [cartId]: false }));
      pendingDeltaRef.current[cartId] = 0;
      return;
    }

    const payload = {
      cart_id: cartId,
      qty: target,
      harga: cartItem.harga,
      user_id: cartItem.user_id,
      kode_varian: cartItem.kode_varian,
    };

    try {
      const res = await postCart(payload);
      if (res && res.data) {
        serverQtyRef.current[cartId] = target;
        pendingDeltaRef.current[cartId] = 0;
        setQuantities((prev) => ({ ...prev, [cartId]: target }));
        quantitiesRef.current = { ...quantitiesRef.current, [cartId]: target };
        if (typeof refetch === "function") {
          try { await refetch(); } catch (_) { /* ignore */ }
        }
        showToast("Kuantitas berhasil diperbarui.", "success");
      } else {
        // rollback
        pendingDeltaRef.current[cartId] = 0;
        setQuantities((prev) => ({ ...prev, [cartId]: rollback }));
        quantitiesRef.current = { ...quantitiesRef.current, [cartId]: rollback };
        showToast("Gagal memperbarui kuantitas. Coba lagi.", "error");
      }
    } catch (err: any) {
      console.error("[flushPending] error", err);
      pendingDeltaRef.current[cartId] = 0;
      setQuantities((prev) => ({ ...prev, [cartId]: rollback }));
      quantitiesRef.current = { ...quantitiesRef.current, [cartId]: rollback };
      if (typeof refetch === "function") {
        try { await refetch(); } catch (_) {}
      }
      const msg = err?.response?.data?.message ?? err?.message ?? "Terjadi kesalahan. Coba lagi.";
      showToast(msg, "error");
    } finally {
      inflightRef.current[cartId] = false;
      setQtyLoading((prev) => ({ ...prev, [cartId]: false }));
    }
  };

  // increment / decrement will update pendingDeltaRef and quantities optimistically, then scheduleFlush
  const increment = (cartId: number, max?: number) => {
    // short click lock to filter insane double-clicks
    const last = (flushTimerRef.current as any)[`__click_lock_${cartId}`] ?? 0;
    const now = Date.now();
    if (now - last < 60) return; // ignore extremely rapid duplicates
    (flushTimerRef.current as any)[`__click_lock_${cartId}`] = now;

    const server = serverQtyRef.current[cartId] ?? 0;
    const pending = pendingDeltaRef.current[cartId] ?? 0;
    const visible = (quantitiesRef.current[cartId] ?? server) ;
    // compute next visible and delta
    const nextVisible = typeof max === "number" ? Math.min(visible + 1, max) : visible + 1;
    const newDelta = (pending) + (nextVisible - visible);

    pendingDeltaRef.current[cartId] = newDelta;
    const newQty = Math.max(1, server + newDelta);
    setQuantities((prev) => ({ ...prev, [cartId]: newQty }));
    quantitiesRef.current = { ...quantitiesRef.current, [cartId]: newQty };

    // schedule flush
    scheduleFlush(cartId);
  };

  const decrement = (cartId: number) => {
    const last = (flushTimerRef.current as any)[`__click_lock_${cartId}`] ?? 0;
    const now = Date.now();
    if (now - last < 60) return;
    (flushTimerRef.current as any)[`__click_lock_${cartId}`] = now;

    const server = serverQtyRef.current[cartId] ?? 0;
    const pending = pendingDeltaRef.current[cartId] ?? 0;
    const visible = (quantitiesRef.current[cartId] ?? server);
    const nextVisible = Math.max(1, visible - 1);
    const newDelta = pending + (nextVisible - visible);

    pendingDeltaRef.current[cartId] = newDelta;
    const newQty = Math.max(1, server + newDelta);
    setQuantities((prev) => ({ ...prev, [cartId]: newQty }));
    quantitiesRef.current = { ...quantitiesRef.current, [cartId]: newQty };

    scheduleFlush(cartId);
  };

  // when user types absolute value, we apply replace-last semantics:
  const updateQuantity = (cartId: number, newQtyRaw: number, max?: number) => {
    let newQty = Number(newQtyRaw);
    if (Number.isNaN(newQty) || newQty < 1) newQty = 1;
    if (typeof max === "number" && newQty > max) newQty = max;

    // replace any pending delta with delta = newQty - serverQty
    const server = serverQtyRef.current[cartId] ?? 0;
    const delta = Math.max(1, newQty) - server;
    pendingDeltaRef.current[cartId] = delta;
    setQuantities((prev) => ({ ...prev, [cartId]: newQty }));
    quantitiesRef.current = { ...quantitiesRef.current, [cartId]: newQty };

    // clear any prior timer and schedule flush (replace semantics)
    const prevTimer = flushTimerRef.current[cartId];
    if (prevTimer) {
      clearTimeout(prevTimer);
      flushTimerRef.current[cartId] = null;
    }
    scheduleFlush(cartId);
  };

  // --- rest of your existing code: mapping cartWithProduct, groups, UI rendering ---
  const cartWithProduct = useMemo(() => {
    if (!Array.isArray(cartByIdUser) || !Array.isArray(products)) return [];
    return cartByIdUser.map((c: any) => {
      let matchedProduct: any = null;
      let matchedVariant: any = null;
      for (const p of products) {
        if (!Array.isArray(p.varian)) continue;
        const v = p.varian.find((x: any) => String(x.kode_varian) === String(c.kode_varian));
        if (v) { matchedProduct = p; matchedVariant = v; break; }
      }
      const qtyLocal = quantities[c.id] ?? Number(c.qty) ?? 1;
      const price = Number(c.harga) || 0;
      const subtotal = price * qtyLocal;
      return { cartItem: c, product: matchedProduct, variant: matchedVariant, subtotal, qtyLocal, price };
    });
  }, [cartByIdUser, products, quantities]);

  const groups = useMemo(() => {
    const map = new Map<number, { id_jenis: number; nama_jenis: string; items: any[] }>();
    for (const it of cartWithProduct) {
      const ji = Number(it.cartItem.id_jenis ?? 0);
      const nama = it.cartItem.nama_jenis ?? (ji === 2 ? "Poin" : "Uang");
      if (!map.has(ji)) map.set(ji, { id_jenis: ji, nama_jenis: nama, items: [] });
      map.get(ji)!.items.push(it);
    }
    return Array.from(map.values()).sort((a, b) => a.id_jenis - b.id_jenis);
  }, [cartWithProduct]);

  const displayedItems = useMemo(() => {
    if (activeJenis === null) return [];
    return cartWithProduct.filter((it) => Number(it.cartItem.id_jenis ?? 0) === Number(activeJenis));
  }, [cartWithProduct, activeJenis]);

  const totalSelectedValue = useMemo(() => {
    return cartWithProduct.reduce((s: number, it: any) => {
      if (!selected.includes(it.cartItem.id)) return s;
      return s + (it.subtotal || 0);
    }, 0);
  }, [cartWithProduct, selected]);

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

  const toggleSelect = (id: number) => {
    const clicked = cartWithProduct.find((it: any) => it.cartItem.id === id);
    if (!clicked) return;
    const clickedJenis = Number(clicked.cartItem.id_jenis ?? 0);
    if (selected.length === 0) { setSelected([id]); return; }
    const existingJenis = Array.from(selectedJenisSet)[0];
    if (existingJenis !== undefined && Number(existingJenis) !== Number(clickedJenis)) { setSelected([id]); return; }
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (!activeJenis) return;
    const displayedIds = displayedItems.map((it: any) => it.cartItem.id);
    const allSelected = displayedIds.every((id) => selected.includes(id));
    if (allSelected) setSelected((prev) => prev.filter((id) => !displayedIds.includes(id)));
    else {
      const currentJenis = Array.from(selectedJenisSet)[0];
      if (currentJenis !== undefined && Number(currentJenis) !== Number(activeJenis)) setSelected(displayedIds);
      else setSelected((prev) => Array.from(new Set([...prev, ...displayedIds])));
    }
  };

  const confirmDelete = async (cartId: number) => {
    try {
      setDeletingId(cartId);
      try { closeModal(); } catch (e) {}
      setBottomSheetOpen(false);
      const res = await deleteCart(cartId);
      if (!res) { showToast("Gagal menghapus item. Coba lagi.", "error"); return; }
      if (typeof res.success !== "undefined" && res.success === false) { showToast(res.message ?? "Gagal menghapus item.", "error"); return; }
      if (typeof refetch === "function") { await refetch(); }
      setSelected((prev) => prev.filter((id) => id !== cartId));
      showToast(res.message ?? "Item berhasil dihapus dari keranjang.", "success");
      if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("cart:updated", { detail: { userId: cartByIdUser?.[0]?.user_id ?? null } }));
    } catch (err: any) {
      console.error("Gagal menghapus item keranjang:", err);
      showToast(err?.message ?? "Gagal menghapus item. Silakan coba lagi.", "error");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const handleDeleteClick = (cartId: number) => {
    const isSmall = typeof window !== "undefined" ? window.innerWidth < 1024 : true;
    setConfirmId(cartId);
    if (isSmall) setBottomSheetOpen(true);
    else openModal({
      title: "Hapus Item", size: "md", mobileMode: "full",
      content: (
        <div className="space-y-4">
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold">Hapus item dari keranjang?</div>
            <div className="text-xs text-gray-600">Item akan dihapus dan tidak dapat dikembalikan.</div>
          </div>
          <div className="flex justify-end gap-2">
            <Button label="Batal" color="secondary" onClick={() => { try { closeModal(); } catch (e) {} setConfirmId(null); }} />
            <Button label="Hapus" color="primary" onClick={() => confirmDelete(cartId)} />
          </div>
        </div>
      )
    });
  };

  const goToCheckout = () => {
    if (selected.length === 0) { showToast("Pilih item terlebih dahulu.", "error"); return; }
    const items = selected.map((id) => {
      const found = cartWithProduct.find((it: any) => it.cartItem.id === id);
      const ci = found?.cartItem;
      const productObj = found?.product;
      const variant = found?.variant;
      const qty = quantities[id] ?? Number(ci?.qty) ?? 1;
      const unit_price = Number(ci?.harga) || Number(found?.price) || 0;
      const subtotal = unit_price * qty;
      const gambarRel = variant?.gambar ?? productObj?.gambar_utama ?? null;
      const gambar = gambarRel ? `${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${gambarRel}` : null;
      return {
        cart_id: ci?.id, product_id: productObj?.id ?? null, nama_produk: productObj?.nama_produk ?? `Variant ${ci?.kode_varian}`,
        kode_varian: String(ci?.kode_varian ?? ""), warna: variant?.warna ?? null, ukuran: variant?.ukuran ?? null,
        qty, unit_price, subtotal, gambar, stok_varian: variant?.stok ?? null, jenis: ci?.nama_jenis ?? null, user_id: ci?.user_id ?? null,
      };
    });
    try {
      sessionStorage.setItem("checkout_items", JSON.stringify(items));
      sessionStorage.setItem("checkout_items_at", String(Date.now()));
      router.push("/checkout");
    } catch (e) {
      console.error("goToCheckout error:", e);
      showToast("Gagal mempersiapkan checkout.", "error");
    }
  };

  const canCheckout = selectedIsSingleJenis && selected.length > 0;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={String(error)} />;

  // renderTabs + main UI follow your existing markup but using our increment/decrement/updateQuantity
  const renderTabs = () => (
    <div className="flex gap-2 overflow-auto">
      {groups.map((g) => {
        const active = g.id_jenis === activeJenis;
        return (
          <button key={g.id_jenis}
            onClick={() => { setActiveJenis(g.id_jenis); const ids = g.items.map((it: any) => it.cartItem.id); setSelected(ids); }}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${active ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-700 border-gray-200 cursor-pointer"}`}
          >
            {g.nama_jenis} <span className={`ml-1 text-xs ${active ? "text-white" : "text-gray-500"}`}>({g.items.length})</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="pt-[80px] md:pt-[89px] lg:pt-[161px]">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0 pt-0">
        <h1 className="text-2xl font-bold mb-2">Keranjang</h1>
        <h2 className="text-sm font-normal text-gray-500 mb-4">Cek item sebelum melakukan pemesanan</h2>
        {renderTabs()}
      </div>

      {displayedItems.length === 0 ? (
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0 flex flex-col items-center space-y-4">
          <div className="w-48 h-48 flex items-center justify-center mb-4"> {/* illustration */} </div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center">Tidak ada item di tab ini</h3>
          <p className="text-sm text-gray-500 text-center max-w-md">Tidak ada item pada jenis yang dipilih. Coba jenis lain atau tambahkan produk terlebih dahulu.</p>
          <div className="flex items-center gap-3">
            <Link href="/productlist" passHref><Button label="Telusuri Produk" color="primary" /></Link>
            <Link href="/" passHref><Button label="Kembali ke Beranda" color="secondary" /></Link>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 lg:pb-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="col-span-1 lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={displayedItems.length > 0 && displayedItems.every(it => selected.includes(it.cartItem.id))} onChange={toggleSelectAll} className="h-4 w-4" aria-label="Pilih semua item di jenis ini" />
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
                  const isQtyLoading = Boolean(qtyLoading[cartItem.id]);

                  return (
                    <article key={cartItem.id} className="bg-white p-3 md:p-4 rounded-xl shadow-sm flex flex-col gap-2 md:gap-3" aria-labelledby={`cart-item-${cartItem.id}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-1 md:gap-3">
                          <div className="flex items-start gap-3 w-full md:w-auto">
                            <input type="checkbox" checked={selected.includes(cartItem.id)} onChange={() => toggleSelect(cartItem.id)} className="h-4 w-4 mt-1" aria-label={`Pilih item ${cartItem.kode_varian}`} />
                            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-200">
                              {variant?.gambar ? <img src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${variant.gambar}`} alt={product?.nama_produk ?? cartItem.kode_varian} className="w-full h-full object-cover" />
                              : product?.gambar_utama ? <img src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${product.gambar_utama}`} alt={product?.nama_produk} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-xs bg-gray-100 text-gray-500">No Image</div>}
                            </div>
                          </div>

                          <div>
                            <h3 id={`cart-item-${cartItem.id}`} className="text-xs md:text-sm lg:text-md font-semibold leading-tight overflow-hidden text-ellipsis line-clamp-2">{product?.nama_produk ?? `Variant ${cartItem.kode_varian}`}</h3>
                            <div className="mt-1 text-xs text-gray-500 space-y-1">
                              {variant?.warna && <div>Warna: <span className="font-medium text-gray-700">{variant.warna}</span></div>}
                              {variant?.ukuran !== null && variant?.ukuran !== undefined && variant?.ukuran !== "" && (<div>Ukuran: <span className="font-medium text-gray-700">{variant.ukuran}</span></div>)}
                            </div>
                          </div>
                        </div>

                        <button onClick={() => handleDeleteClick(cartItem.id)} disabled={isDeleting} aria-busy={isDeleting} className={`text-sm ${isDeleting ? "text-red-300 cursor-not-allowed" : "text-red-600 hover:text-red-700 cursor-pointer"}`} aria-label={`Hapus ${cartItem.kode_varian}`} title="Hapus item">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => decrement(cartItem.id)} className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100" aria-label={`Kurangi jumlah ${cartItem.kode_varian}`} disabled={isQtyLoading}>{isQtyLoading ? "..." : "–"}</button>

                          <div>
                            <InputField type="number" min={1} max={maxStock} value={qty} onChange={(e) => {
                              const val = Number(e.target.value);
                              if (Number.isNaN(val)) return;
                              updateQuantity(cartItem.id, val, maxStock);
                            }} className="text-center" aria-label={`Jumlah ${cartItem.kode_varian}`} disabled={isQtyLoading} />
                          </div>

                          <button onClick={() => increment(cartItem.id, maxStock)} className="w-9 h-9 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100" aria-label={`Tambah jumlah ${cartItem.kode_varian}`} disabled={isQtyLoading}>{isQtyLoading ? "..." : "+"}</button>
                        </div>

                        <div className="text-xs md:text-sm font-semibold text-right md:text-right">Subtotal: {isPoin ? `${formatDecimal(itemSubtotal)} Poin` : formatPrice(itemSubtotal)}</div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="hidden lg:block col-span-1 lg:col-span-4">
              <div className="lg:sticky lg:top-[160px]">
                <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
                  <div className="text-base md:text-lg lg:text-xl font-semibold text-black">Ringkasan Pesanan</div>
                  <div className="text-sm text-gray-600">Item dipilih: <span className="font-medium">{selected.length}</span></div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-xl font-bold">{selectedIsPoin ? `${formatDecimal(totalSelectedValue)} Poin` : formatPrice(totalSelectedValue)}</div>
                  </div>
                  {!selectedIsSingleJenis && selected.length > 0 && (<div className="text-sm text-red-600">Pilihan harus berasal dari jenis yang sama (Uang atau Poin) untuk melanjutkan ke checkout.</div>)}
                  <div className="flex flex-col gap-2">
                    <Button label="Lanjutkan ke Checkout" color="primary" onClick={() => { if (!canCheckout) return; goToCheckout(); }} disabled={!canCheckout} />
                    <div className="text-xs text-gray-500">Dengan klik "Checkout", Anda telah menyetujui Syarat & Ketentuan</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="container mx-auto">
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-md py-3 px-3 flex items-center justify-between gap-3" style={{ boxShadow: "0 -6px 20px rgba(0,0,0,0.06)" }}>
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Dipilih: <span className="font-medium">{selected.length}</span></span>
              <span className="text-base font-semibold">{selectedIsPoin ? `${formatDecimal(totalSelectedValue)} Poin` : formatPrice(totalSelectedValue)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button label="Checkout" color="primary" onClick={() => { if (!canCheckout) return; goToCheckout(); }} disabled={!canCheckout} />
            </div>
          </div>
        </div>
      </div>

      <BottomSheet open={bottomSheetOpen} onClose={() => { setBottomSheetOpen(false); setConfirmId(null); }}>
        <div className="py-2">
          <div className="text-sm font-semibold mb-2">Hapus item dari keranjang?</div>
          <div className="text-xs text-gray-600 mb-4">Item akan dihapus dan tidak dapat dikembalikan.</div>
          <div className="flex justify-end gap-2">
            <Button label="Batal" color="secondary" onClick={() => { setBottomSheetOpen(false); setConfirmId(null); }} />
            <Button label={deletingId === confirmId ? "Menghapus..." : "Hapus"} color="primary" onClick={() => { if (confirmId != null) confirmDelete(confirmId); }} disabled={deletingId === confirmId} />
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
