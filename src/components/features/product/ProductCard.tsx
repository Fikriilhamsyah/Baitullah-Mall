"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/IProduct";
import { formatPrice } from "@/utils/formatters";
import { formatDecimal } from "@/utils/formatDecimal";
import ProductColorCircles from "./ProductColorCircles";
import ProductRatingStars from "./ProductRatingStars";
import ProductVariantInfo from "./ProductVariantInfo";

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const variantColors =
    product.varian?.map((o) => o.kode_varian) || [];

  const groupedVariants =
    product.varian
      ? Object.values(
          product.varian.reduce<Record<string, { warna: string | null; kode_warna: string }>>(
            (acc, v) => {
              if (!v.kode_warna) return acc; // guard optional
              if (!acc[v.kode_warna]) {
                acc[v.kode_warna] = { warna: v.warna, kode_warna: v.kode_warna };
              }
              return acc;
            },
            {}
          )
        )
      : [];

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  let allSizes =
    product.varian
      ?.map((v) => v.ukuran)
      .filter((u) => u !== null)
      .map((u) => u!.toUpperCase()) || [];

  // unik
  allSizes = Array.from(new Set(allSizes));

  // sorting ukuran standar
  allSizes.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a);
    const indexB = sizeOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // format: "S - XL"
  const sizeDisplay =
    allSizes.length > 0
      ? `${allSizes[0]} - ${allSizes[allSizes.length - 1]}`
      : undefined;

  /** -----------------------------
   * 2. Ambil Gender Dari Koleksi
   * ------------------------------*/
  const variantGender =
    product.koleksi && product.koleksi.length > 0
      ? product.koleksi[0].nama_koleksi
      : undefined;

  const makeSlug = (name: string | undefined, id: number) => {
    const safeName = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "produk";
    return `${id}-${safeName}`;
  };

  return (
    <div
      onClick={() => router.push(`/productdetail/${makeSlug(product.nama_produk, product.id)}`)}
      className="bg-white overflow-hidden cursor-pointer md:transform md:transition-all md:duration-300 md:hover:shadow-md md:hover:-translate-y-1"
    >
      {/* Gambar Thumbnail */}
      <img
        src={`${process.env.NEXT_PUBLIC_API_BAITULLAH_MALL}/storage/${product.gambar_utama}`}
        alt={product.nama_produk}
        className="w-full h-auto aspect-[4/5] object-cover"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/600x400/eeeeee/aaaaaa?text=No+Image")
        }
      />

      <div className="p-3 space-y-2">
        {/* Varian Warna */}
        {variantColors.length > 0 && <ProductColorCircles colors={groupedVariants.map(v => v.kode_warna)} />}

        {/* Categori */}
        <div className="flex items-center gap-2 text-xs font-normal text-neutral-600 p-2 border border-neutral-300 w-fit">
          <span>{product.kategori.nama_kategori}</span>
        </div>

        {/* Varian Gender & Size */}
        <ProductVariantInfo gender={variantGender} sizes={sizeDisplay ? [sizeDisplay] : []} />

        {/* Nama Produk */}
        <h3 className="text-sm font-semibold text-gray-900">{product.nama_produk}</h3>

        {/* Harga */}
        <p className="text-xl font-extrabold text-gray-800">
          {product.jenis.nama_jenis === "poin"
            ? `${formatDecimal(product.harga)} Poin`
            : formatPrice(product.harga)}
        </p>

        {/* Rating */}
        {/* {product.rating && <ProductRatingStars rating={product.rating} />} */}

        {/* Jumlah tersedia */}
        {product.varian && (
          <span className="text-xs text-gray-500 block">
            Tersedia {product.varian.length} varian
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
