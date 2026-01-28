import React from "react";
import { useRouter } from "next/router";
import ProductDetail from "@/components/features/product/ProductDetail";

export default function ProductDetailPage() {
  const router = useRouter();
  const { query: routerQuery, isReady } = router;

  const getParam = (key: string): string | null => {
    if (!isReady) return null;
    const value = routerQuery[key];
    if (!value) return null;
    return Array.isArray(value) ? value[0] : String(value);
  };

  const slug = getParam("slug"); // contoh: "e.<base64url>" atau legacy "123-tas-ihram"

  let id: number | null = null;
  let name = "";

  if (typeof slug === "string") {
    // Deteksi encrypted slug: prefix "e."
    if (slug.startsWith("e.")) {
      const encoded = slug.slice(2);
      try {
        const base64 = decodeURIComponent(encoded);
        // atob + decodeURIComponent(unescape(...)) untuk restore utf-8
        const json = typeof window !== "undefined"
          ? decodeURIComponent(escape(atob(base64)))
          : Buffer.from(base64, "base64").toString("utf-8");
        const parsed = JSON.parse(json);
        id = Number(parsed.id);
        name = parsed.name ?? "";
      } catch (err) {
        // jika gagal decode, coba fallback ke legacy parsing
        const parts = slug.split("-");
        id = Number(parts[0]) || null;
        name = parts.slice(1).join(" ");
      }
    } else {
      // legacy format: "id-some-slugged-name"
      const parts = slug.split("-");
      id = Number(parts[0]) || null;
      name = parts.slice(1).join(" ");
    }
  }

  // safety: jika id null/NaN, redirect ke halaman sebelumnya atau ke daftar produk
  if (id === null || Number.isNaN(id)) {
    // redirect back atau ke home
    if (typeof window !== "undefined") {
      // gunakan router.back() agar UX lebih baik
      router.back();
    }
    return null;
  }

  console.log("Slug:", slug);
  console.log("Extracted ID:", id);
  console.log("Extracted Name:", name);

  return (
    <div className="">
      <ProductDetail id={Number(id)} nama_produk={name} onBack={() => router.back()} />
    </div>
  );
}
