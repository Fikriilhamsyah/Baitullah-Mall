"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Hooks
import { useAuth } from "@/context/AuthContext";
import { useProductById } from "@hooks/useProductById";
import { ReviewsData } from "@/data/ReviewsData";
import { usePostCart } from "@/hooks/useCartPost";
import usePoin from "@/hooks/usePoin";

// Types
import { IPostCart } from "@/types/ICart";

// Components
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import BottomSheet from "@/components/ui/BottomSheet";
import { InputField } from "@/components/ui/InputField";
import ProductImageGallery from "./ProductImageGallery";
import ProductReviewCard from "./ProductReviewCard";
import Pagination from "@/components/ui/Pagination";
import SignIn from '@components/features/auth/SignIn';
import { useToast } from "@/components/ui/Toast";

// Context
import { useModal } from "@/context/ModalContext";

// Utils
import { formatPrice } from "@/utils/formatters";
import { formatDecimal } from "@/utils/formatDecimal";

// Icon
import { ShoppingCart, Star, MessageCircleMore } from "lucide-react";

interface ProductDetailProps {
  id: number;
  nama_produk: string;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id, nama_produk, onBack }) => {
  const router = useRouter();
  const { product, loading, error } = useProductById(id);
  const { poin, loading: poinLoading, error: poinError, refetch } = usePoin();
  const user = useAuth((state) => state.user);
  const { postCart, loading: postCartLoading } = usePostCart();
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);
  const { showToast } = useToast();

  const isLoggedIn = !!user;

  /* STATE HOOKS */
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  /* CONSTANTS */
  const REVIEWS_PER_PAGE = 8;

  /* GROUP VARIANTS
     - Jika product.varian === null -> buat satu "pseudo-varian" dari product agar UI tetap bekerja
     - Sekarang menyertakan `berat` pada setiap ukuran supaya bisa dikirim ke cart/checkout
  */
  const groupVariants = () => {
    if (!product || !product.varian) {
      const single: Record<
        string,
        {
          kode: string;
          sizes: Array<{
            ukuran: string | null;
            tambahan_harga: number;
            varian_id: number | null;
            stok: number;
            berat: number | null;
          }>;
        }
      > = {
        Default: {
          kode: "#f3f3f3",
          sizes: [
            {
              ukuran: null,
              tambahan_harga: 0,
              varian_id: null,
              stok: product?.stok ?? 0,
              berat: null,
            },
          ],
        },
      };

      return {
        colors: ["Default"],
        map: single,
      };
    }

    const map: Record<
      string,
      {
        kode: string;
        sizes: Array<{
          ukuran: string | null;
          tambahan_harga: number;
          varian_id: number;
          stok: number;
          berat: number | null;
        }>;
      }
    > = {};

    product.varian.forEach((v: any) => {
      const warnaKey = v.warna ?? "Default";

      if (!map[warnaKey]) {
        map[warnaKey] = {
          kode: v.kode_warna || "#f3f3f3",
          sizes: [],
        };
      }

      map[warnaKey].sizes.push({
        ukuran: v.ukuran?.toString() ?? null,
        tambahan_harga: v.tambahan_harga ?? 0,
        varian_id: v.id ?? null,
        stok: v.stok ?? 0,
        berat: v.berat ?? null, // <-- tambahkan berat di sini
      });
    });

    return {
      colors: Object.keys(map),
      map,
    };
  };

  const { colors, map: groupedVariants } = groupVariants();

  /* SELECTED VARIAN CALC */
  const selectedVarian =
    selectedColor && selectedSize !== undefined
      ? groupedVariants[selectedColor]?.sizes.find((s) => s.ukuran === selectedSize) ??
        groupedVariants[selectedColor]?.sizes.find((s) => s.ukuran === null) ??
        null
      : null;

  /* DEFAULT PILIHAN VARIAN */
  useEffect(() => {
    if (!product) return;

    if (colors && colors.length > 0) {
      if (!selectedColor) {
        setSelectedColor(colors[0]);
      }

      const colorToUse = selectedColor ?? colors[0];
      const sizesForColor = groupedVariants[colorToUse]?.sizes ?? [];

      if (sizesForColor.length > 0) {
        const defaultSize = sizesForColor[0].ukuran ?? null;
        setSelectedSize(defaultSize);
      } else {
        setSelectedSize(null);
      }
    } else {
      setSelectedColor(null);
      setSelectedSize(null);
    }

    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  /* RESET QTY SAAT PILIH VARIAN */
  useEffect(() => {
    const stok = selectedVarian?.stok ?? product?.stok ?? 0;
    setQuantity((prev) => {
      if (stok <= 0) return 1;
      if (prev > stok) return stok;
      if (prev < 1) return 1;
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVarian]);

  /* CALCULATE PRICE */
  const unitPrice = (() => {
    if (!product) return 0;
    const base = product.harga ?? 0;
    const tambahan = selectedVarian?.tambahan_harga ?? 0;
    return base + tambahan;
  })();

  const calculateTotalPrice = () => unitPrice * quantity;
  const totalPrice = calculateTotalPrice();

  /* STOK */
  const totalStok =
    product?.varian && Array.isArray(product.varian)
      ? product.varian.reduce((a: number, b: any) => a + (b?.stok ?? 0), 0)
      : product?.stok ?? 0;

  const stokVarian = selectedVarian?.stok ?? (product?.stok ?? 0);

  /* REVIEWS PAGINATION */
  const totalReviewPages = Math.ceil(ReviewsData.length / REVIEWS_PER_PAGE);
  const paginatedReviews = ReviewsData.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

  const handlePostCart = async () => {
    const currentUser = useAuth.getState().user;

    if (!currentUser) {
      openModal({
        title: "Masuk",
        size: "md",
        mobileMode: "full",
        content: (<SignIn />),
      });
      return;
    }

    if (!product) {
      showToast("Produk tidak tersedia.", "error");
      return;
    }

    if ((stokVarian ?? 0) <= 0) {
      showToast("Stok varian ini sudah habis.", "error");
      return;
    }

    // tentukan kodeVarian
    let kodeVarian: string = "...";
    if (selectedVarian && selectedVarian.varian_id != null && Array.isArray(product.varian)) {
      const found = product.varian.find((v: any) => Number(v.id) === Number(selectedVarian.varian_id));
      kodeVarian = found?.kode_varian ?? String(found?.id ?? "");
    } else if (Array.isArray(product.varian) && product.varian.length === 1) {
      kodeVarian = product.varian[0]?.kode_varian ?? String(product.varian[0]?.id ?? "");
    } else {
      kodeVarian = (product as any).kode_produk ?? String(product.id ?? product.nama_produk ?? "unknown");
    }

    // hitung berat per item (ambil dari selectedVarian.berat -> jika null fallback 0)
    const beratPerItem =
      (selectedVarian && typeof selectedVarian.berat === "number")
        ? selectedVarian.berat
        : Array.isArray(product?.varian) && product.varian.length === 1
        ? (product.varian[0]?.berat ?? 0)
        : 0;

    const payload: IPostCart = {
      user_id: currentUser.id,
      kode_varian: String(kodeVarian),
      qty: Math.max(1, Math.min(quantity, stokVarian)),
      harga: unitPrice,
      // tambahan: sertakan berat per item
      // @ts-ignore - IPostCart mungkin tidak mendefinisikan berat; jika perlu tambahkan ke type IPostCart
      berat: beratPerItem,
    };

    try {
      const result = await postCart(payload);
      showToast("Berhasil ditambahkan ke keranjang.", "success");
    } catch (err: any) {
      const message = err?.message ?? "Gagal menambahkan ke keranjang.";
      showToast(message, "error");
    } finally {
      setOpenA(false);
      setOpenB(false);
    }
  };

  const myPoinEntry = React.useMemo(() => {
    if (!Array.isArray(poin) || !user) return null;
    return poin.find((p) => Number(p.id_users) === Number(user.id)) ?? null;
  }, [poin, user]);

  const myPoinNumber = React.useMemo(() => {
    if (!myPoinEntry) return 0;
    const n = Number(myPoinEntry.total_score_sum);
    return Number.isNaN(n) ? 0 : n;
  }, [myPoinEntry]);

  // ---------- POINTS CHECK ----------
  const isPoin = String(product?.jenis?.nama_jenis ?? "").toLowerCase() === "poin";
  const needsPoints = isPoin;
  const hasEnoughPoints = !needsPoints ? true : myPoinNumber >= totalPrice;
  // -----------------------------------

  // ---------- NEW: prepare checkout payload and navigate ----------
  const goToCheckout = () => {
    if (!product) {
      showToast("Produk tidak ditemukan.", "error");
      return;
    }

    if (!isLoggedIn) {
      openModal({
        title: "Masuk",
        size: "md",
        mobileMode: "full",
        content: (<SignIn />),
      });
      return;
    }

    if ((stokVarian ?? 0) <= 0) {
      showToast("Stok varian ini sudah habis.", "error");
      return;
    }

    // if this purchase requires points, ensure user has enough
    if (needsPoints && !hasEnoughPoints) {
      showToast("Poin Anda tidak cukup untuk membeli produk ini.", "error");
      return;
    }

    // compute kode_varian similar to handlePostCart
    let kodeVarian: string = "...";
    if (selectedVarian && selectedVarian.varian_id != null && Array.isArray(product.varian)) {
      const found = product.varian.find((v: any) => Number(v.id) === Number(selectedVarian.varian_id));
      kodeVarian = found?.kode_varian ?? String(found?.id ?? "");
    } else if (Array.isArray(product.varian) && product.varian.length === 1) {
      kodeVarian = product.varian[0]?.kode_varian ?? String(product.varian[0]?.id ?? "");
    } else {
      kodeVarian = (product as any).kode_produk ?? String(product.id ?? product.nama_produk ?? "unknown");
    }

    // --- NEW: choose gambar (variant gambar if present, otherwise product.gambar_utama)
    let gambarRel: string | null = null;
    if (selectedVarian && selectedVarian.varian_id != null && Array.isArray(product.varian)) {
      const found = product.varian.find((v: any) => Number(v.id) === Number(selectedVarian.varian_id));
      if (found?.gambar) gambarRel = found.gambar;
    }
    if (!gambarRel) {
      gambarRel = product.gambar_utama ?? null;
    }
    const gambar = gambarRel ? `${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${gambarRel}` : null;
    // --- END gambar logic

    // berat per item dan total berat
    const beratPerItem =
      (selectedVarian && typeof selectedVarian.berat === "number")
        ? selectedVarian.berat
        : Array.isArray(product?.varian) && product.varian.length === 1
        ? (product.varian[0]?.berat ?? 0)
        : 0;

    const item = {
      product_id: product.id,
      nama_produk: product.nama_produk,
      kode_varian: String(kodeVarian),
      warna: selectedColor ?? null,
      ukuran: selectedSize ?? null,
      qty: Math.max(1, Math.min(quantity, stokVarian)),
      unit_price: unitPrice,
      subtotal: unitPrice * Math.max(1, Math.min(quantity, stokVarian)),
      gambar, // full url or null
      stok_varian: stokVarian,
      jenis: product.jenis?.nama_jenis ?? "uang",
      berat_per_item: beratPerItem,
      total_berat: beratPerItem * Math.max(1, Math.min(quantity, stokVarian)),
    };

    // persist to sessionStorage so checkout page can read it
    try {
      const list = [item];
      sessionStorage.setItem("checkout_items", JSON.stringify(list));
      // also set a timestamp so checkout knows it's fresh
      sessionStorage.setItem("checkout_items_at", String(Date.now()));
      router.push("/checkout");
    } catch (e) {
      console.error("Failed to set checkout payload:", e);
      showToast("Gagal mempersiapkan checkout.", "error");
    }
  };
  // ---------- END new ----------

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  return (
    <div className="">
      {/* GALLERY MOBILE */}
      <ProductImageGallery images={product} name={product.nama_produk} layout="mobile" />
      {/* --- Harga: tampilkan min & max harga varian --- */}
      <div className="block lg:hidden container mx-auto px-4 md:px-6 py-4 md:py-6">
        {(() => {
          const base = product.harga ?? 0;
          const variantPrices =
            Array.isArray(product.varian) && product.varian.length > 0
              ? product.varian.map((v: any) => base + (v.tambahan_harga ?? 0))
              : [base];

          const minPrice = Math.min(...variantPrices);
          const maxPrice = Math.max(...variantPrices);

          const isPoinLocal = String(product.jenis?.nama_jenis ?? "").toLowerCase() === "poin";
          const format = (val: number) => (isPoinLocal ? String(val) : formatPrice(val));

          return (
            <div>
              <p className="text-md text-gray-500">Harga</p>
              <p className="text-md font-extrabold text-[#299A4D]">
                {format(minPrice)} - {format(maxPrice)}{" "}
                <span className="text-base text-gray-500 font-normal">
                  {isPoinLocal ? "Poin" : "IDR"}
                </span>
              </p>
            </div>
          );
        })()}
      </div>

      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 pt-0 lg:pt-[161px]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="col-span-8">
              <div className="grid md:grid-cols-12 gap-0 lg:gap-8 border-b border-neutral-200 pb-8">
                {/* GALLERY DESKTOP */}
                <div className="lg:col-span-4">
                  <ProductImageGallery images={product} name={product.nama_produk} layout="desktop" />
                </div>

                {/* DETAIL PRODUK */}
                <div className="lg:col-span-8 space-y-5">
                  <div className="w-full">
                    <div className="text-sm text-[#299A4D] mb-1 w-full">
                      {product.kategori.nama_kategori}
                    </div>

                    <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-2 w-full">{product.nama_produk}</h1>

                    <div className="flex items-center gap-4 mb-3 w-full">
                      <p className="text-gray-600 text-sm">
                        Stok Total: <span className="font-semibold">{totalStok}</span>
                      </p>
                    </div>
                  </div>

                  {/* VARIAN WARNA */}
                  {colors.length > 0 && (
                    <div className="hidden lg:block">
                      <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Warna:</label>

                      <div className="flex flex-wrap gap-3">
                        {colors.map((colorName) => {
                          const colorObj = groupedVariants[colorName];
                          const colorCode = colorObj?.kode || "#f3f3f3";

                          const selected = selectedColor === colorName;

                          return (
                            <div key={colorName} className="flex flex-col items-center">
                              <button
                                onClick={() => {
                                  setSelectedColor(colorName);
                                  const firstSize = colorObj?.sizes?.[0]?.ukuran ?? null;
                                  setSelectedSize(firstSize);
                                  setQuantity(1);
                                }}
                                className={`w-10 h-10 rounded-full border-2 transition-all ${selected ? "ring-2 ring-neutral-300" : ""
                                  }`}
                                style={{
                                  backgroundColor: colorCode,
                                  borderColor: selected ? "#d1d5db" : "#ccc",
                                }}
                                title={colorName}
                              />
                              <span className="text-xs mt-1 text-gray-600">{colorName}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* VARIAN UKURAN */}
                  {selectedColor && groupedVariants[selectedColor] && groupedVariants[selectedColor].sizes.some((s) => s.ukuran !== null) && (
                    <div className="hidden lg:block">
                      <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Ukuran:</label>

                      <div className="flex gap-2 flex-wrap">
                        {groupedVariants[selectedColor].sizes.map((sizeObj) => {
                          const selected = selectedSize === sizeObj.ukuran;

                          return (
                            <button
                              key={String(sizeObj.ukuran)}
                              onClick={() => {
                                setSelectedSize(sizeObj.ukuran);
                                setQuantity(1);
                              }}
                              className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selected
                                ? "bg-[#299A4D] text-white border-[#299A4D]"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                              {sizeObj.ukuran ?? "Satu Ukuran"}
                              {sizeObj.tambahan_harga > 0 && (
                                <span className="ml-1 text-xs text-gray-200">
                                  (+{formatPrice(sizeObj.tambahan_harga)})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* DESKRIPSI */}
                  <div>
                    <p className="text-xl font-bold text-gray-900 block mb-1">Deskripsi</p>
                    <p className="text-sm text-gray-700">{product.deskripsi}</p>
                  </div>
                </div>
              </div>

              {/* REVIEW */}
              <div className="mt-8">
                <p className="text-xl font-bold text-gray-900 block mb-1">Ulasan</p>
                {paginatedReviews.map((review) => (
                  <ProductReviewCard key={review.id} review={review} />
                ))}

                {totalReviewPages > 1 && (
                  <Pagination currentPage={reviewPage} totalPages={totalReviewPages} onPageChange={(page) => setReviewPage(page)} />
                )}
              </div>
            </div>

            {/* SIDEBAR HARGA DESKTOP */}
            <div className="hidden lg:block lg:col-span-4 sticky top-[160px] self-start">
              <div className="bg-white rounded-xl shadow p-4 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Harga Total</p>
                  <p className="text-2xl font-extrabold text-[#299A4D]">
                    {isPoin ? formatDecimal(totalPrice) : formatPrice(totalPrice)}{" "}
                    <span className="text-base text-gray-500 font-normal">{isPoin ? "Poin" : "IDR"}</span>
                  </p>

                  {isPoin && (
                    <div className="mt-2 text-sm text-gray-600">
                      <div>Poin Anda: <span className="font-medium">{formatDecimal(myPoinNumber)}</span></div>
                      {!hasEnoughPoints && (
                        <div className="mt-1 text-sm text-red-500">Poin tidak cukup untuk membeli item ini.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* JUMLAH */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Jumlah Pembelian</label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setQuantity((prev) => {
                          if (prev <= 1) return 1;
                          return prev - 1;
                        })
                      }
                      className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
                      aria-label="Kurangi jumlah"
                    >
                      –
                    </button>

                    <div className="flex-1">
                      <InputField
                        type="number"
                        min={1}
                        max={stokVarian}
                        value={quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const raw = e.target.value;
                          const val = Number(raw);

                          if (Number.isNaN(val)) return;

                          if (val < 1) return setQuantity(1);
                          if (val > stokVarian) return setQuantity(stokVarian);

                          setQuantity(val);
                        }}
                        className="text-center"
                      />
                    </div>

                    <button
                      onClick={() =>
                        setQuantity((prev) => {
                          if (stokVarian <= 0) return prev;
                          if (prev >= stokVarian) return stokVarian;
                          return prev + 1;
                        })
                      }
                      className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
                      aria-label="Tambah jumlah"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Sisa stok varian: <span className="font-medium">{stokVarian}</span>
                  </p>
                </div>

                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Button
                      label="Beli Sekarang"
                      fullWidth
                      color="primary"
                      disabled={stokVarian <= 0 || (isPoin && !hasEnoughPoints)}
                      onClick={goToCheckout}
                    />
                    <Button
                      label="Tambahkan ke Keranjang"
                      iconRight={ShoppingCart}
                      fullWidth
                      color="custom"
                      customColor={{
                        bg: "bg-white",
                        text: "text-primary-500",
                        border: "text-primary-500",
                        hoverBg: "bg-primary-500",
                        hoverText: "text-white",
                      }}
                      onClick={() => {
                        if (stokVarian <= 0) return;
                        handlePostCart();
                      }}
                    />
                    <Button
                      label="Chat"
                      iconRight={MessageCircleMore}
                      fullWidth
                      color="custom"
                      customColor={{
                        bg: "bg-white",
                        text: "text-primary-500",
                        border: "text-primary-500",
                        hoverBg: "bg-primary-500",
                        hoverText: "text-white",
                      }}
                    />
                  </div>
                ) : (
                  <Button
                    label="Masuk untuk beli sekarang"
                    fullWidth
                    color="primary"
                    onClick={() => {
                      openModal({
                        title: "Masuk",
                        size: "md",
                        mobileMode: "normal",
                        content: (<SignIn />),
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER HARGA MOBILE */}
      <div className="w-full block lg:hidden mt-8">
        <div
          className="fixed bottom-0 z-10 w-full bg-white/80 backdrop-blur-md border-t border-gray-200"
          style={{ boxShadow: "0 -6px 18px rgba(177,177,177,0.25)" }}
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            {isLoggedIn ? (
              <div className="flex gap-3">
                <Button
                  iconRight={MessageCircleMore}
                  color="custom"
                  customColor={{
                    bg: "bg-white",
                    text: "text-primary-500",
                    border: "text-primary-500",
                    hoverBg: "bg-primary-500",
                    hoverText: "text-white",
                  }}
                />
                <Button
                  iconRight={ShoppingCart}
                  color="custom"
                  customColor={{
                    bg: "bg-white",
                    text: "text-primary-500",
                    border: "text-primary-500",
                    hoverBg: "bg-primary-500",
                    hoverText: "text-white",
                  }}
                  onClick={() => setOpenA(true)}
                />
                <Button
                  label={isPoin ? `Beli Sekarang (${formatDecimal(totalPrice)} Poin)` : "Beli Sekarang"}
                  color="primary"
                  fullWidth
                  onClick={() => setOpenB(true)}
                  disabled={stokVarian <= 0 || (isPoin && !hasEnoughPoints)}
                />
              </div>
            ) : (
              <Button
                label="Masuk untuk beli sekarang"
                fullWidth
                color="primary"
                onClick={() => {
                  openModal({
                    title: "Masuk",
                    size: "md",
                    mobileMode: "full",
                    content: (<SignIn />),
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* cart */}
      <BottomSheet open={openA} onClose={() => setOpenA(false)}>
        <div className="flex flex-col gap-4">
          {/* HARGA */}
          <div>
            <p className="text-xs text-gray-500">Harga Total</p>
            <p className="text-md font-extrabold text-[#299A4D]">
              {isPoin ? formatDecimal(totalPrice) : formatPrice(totalPrice)}{" "}
              <span className="text-base text-gray-500 font-normal">{isPoin ? "Poin" : "IDR"}</span>
            </p>
            {isPoin && (
              <>
                <div className="text-sm text-gray-600">Poin Anda: <span className="font-medium">{formatDecimal(myPoinNumber)}</span></div>
                {!hasEnoughPoints && <div className="text-sm text-red-500">Poin tidak cukup.</div>}
              </>
            )}
          </div>

          {/* VARIAN WARNA (BottomSheet) */}
          {colors.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Warna:</label>

              <div className="flex flex-wrap gap-3">
                {colors.map((colorName) => {
                  const colorObj = groupedVariants[colorName];
                  const colorCode = colorObj?.kode || "#f3f3f3";

                  const selected = selectedColor === colorName;

                  return (
                    <div key={colorName} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedColor(colorName);
                          const firstSize = colorObj?.sizes?.[0]?.ukuran ?? null;
                          setSelectedSize(firstSize);
                          setQuantity(1);
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selected ? "ring-2 ring-neutral-300" : ""
                          }`}
                        style={{
                          backgroundColor: colorCode,
                          borderColor: selected ? "#d1d5db" : "#ccc",
                        }}
                        title={colorName}
                      />
                      <span className="text-xs mt-1 text-gray-600">{colorName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VARIAN UKURAN (BottomSheet) */}
          {selectedColor && groupedVariants[selectedColor] && groupedVariants[selectedColor].sizes.some((s) => s.ukuran !== null) && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Ukuran:</label>

              <div className="flex gap-2 flex-wrap">
                {groupedVariants[selectedColor].sizes.map((sizeObj) => {
                  const selected = selectedSize === sizeObj.ukuran;

                  return (
                    <button
                      key={String(sizeObj.ukuran)}
                      onClick={() => {
                        setSelectedSize(sizeObj.ukuran);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selected
                        ? "bg-[#299A4D] text-white border-[#299A4D]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {sizeObj.ukuran ?? "Satu Ukuran"}
                      {sizeObj.tambahan_harga > 0 && (
                        <span className="ml-1 text-xs text-gray-200">(+{formatPrice(sizeObj.tambahan_harga)})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* JUMLAH */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Jumlah Pembelian</label>

            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all">
                –
              </button>

              <div className="flex-1">
                <InputField
                  type="number"
                  min={1}
                  max={stokVarian}
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const raw = e.target.value;
                    const val = Number(raw);

                    if (Number.isNaN(val)) return;

                    if (val < 1) return setQuantity(1);
                    if (val > stokVarian) return setQuantity(stokVarian);

                    setQuantity(val);
                  }}
                  className="text-center"
                />
              </div>

              <button
                onClick={() =>
                  setQuantity((prev) => {
                    if (stokVarian <= 0) return prev;
                    if (prev >= stokVarian) return stokVarian;
                    return prev + 1;
                  })
                }
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Sisa stok varian: <span className="font-medium">{stokVarian}</span>
            </p>
          </div>

          <Button label="Tambahkan ke Keranjang" iconRight={ShoppingCart} color="primary" onClick={() => {setOpenA(false); handlePostCart();}} />
        </div>
      </BottomSheet>

      {/* checkout */}
      <BottomSheet open={openB} onClose={() => setOpenB(false)}>
        <div className="flex flex-col gap-4">
          {/* HARGA */}
          <div>
            <p className="text-xs text-gray-500">Harga Total</p>
            <p className="text-md font-extrabold text-[#299A4D]">
              {isPoin ? formatDecimal(totalPrice) : formatPrice(totalPrice)}{" "}
              <span className="text-base text-gray-500 font-normal">{isPoin ? "Poin" : "IDR"}</span>
            </p>

            {isPoin && (
              <>
                <div className="text-sm text-gray-600">Poin Anda: <span className="font-medium">{formatDecimal(myPoinNumber)}</span></div>
                {!hasEnoughPoints && <div className="text-sm text-red-500">Poin tidak cukup.</div>}
              </>
            )}
          </div>

          {/* VARIAN WARNA */}
          {colors.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Warna:</label>

              <div className="flex flex-wrap gap-3">
                {colors.map((colorName) => {
                  const colorObj = groupedVariants[colorName];
                  const colorCode = colorObj?.kode || "#f3f3f3";

                  const selected = selectedColor === colorName;

                  return (
                    <div key={colorName} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedColor(colorName);
                          const firstSize = colorObj?.sizes?.[0]?.ukuran ?? null;
                          setSelectedSize(firstSize);
                          setQuantity(1);
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selected ? "ring-2 ring-neutral-300" : ""
                          }`}
                        style={{
                          backgroundColor: colorCode,
                          borderColor: selected ? "#d1d5db" : "#ccc",
                        }}
                        title={colorName}
                      />
                      <span className="text-xs mt-1 text-gray-600">{colorName}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VARIAN UKURAN */}
          {selectedColor && groupedVariants[selectedColor] && groupedVariants[selectedColor].sizes.some((s) => s.ukuran !== null) && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Ukuran:</label>

              <div className="flex gap-2 flex-wrap">
                {groupedVariants[selectedColor].sizes.map((sizeObj) => {
                  const selected = selectedSize === sizeObj.ukuran;

                  return (
                    <button
                      key={String(sizeObj.ukuran)}
                      onClick={() => {
                        setSelectedSize(sizeObj.ukuran);
                        setQuantity(1);
                      }}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${selected
                        ? "bg-[#299A4D] text-white border-[#299A4D]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {sizeObj.ukuran ?? "Satu Ukuran"}
                      {sizeObj.tambahan_harga > 0 && (
                        <span className="ml-1 text-xs text-gray-200">(+{formatPrice(sizeObj.tambahan_harga)})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* JUMLAH */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Jumlah Pembelian</label>

            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all">
                –
              </button>

              <div className="flex-1">
                <InputField
                  type="number"
                  min={1}
                  max={stokVarian}
                  value={quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const raw = e.target.value;
                    const val = Number(raw);

                    if (Number.isNaN(val)) return;

                    if (val < 1) return setQuantity(1);
                    if (val > stokVarian) return setQuantity(stokVarian);

                    setQuantity(val);
                  }}
                  className="text-center"
                />
              </div>

              <button
                onClick={() =>
                  setQuantity((prev) => {
                    if (stokVarian <= 0) return prev;
                    if (prev >= stokVarian) return stokVarian;
                    return prev + 1;
                  })
                }
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Sisa stok varian: <span className="font-medium">{stokVarian}</span>
            </p>
          </div>

          <Button
            label={isPoin ? `Beli Sekarang (${formatDecimal(totalPrice)} Poin)` : "Beli Sekarang"}
            color="primary"
            onClick={() => { setOpenB(false); goToCheckout(); }}
            disabled={stokVarian <= 0 || (isPoin && !hasEnoughPoints)}
          />
        </div>
      </BottomSheet>
    </div>
  );
};

export default ProductDetail;
