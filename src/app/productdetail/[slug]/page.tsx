"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import ProductDetail from "@/components/features/product/ProductDetail";

export default function ProductDetailPage() {
  const { slug } = useParams(); // misal: "P1001-tas-ihram-premium"
  const router = useRouter();

  // Pisahkan ID dan nama produk dari slug
  const [id, ...nameParts] = (slug as string).split("-");
  const name = nameParts.join(" ");

  console.log("Slug:", slug);
  console.log("Extracted ID:", id);
  console.log("Extracted Name:", name);

  return (
    <div className="">
      <ProductDetail id={id} name={name} onBack={() => router.back()} />
    </div>
  );
}
