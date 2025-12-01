"use client";
import React, { useState, useEffect } from "react";

// Hooks
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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // PAGINATION REVIEW
  const REVIEWS_PER_PAGE = 8;
  const [reviewPage, setReviewPage] = useState(1);

  const totalReviewPages = Math.ceil(ReviewsData.length / REVIEWS_PER_PAGE);

  const paginatedReviews = ReviewsData.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

  // BOTTOM SHEET STATE
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);

  // 🔹 GROUP VARIAN MENJADI: warna → array ukuran
  const groupVariants = () => {
    if (!product?.varian) return { colors: [], map: {} };

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
      const warnaKey = v.warna; // gunakan langsung nama warna
      if (!map[warnaKey]) {
        map[warnaKey] = {
          kode: v.kode_warna || "#f3f3f3", // ambil dari API
          sizes: [],
        };
      }

      map[warnaKey].sizes.push({
        ukuran: v.ukuran,
        tambahan_harga: v.tambahan_harga,
        varian_id: v.id,
        stok: v.stok,
      });
    });

    return {
      colors: Object.keys(map),
      map,
    };
  };

  const { colors, map: groupedVariants } = groupVariants();

  // Set default: warna pertama → ukuran pertama
  useEffect(() => {
    if (!product || !colors.length) return;

    if (!selectedColor) setSelectedColor(colors[0]);

    if (colors[0] && groupedVariants[colors[0]].sizes.length > 0) {
      setSelectedSize(groupedVariants[colors[0]].sizes[0].ukuran);
    }
  }, [product]);

  // 🔹 Hitung harga total
  const calculateTotalPrice = () => {
    if (!product) return 0;
    let base = product.harga;

    if (selectedColor && selectedSize !== null) {
      const sizeObj = groupedVariants[selectedColor].sizes.find(
        (s) => s.ukuran === selectedSize
      );
      if (sizeObj) base += sizeObj.tambahan_harga;
    }

    return base * quantity;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const totalPrice = calculateTotalPrice();

  return (
    <div className="">
      {/* GALLERY MOBILE */}
      <ProductImageGallery
        images={product}
        name={product.nama_produk}
        layout="mobile"
      />

      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 pt-0 lg:pt-[161px]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="col-span-8">
              <div className="grid md:grid-cols-12 gap-8 border-b border-neutral-200 pb-8">

                {/* GALLERY DESKTOP */}
                <div className="lg:col-span-4">
                  <ProductImageGallery
                    images={product}
                    name={product.nama_produk}
                    layout="desktop"
                  />
                </div>

                {/* DETAIL PRODUK */}
                <div className="lg:col-span-7 space-y-5">

                  <div>
                    <div className="text-sm text-[#299A4D] mb-1">
                      {product.kategori.nama_kategori}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.nama_produk}
                    </h1>

                    <div className="flex items-center gap-4 mb-3">
                      {/* <div className="flex items-center text-yellow-500">
                        <Star className="w-5 h-5 fill-yellow-400" />
                        <span className="ml-1 text-gray-700 font-medium">
                          {product.rating?.toFixed(1) ?? "0.0"}
                        </span>
                      </div> */}

                      <p className="text-gray-600 text-sm">
                        Stok: <span className="font-semibold">{product.stok}</span>
                      </p>
                    </div>
                  </div>

                  {/* VARIAN WARNA */}
                  {colors.length > 0 && (
                    <div className="hidden lg:block">
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Pilih Warna:
                      </label>

                      <div className="flex flex-wrap gap-3">
                        {colors.map((colorName) => {
                          const colorObj = groupedVariants[colorName];
                          const colorCode =
                            colorObj?.kode || "#f3f3f3"; // ambil dari varian.kode_warna

                          const selected = selectedColor === colorName;

                          return (
                            <div key={colorName} className="flex flex-col items-center">
                              <button
                                onClick={() => {
                                  setSelectedColor(colorName);
                                  setSelectedSize(colorObj.sizes[0]?.ukuran ?? null);
                                }}
                                className={`w-10 h-10 rounded-full border-2 transition-all ${
                                  selected ? "ring-2 ring-neutral-300" : ""
                                }`}
                                style={{
                                  backgroundColor: colorCode,
                                  borderColor: selected ? "border-neutral-300" : "#ccc",
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
                  {selectedColor &&
                    groupedVariants[selectedColor].sizes.some((s) => s.ukuran) && (
                      <div className="hidden lg:block">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                          Pilih Ukuran:
                        </label>

                        <div className="flex gap-2 flex-wrap">
                          {groupedVariants[selectedColor].sizes.map((sizeObj) => {
                            const selected = selectedSize === sizeObj.ukuran;

                            return (
                              <button
                                key={sizeObj.ukuran}
                                onClick={() => setSelectedSize(sizeObj.ukuran)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                                  selected
                                    ? "bg-[#299A4D] text-white border-[#299A4D]"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                {sizeObj.ukuran}
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
                    )
                  }

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
                  <Pagination
                    currentPage={reviewPage}
                    totalPages={totalReviewPages}
                    onPageChange={(page) => setReviewPage(page)}
                  />
                )}
              </div>
            </div>

            {/* SIDEBAR HARGA DESKTOP */}
            <div className="hidden lg:block lg:col-span-4 sticky top-[160px] self-start">
              <div className="bg-white rounded-xl shadow p-4 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Harga Total</p>
                  <p className="text-2xl font-extrabold text-[#299A4D]">
                    {product.jenis.nama_jenis === "poin"
                      ? totalPrice
                      : formatPrice(totalPrice)}{" "}
                    <span className="text-base text-gray-500 font-normal">
                      {product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}
                    </span>
                  </p>
                </div>

                {/* JUMLAH */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Jumlah Pembelian
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
                    >
                      –
                    </button>

                    <div className="flex-1">
                      <InputField
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 1 && val <= product.stok) setQuantity(val);
                        }}
                        className="text-center"
                      />
                    </div>

                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          prev < product.stok ? prev + 1 : prev
                        )
                      }
                      className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-sm text-gray-500">
                    Sisa stok: <span className="font-medium">{product.stok}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <Button label="Beli Sekarang" fullWidth color="primary" />
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
                {product.jenis.nama_jenis === "poin"
                  ? totalPrice
                  : formatPrice(totalPrice)}{" "}
                <span className="text-base text-gray-500 font-normal">
                  {product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}
                </span>
              </p>
            </div>

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
              <Button label="Beli Sekarang" color="primary" fullWidth onClick={() => setOpenB(true)} />
            </div>
          </div>
        </div>
      </div>

      <BottomSheet open={openA} onClose={() => setOpenA(false)}>
        <div className="flex flex-col gap-4">
          {/* HARGA */}
          <div>
            <p className="text-xs text-gray-500">Harga Total</p>
            <p className="text-md font-extrabold text-[#299A4D]">
              {product.jenis.nama_jenis === "poin"
                ? totalPrice
                : formatPrice(totalPrice)}{" "}
              <span className="text-base text-gray-500 font-normal">
                {product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}
              </span>
            </p>
          </div>

          {/* VARIAN WARNA */}
          {colors.length > 0 && (
            <div className="hidden lg:block">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Pilih Warna:
              </label>

              <div className="flex flex-wrap gap-3">
                {colors.map((colorName) => {
                  const colorObj = groupedVariants[colorName];
                  const colorCode =
                    colorObj?.kode || "#f3f3f3"; // ambil dari varian.kode_warna

                  const selected = selectedColor === colorName;

                  return (
                    <div key={colorName} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedColor(colorName);
                          setSelectedSize(colorObj.sizes[0]?.ukuran ?? null);
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selected ? "ring-2 ring-neutral-300" : ""
                        }`}
                        style={{
                          backgroundColor: colorCode,
                          borderColor: selected ? "border-neutral-300" : "#ccc",
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
          {selectedColor &&
            groupedVariants[selectedColor].sizes.some((s) => s.ukuran) && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Pilih Ukuran:
                </label>

                <div className="flex gap-2 flex-wrap">
                  {groupedVariants[selectedColor].sizes.map((sizeObj) => {
                    const selected = selectedSize === sizeObj.ukuran;

                    return (
                      <button
                        key={sizeObj.ukuran}
                        onClick={() => setSelectedSize(sizeObj.ukuran)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          selected
                            ? "bg-[#299A4D] text-white border-[#299A4D]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {sizeObj.ukuran}
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
            )
          }

          {/* JUMLAH */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Jumlah Pembelian
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
              >
                –
              </button>

              <div className="flex-1">
                <InputField
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= product.stok) setQuantity(val);
                  }}
                  className="text-center"
                />
              </div>

              <button
                onClick={() =>
                  setQuantity((prev) =>
                    prev < product.stok ? prev + 1 : prev
                  )
                }
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Sisa stok: <span className="font-medium">{product.stok}</span>
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
              {product.jenis.nama_jenis === "poin"
                ? totalPrice
                : formatPrice(totalPrice)}{" "}
              <span className="text-base text-gray-500 font-normal">
                {product.jenis.nama_jenis === "poin" ? "Poin" : "IDR"}
              </span>
            </p>
          </div>

          {/* VARIAN WARNA */}
          {colors.length > 0 && (
            <div className="hidden lg:block">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Pilih Warna:
              </label>

              <div className="flex flex-wrap gap-3">
                {colors.map((colorName) => {
                  const colorObj = groupedVariants[colorName];
                  const colorCode =
                    colorObj?.kode || "#f3f3f3"; // ambil dari varian.kode_warna

                  const selected = selectedColor === colorName;

                  return (
                    <div key={colorName} className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          setSelectedColor(colorName);
                          setSelectedSize(colorObj.sizes[0]?.ukuran ?? null);
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selected ? "ring-2 ring-neutral-300" : ""
                        }`}
                        style={{
                          backgroundColor: colorCode,
                          borderColor: selected ? "border-neutral-300" : "#ccc",
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
          {selectedColor &&
            groupedVariants[selectedColor].sizes.some((s) => s.ukuran) && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Pilih Ukuran:
                </label>

                <div className="flex gap-2 flex-wrap">
                  {groupedVariants[selectedColor].sizes.map((sizeObj) => {
                    const selected = selectedSize === sizeObj.ukuran;

                    return (
                      <button
                        key={sizeObj.ukuran}
                        onClick={() => setSelectedSize(sizeObj.ukuran)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                          selected
                            ? "bg-[#299A4D] text-white border-[#299A4D]"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {sizeObj.ukuran}
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
            )
          }

          {/* JUMLAH */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Jumlah Pembelian
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
              >
                –
              </button>

              <div className="flex-1">
                <InputField
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1 && val <= product.stok) setQuantity(val);
                  }}
                  className="text-center"
                />
              </div>

              <button
                onClick={() =>
                  setQuantity((prev) =>
                    prev < product.stok ? prev + 1 : prev
                  )
                }
                className="w-10 h-10 rounded-full border border-neutral-300 hover:bg-neutral-200 flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Sisa stok: <span className="font-medium">{product.stok}</span>
            </p>
          </div>

          <Button label="Beli Sekarang" color="primary" onClick={() => setOpenB(false)} />
        </div>
      </BottomSheet>
    </div>
  );
};

export default ProductDetail;
