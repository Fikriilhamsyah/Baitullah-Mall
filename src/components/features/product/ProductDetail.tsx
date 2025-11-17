"use client";
import React, { useState, useEffect } from "react";

// Hooks
import { useProductById } from "@hooks/useProductById";

// Components
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/InputField";
import ProductImageGallery from "./ProductImageGallery";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// Utils
import { formatPrice } from "@/utils/formatters";
import { categoryIcons } from "@/utils/helpers";

// Icon
import { ShoppingCart, Star, MessageCircleMore, } from "lucide-react";

// Data
import { IVariantType, IVariantOption } from "@/types/IProduct";
import { colorMaster } from "@/data/ColorProductData";

interface ProductDetailProps {
  id: string;
  name: string;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ id, name, onBack }) => {
  const { product, loading, error } = useProductById(id);

  const [selectedVariants, setSelectedVariants] = useState<Map<string, string>>(
    new Map()
  );
  const [quantity, setQuantity] = useState(1)

  // Inisialisasi varian default
  useEffect(() => {
    if (product?.variants) {
      const initial = new Map<string, string>();
      product.variants.forEach((variantType: IVariantType) => {
        if (variantType.options.length > 0) {
          initial.set(variantType.id, variantType.options[0].id);
        }
      });
      setSelectedVariants(initial);
    }
  }, [product]);

  const handleSelectVariant = (variantTypeId: string, optionId: string) => {
    setSelectedVariants(new Map(selectedVariants.set(variantTypeId, optionId)));
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    let total = product.basePrice;
    selectedVariants.forEach((optionId, variantTypeId) => {
      const variantType = product.variants?.find(
        (v: IVariantType) => v.id === variantTypeId
      );
      const option = variantType?.options.find(
        (o: IVariantOption) => o.id === optionId
      );
      if (option?.priceModifier) total += option.priceModifier;
    });
    return total;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null;

  const totalPrice = calculateTotalPrice();

  return (
    <div className="">
      <ProductImageGallery
        images={[product.imageUrl, ...(product.images || [])]}
        name={product.name}
        layout="mobile"
      />

      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 pt-0 lg:pt-[161px]">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="col-span-8">
              <div className="grid md:grid-cols-12 gap-8 border-b border-neutral-200 pb-8">
                {/* Kolom Kiri */}
                <div className="lg:col-span-4">
                  <ProductImageGallery
                    images={[product.imageUrl, ...(product.images || [])]}
                    name={product.name}
                    layout="desktop"
                  />
                </div>

                {/* Detail produk Kolom Tengah */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    {/* Category */}
                    <div className="flex items-center gap-2 text-sm text-[#299A4D] mb-1">
                      <span>{product.category}</span>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h1>

                    {/* Rating & Stok */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-5 h-5 fill-yellow-400" />
                        <span className="ml-1 text-gray-700 font-medium">
                          {product.rating?.toFixed(1) ?? "0.0"}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Stok: <span className="font-semibold">{product.stock}</span>
                      </p>
                    </div>
                  </div>

                  {/* Varian */}
                  {product.variants?.length > 0 && (
                    <div className="space-y-5">
                      {product.variants.map((variantType: IVariantType) => (
                        <div key={variantType.id}>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Pilih {variantType.name}:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {variantType.options.map((option: IVariantOption) => {
                              const selected = selectedVariants.get(variantType.id) === option.id;

                              const isColorVariant = variantType.name.toLowerCase() === "warna";

                              if (isColorVariant) {
                                const colorValue =
                                  colorMaster[option.value.toLowerCase()] ||
                                  (/^#([0-9A-F]{3}){1,2}$/i.test(option.value) ? option.value : "#f3f3f3");

                                return (
                                  <div key={option.id} className="flex flex-col items-center">
                                    <button
                                      onClick={() => handleSelectVariant(variantType.id, option.id)}
                                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                                        selected ? "ring-2 ring-[#299A4D]" : "ring-0"
                                      }`}
                                      style={{
                                        backgroundColor: colorValue,
                                        borderColor: selected ? "#299A4D" : "#ccc",
                                      }}
                                      title={option.name} // tooltip
                                    />
                                    <span className="text-xs mt-1 text-gray-600">{option.name}</span>
                                  </div>
                                );
                              }

                              // fallback untuk variant selain warna
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => handleSelectVariant(variantType.id, option.id)}
                                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                                    selected
                                      ? "bg-[#299A4D] text-white border-[#299A4D]"
                                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                  }`}
                                >
                                  {option.value}
                                  {option.priceModifier > 0 && (
                                    <span className="ml-1 text-xs text-gray-200">
                                      (+{formatPrice(option.priceModifier)})
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <p className="text-xl font-bold text-gray-900 block mb-1">Deskripsi</p>
                    <p className="text-sm text-gray-700">{product.description}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-xl p-10"></div>
            </div>

            {/* Kolom kanan */}
            <div className="hidden lg:block lg:col-span-4 sticky top-[160px] self-start">
              <div className="bg-white rounded-xl shadow p-4 space-y-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Harga Total</p>
                  <p className="text-2xl font-extrabold text-[#299A4D]">
                    {product.paymentType === "poin" ? (<>{totalPrice}</>) : (<>{formatPrice(totalPrice)}{" "}</>)}
                    <span className="text-base text-gray-500 font-normal">
                      {product.paymentType === "poin" ? " Poin" : " IDR"}
                    </span>
                  </p>
                </div>

                {/* 🔹 Input jumlah stok */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Jumlah Pembelian
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setQuantity((prev) => Math.max(1, prev - 1))
                      }
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition"
                    >
                      –
                    </button>

                    <div className="flex-1">
                      <InputField
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 1 && val <= product.stock) setQuantity(val);
                        }}
                        className="text-center"
                      />
                    </div>

                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          prev < product.stock ? prev + 1 : prev
                        )
                      }
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>

                  {/* 🔹 Info stok sisa dan warning */}
                  <p className="text-sm text-gray-500">
                    Sisa stok: <span className="font-medium">{product.stock}</span>
                  </p>
                </div>

                <div className="space-y-2">

                  <Button
                    label="Beli Sekarang"
                    fullWidth
                    color="primary"
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

      {/* Harga dan tombol beli mobile */}
      <div className="w-full block lg:hidden mt-8">
        <div className="fixed bottom-0 z-10 w-full bg-white/80 backdrop-blur-md" style={{ boxShadow: "0 -6px 18px rgba(177, 177, 177, 0.25)" }}>
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 space-y-2">
            <div>
              <p className="text-xs text-gray-500">Harga Total</p>
              <p className="text-md font-extrabold text-[#299A4D]">
                {product.paymentType === "poin" ? (<>{totalPrice}</>) : (<>{formatPrice(totalPrice)}{" "}</>)}
                <span className="text-base text-gray-500 font-normal">
                  {product.paymentType === "poin" ? " Poin" : " IDR"}
                </span>
              </p>
            </div>

            <div className="flex gap-3 col-span-3">
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
              />

              <Button
                label="Beli Sekarang"
                color="primary"
                fullWidth
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
