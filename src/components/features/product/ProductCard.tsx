import React from "react";
import { IProduct } from "@/types/IProduct";
import { formatPrice } from "@/utils/formatters";
import { categoryIcons } from "@/utils/helpers";
import ColorCircles from "./ColorCircles";
import RatingStars from "./RatingStars";
import VariantInfo from "./VariantInfo";

interface ProductCardProps {
  product: IProduct;
  onSelect: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const variantColors =
    product.variants
      ?.find((v) => v.name.toLowerCase() === "warna")
      ?.options.map((o) => o.value) || [];

  // Urutan standar ukuran umum
  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Ambil varian ukuran dari produk
  let variantSizes =
    product.variants
      ?.find((v) => v.name.toLowerCase() === "ukuran")
      ?.options.map((o) => o.value.toUpperCase()) || [];

  // Urutkan berdasarkan posisi di sizeOrder
  variantSizes = variantSizes.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    // Jika ukuran tidak ada di list default, letakkan di akhir
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Format penulisan contoh: (S - XXL)
  const sizeDisplay =
    variantSizes.length > 0
      ? `(${variantSizes[0]} - ${variantSizes[variantSizes.length - 1]})`
      : undefined;

  const variantGender =
    product.variants?.find((v) => v.name.toLowerCase() === "gender")?.options[0]
      ?.value || undefined;

  return (
    <div
      onClick={() => onSelect(product.id)}
      className="bg-white overflow-hidden cursor-pointer md:transform md:transition-all md:duration-300 md:hover:shadow-md md:hover:-translate-y-1"
    >
      {/* Gambar Utama */}
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-auto aspect-[4/5] object-cover"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/600x400/eeeeee/aaaaaa?text=No+Image")
        }
      />

      <div className="p-3 space-y-2">
        {/* Warna */}
        {variantColors.length > 0 && <ColorCircles colors={variantColors} />}

        {/* Kategori */}
        <div className="flex items-center gap-2 text-xs font-normal text-neutral-600 p-2 border border-neutral-300 w-fit">
          {/* {categoryIcons[product.category]} */}
          <span>{product.category}</span>
        </div>

        {/* Gender & Ukuran */}
        <VariantInfo gender={variantGender} sizes={sizeDisplay ? [sizeDisplay] : []} />

        {/* Nama Produk */}
        <h3 className="text-sm font-semibold text-gray-900">
          {product.name}
        </h3>

        {/* Harga */}
        <p className="text-xl font-extrabold text-gray-800">
          {product.paymentType === "poin"
            ? `${product.basePrice} Poin`
            : formatPrice(product.basePrice)}
        </p>

        {/* Rating */}
        {product.rating && <RatingStars rating={product.rating} />}

        {/* Info varian */}
        {product.variants && (
          <span className="text-xs text-gray-500 block">
            Tersedia {product.variants.length} varian
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
