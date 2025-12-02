"use client";
import React, { useState, useEffect } from "react";

// Hooks
import { useAuth } from "@/context/AuthContext";
import { useProductById } from "@hooks/useProductById";
import { ReviewsData } from "@/data/ReviewsData";

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

// Context
import { useModal } from "@/context/ModalContext";

// Utils
import { formatPrice } from "@/utils/formatters";

// Icon
import { ShoppingCart, Star, MessageCircleMore } from "lucide-react";

interface ProductDetailProps {
  id: number;
  nama_produk: string;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id, nama_produk, onBack }) => {
  const { product, loading, error } = useProductById(id);
  const user = useAuth((state) => state.user);
  const openModal = useModal((s) => s.openModal);
  const closeModal = useModal((s) => s.closeModal);

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
  */
  const groupVariants = () => {
    // jika tidak ada varian, return satu varian default berdasarkan product
    if (!product || !product.varian) {
      // fallback: gunakan product.stok sebagai stok tunggal, warna null/Default
      const single: Record<
        string,
        {
          kode: string;
          sizes: Array<{
            ukuran: string | null;
            tambahan_harga: number;
            varian_id: number | null;
            stok: number;
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
        // jika ukuran null (satu varian tanpa ukuran), cari ukuran null
        groupedVariants[selectedColor]?.sizes.find((s) => s.ukuran === null) ??
        null
      : null;

  /* DEFAULT PILIHAN VARIAN */
  useEffect(() => {
    if (!product) return;

    // jika ada varian (grouped colors lebih dari 0)
    if (colors && colors.length > 0) {
      // set default warna hanya jika belum ada pilihan
      if (!selectedColor) {
        setSelectedColor(colors[0]);
      }

      // set default ukuran dari warna yang terpilih / pertama
      const colorToUse = selectedColor ?? colors[0];
      const sizesForColor = groupedVariants[colorToUse]?.sizes ?? [];

      if (sizesForColor.length > 0) {
        // pilih ukuran pertama yang bukan undefined (bisa null)
        const defaultSize = sizesForColor[0].ukuran ?? null;
        setSelectedSize(defaultSize);
      } else {
        setSelectedSize(null);
      }
    } else {
      // tidak ada varian (seharusnya tidak terjadi karena groupVariants membuat Default),
      // tetapi aman untuk fallback:
      setSelectedColor(null);
      setSelectedSize(null);
    }

    // reset qty saat produk berubah
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  /* RESET QTY SAAT PILIH VARIAN */
  useEffect(() => {
    // saat varian berubah, pastikan quantity tidak melebihi stok varian dan minimal 1
    const stok = selectedVarian?.stok ?? product?.stok ?? 0;
    setQuantity((prev) => {
      if (stok <= 0) return 1;
      if (prev > stok) return stok;
      if (prev < 1) return 1;
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVarian]);

  /* CALCULATE PRICE (unitPrice = product.harga + varian.tambahan_harga jika ada) */
  const unitPrice = (() => {
    if (!product) return 0;
    const base = product.harga ?? 0;
    const tambahan = selectedVarian?.tambahan_harga ?? 0;
    return base + tambahan;
  })();

  const calculateTotalPrice = () => {
    return unitPrice * quantity;
  };

  const totalPrice = calculateTotalPrice();

  /* STOK
     - totalStok: jumlah seluruh varian jika ada; jika tidak ada varian, gunakan product.stok
     - stokVarian: stok dari varian yang dipilih; jika tidak ada varian, fallback ke product.stok
  */
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  console.log(`selectedColor ${selectedColor} \nselectedSize ${selectedSize} \nquantity ${quantity} \ntotalPrice ${totalPrice}`);

  return (
    <div className="">
      {/* GALLERY MOBILE */}
      <ProductImageGallery images={product} name={product.nama_produk} layout="mobile" />

      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 pt-0 lg:pt-[161px]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="col-span-8">
              <div className="grid md:grid-cols-12 gap-8 border-b border-neutral-200 pb-8">
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

                    <h1 className="text-3xl font-bold text-gray-900 mb-2 w-full">{product.nama_produk}</h1>

                    <div className="flex items-center gap-4 mb-3 w-full">
                      {/* <div className="flex items-center text-yellow-500">
                        <Star className="w-5 h-5 fill-yellow-400" />
                        <span className="ml-1 text-gray-700 font-medium">
                          {product.rating?.toFixed(1) ?? "0.0"}
                        </span>
                      </div> */}

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
                          const colorCode = colorObj?.kode || "#f3f3f3"; // ambil dari varian.kode_warna

                          const selected = selectedColor === colorName;

                          return (
                            <div key={colorName} className="flex flex-col items-center">
                              <button
                                onClick={() => {
                                  setSelectedColor(colorName);
                                  // pilih ukuran pertama yang tersedia untuk warna tersebut
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
                    {product.jenis.nama_jenis === "poin" ? totalPrice : formatPrice(totalPrice)}{" "}
                    <span className="text-base text-gray-500 font-normal">{product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}</span>
                  </p>
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
                        onChange={(e) => {
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
                    <Button label="Beli Sekarang" fullWidth color="primary" disabled={stokVarian <= 0} />
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
                        // contoh handler: pastikan quantity <= stokVarian
                        if (stokVarian <= 0) return;
                        const qty = Math.min(quantity, stokVarian);
                        // TODO: panggil fungsi tambah keranjang dengan { product, varian: selectedVarian, qty }
                        setOpenA(true); // tetap buka bottomsheet sebagai contoh
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
          className="fixed bottom-0 z-10 w-full bg-white/80 backdrop-blur-md"
          style={{ boxShadow: "0 -6px 18px rgba(177,177,177,0.25)" }}
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            <div>
              <p className="text-xs text-gray-500">Harga Total</p>
              <p className="text-md font-extrabold text-[#299A4D]">
                {product.jenis.nama_jenis === "poin" ? totalPrice : formatPrice(totalPrice)}{" "}
                <span className="text-base text-gray-500 font-normal">{product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}</span>
              </p>
            </div>

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
                  label="Beli Sekarang"
                  color="primary"
                  fullWidth
                  onClick={() => setOpenB(true)}
                  disabled={stokVarian <= 0}
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

      <BottomSheet open={openA} onClose={() => setOpenA(false)}>
        <div className="flex flex-col gap-4">
          {/* HARGA */}
          <div>
            <p className="text-xs text-gray-500">Harga Total</p>
            <p className="text-md font-extrabold text-[#299A4D]">
              {product.jenis.nama_jenis === "poin" ? totalPrice : formatPrice(totalPrice)}{" "}
              <span className="text-base text-gray-500 font-normal">{product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}</span>
            </p>
          </div>

          {/* VARIAN WARNA (BottomSheet) */}
          {colors.length > 0 && (
            <div className="hidden lg:block">
              <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Warna:</label>

              <div className="flex flex-wrap gap-3">
                {colors.map((colorName) => {
                  const colorObj = groupedVariants[colorName];
                  const colorCode = colorObj?.kode || "#f3f3f3"; // ambil dari varian.kode_warna

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
              <button
                onClick={() =>
                  setQuantity((prev) => {
                    if (prev <= 1) return 1;
                    return prev - 1;
                  })
                }
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
              >
                –
              </button>

              <div className="flex-1">
                <InputField
                  type="number"
                  value={quantity}
                  min={1}
                  max={stokVarian}
                  onChange={(e) => {
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

          <Button label="Masukkan Keranjang" iconRight={ShoppingCart} color="primary" onClick={() => setOpenA(false)} />
        </div>
      </BottomSheet>

      <BottomSheet open={openB} onClose={() => setOpenB(false)}>
        <div className="flex flex-col gap-4">
          {/* HARGA */}
          <div>
            <p className="text-xs text-gray-500">Harga Total</p>
            <p className="text-md font-extrabold text-[#299A4D]">
              {product.jenis.nama_jenis === "poin" ? totalPrice : formatPrice(totalPrice)}{" "}
              <span className="text-base text-gray-500 font-normal">{product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}</span>
            </p>
          </div>

          {/* VARIAN WARNA */}
          {colors.length > 0 && (
            <div className="hidden lg:block">
              <label className="text-sm font-medium text-gray-700 block mb-2">Pilih Warna:</label>

              <div className="flex flex-wrap gap-3">
                {colors.map((colorName) => {
                  const colorObj = groupedVariants[colorName];
                  const colorCode = colorObj?.kode || "#f3f3f3"; // ambil dari varian.kode_warna

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
                  onChange={(e) => {
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

          <Button label="Beli Sekarang" color="primary" onClick={() => setOpenB(false)} disabled={stokVarian <= 0} />
        </div>
      </BottomSheet>
    </div>
  );
};

export default ProductDetail;
