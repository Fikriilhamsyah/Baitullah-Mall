"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IProduk } from "@/types/IProduk";
import { formatPrice } from "@/utils/formatters";
import ProductColorCircles from "./ProductColorCircles";
import ProductRatingStars from "./ProductRatingStars";
import ProductVariantInfo from "./ProductVariantInfo";

interface ProductCardProps {
  product: IProduk;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const variantColors =
    product.variants
      ?.find((v) => v.name.toLowerCase() === "warna")
      ?.options.map((o) => o.value) || [];

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  let variantSizes =
    product.variants
      ?.find((v) => v.name.toLowerCase() === "ukuran")
      ?.options.map((o) => o.value.toUpperCase()) || [];

  variantSizes = variantSizes.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const sizeDisplay =
    variantSizes.length > 0
      ? `(${variantSizes[0]} - ${variantSizes[variantSizes.length - 1]})`
      : undefined;

  const variantGender =
    product.variants?.find((v) => v.name.toLowerCase() === "gender")?.options[0]
      ?.value || undefined;

  const makeSlug = (name: string, id: string) => {
    return `${id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  };

  return (
    <div
      onClick={() => router.push(`/productdetail/${makeSlug(product.name, product.id)}`)}
      className="bg-white overflow-hidden cursor-pointer md:transform md:transition-all md:duration-300 md:hover:shadow-md md:hover:-translate-y-1"
    >
      {/* Gambar Thumbnail */}
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
        {/* Varian Warna */}
        {variantColors.length > 0 && <ProductColorCircles colors={variantColors} />}

        {/* Categori */}
        <div className="flex items-center gap-2 text-xs font-normal text-neutral-600 p-2 border border-neutral-300 w-fit">
          <span>{product.category}</span>
        </div>

        {/* Varian Gender & Size */}
        <ProductVariantInfo gender={variantGender} sizes={sizeDisplay ? [sizeDisplay] : []} />

        {/* Nama Produk */}
        <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>

        {/* Harga */}
        <p className="text-xl font-extrabold text-gray-800">
          {product.paymentType === "poin"
            ? `${product.basePrice} Poin`
            : formatPrice(product.basePrice)}
        </p>

        {/* Rating */}
        {product.rating && <ProductRatingStars rating={product.rating} />}

        {/* Jumlah tersedia */}
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
