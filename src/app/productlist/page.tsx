"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

// Components
import ProductCard from "@/components/features/product/ProductCard";
import Pagination from "@/components/ui/Pagination";
import { HeroSection } from "@components/features/home/HeroSection";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { InputField } from "@/components/ui/InputField";
import CheckboxGroup from "@/components/ui/CheckboxGroup";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";

// Hooks
import { useProduk } from "@hooks/useProduk";

export default function ProductListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, loading: productLoading, error } = useProduk();

  const [category, setCategory] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [productType, setProductType] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 8;
  const query = searchParams.get("query")?.toLowerCase() || "";

  // 🔹 Ambil filter dari URL hanya sekali (saat mount)
  useEffect(() => {
    const initialCategory = searchParams.get("category")?.split(",") || [];
    const initialGender = searchParams.get("gender")?.split(",") || [];
    const initialSort = searchParams.get("sort") || "";
    const initialType = searchParams.get("type")?.split(",") || [];
    const initialMin = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : "";
    const initialMax = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : "";
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : 1;

    setCategory(initialCategory);
    setGender(initialGender);
    setSortBy(initialSort);
    setProductType(initialType);
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
    setCurrentPage(page);
  }, []); // ← hanya dijalankan sekali

  // 🔹 Update URL hanya jika berubah
  useEffect(() => {
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (category.length) params.set("category", category.join(","));
    if (gender.length) params.set("gender", gender.join(","));
    if (productType.length) params.set("type", productType.join(","));
    if (minPrice !== "") params.set("minPrice", String(minPrice));
    if (maxPrice !== "") params.set("maxPrice", String(maxPrice));
    if (sortBy) params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", String(currentPage));

    const newUrl = `?${params.toString()}`;
    const currentUrl = `?${searchParams.toString()}`;

    // ✅ Cegah looping render
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [category, gender, minPrice, maxPrice, sortBy, currentPage, query]);

  // 🔹 Simulasi loading awal
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Filtering & Sorting
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products.filter((p) => {
      const matchesQuery = query ? p.nama_produk.toLowerCase().includes(query) : true;

      const matchesCategory =
        category.length > 0 ? category.includes(p.kategori.nama_kategori) : true;

      const matchesGender =
        gender.length > 0
          ? p.koleksi.some((k) => gender.includes(k.nama_koleksi))
          : true;

      // const matchesGender =
      //   gender.length > 0
      //     ? p.variants?.some(
      //         (v) =>
      //           v.name === "Gender" &&
      //           v.options.some((opt) =>
      //             gender.includes(opt.value.toLowerCase())
      //           )
      //       )
      //     : true;

      const matchesType =
        productType.length > 0 ? productType.includes(p.jenis.nama_jenis) : true;

      const matchesPrice =
        (minPrice === "" || p.harga >= Number(minPrice)) &&
        (maxPrice === "" || p.harga <= Number(maxPrice));

      return (
        matchesQuery &&
        matchesCategory &&
        matchesGender &&
        matchesType &&
        matchesPrice
      );
    });

    // 🔹 Sorting
    if (sortBy) {
      switch (sortBy) {
        case "termahal":
          result = [...result].sort((a, b) => b.harga - a.harga);
          break;
        case "termurah":
          result = [...result].sort((a, b) => a.harga - b.harga);
          break;
        case "terlaris":
          result = [...result].sort(
            (a, b) => (b.rating || 0) - (a.rating || 0)
          );
          break;
        case "terbaru":
          result = [...result].sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          break;
      }
    }

    return result;
  }, [products, query, category, gender, productType, minPrice, maxPrice, sortBy]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading || productLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // 🔹 Hitung jumlah produk untuk tampilan teks
  const totalCount = filteredProducts.length;
  const totalAll = products?.length || 0;

  return (
    <div>
      {/* Hero Section (mobile) */}
      <div className="block lg:hidden">
        <HeroSection
          categoryFilter={false}
          filterButtonLabel={true}
          defaultSearch={query}
          // 🔽 Sinkronisasi filter state dari ProductPage ke HeroSection
          totalCount={filteredProducts.length}
          totalAll={products?.length || 0}
          category={category}
          gender={gender}
          productType={productType}
          sortBy={sortBy}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChangeCategory={setCategory}
          onChangeGender={setGender}
          onChangeProductType={setProductType}
          onChangeSort={setSortBy}
          onChangeMinPrice={setMinPrice}
          onChangeMaxPrice={setMaxPrice}
          onResetFilters={() => {
            setCategory([]);
            setGender([]);
            setProductType([]);
            setSortBy("");
            setMinPrice("");
            setMaxPrice("");
          }}
        />
      </div>

      <section className="md:container md:mx-auto md:px-6 pb-8 md:pt-[14pt] lg:pt-[161px]">
        <div id="produk" className="w-full">
          {/* Header */}
          <div className="flex justify-between items-center container mx-auto px-4 md:px-0 py-4 md:py-0 md:pb-6">
            <h2 className="text-md md:text-xl font-normal text-neutral-600">
              Beranda / Semua Produk
            </h2>
            <div className="hidden lg:flex items-center gap-2">
              <InputField
                type="select"
                label="Urutkan Berdasarkan"
                options={[
                  { value: "terbaru", label: "Produk Terbaru" },
                  { value: "terlaris", label: "Produk Terlaris" },
                  { value: "termahal", label: "Harga: Tinggi ke Rendah" },
                  { value: "termurah", label: "Harga: Rendah ke Tinggi" },
                ]}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Sidebar Filter */}
            <div className="hidden lg:block col-span-3">
              <div className="sticky top-[160px] h-[calc(100vh-140px)] overflow-y-auto bg-neutral-100 p-4">
                {/* Atur Ulang Filter */}
                <Button
                  label="Atur Ulang Filter"
                  color="primary"
                  onClick={() => {
                    setCategory([]);
                    setGender([]);
                    setProductType([]);
                    setSortBy("");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  fullWidth={true}
                />
                
                {/* ✅ Bagian jumlah produk */}
                <div className="flex justify-between items-center mb-8 mt-8">
                  <p className="text-md font-normal text-neutral-600">
                    Menampilkan produk
                  </p>
                  <p className="text-md font-semibold text-primary-600">
                    {totalCount} / {totalAll}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Harga */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">Harga</p>
                    <div className="flex items-center">
                      <p className="text-md font-normal text-neutral-600 mr-2">
                        Rp
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <InputField
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) =>
                            setMinPrice(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                        />
                        <InputField
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) =>
                            setMaxPrice(
                              e.target.value === "" ? "" : Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Jenis Pembayaran Produk */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">
                      Jenis Pembayaran Produk
                    </p>
                    <CheckboxGroup
                      options={[
                        { label: "Produk Biasa", value: "uang" },
                        { label: "Tukar Poin", value: "poin" },
                      ]}
                      selected={productType}
                      onChange={setProductType}
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">
                      Kategori
                    </p>
                    <CheckboxGroup
                      options={[
                        { label: "Pakaian & Ihram", value: "Pakaian & Ihram" },
                        { label: "Aksesoris Ibadah", value: "Aksesoris Ibadah" },
                        { label: "Perlengkapan Travel", value: "Perlengkapan Travel" },
                        { label: "Kesehatan & Kebersihan", value: "Kesehatan & Kebersihan" },
                        { label: "Buku Panduan", value: "Buku & Panduan" },
                        { label: "Oleh-oleh & Souvenir", value: "Oleh-oleh & Souvenir" },
                        { label: "Paket Bundling", value: "Paket Bundling" },
                      ]}
                      selected={category}
                      onChange={setCategory}
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">
                      Gender
                    </p>
                    <CheckboxGroup
                      options={[
                        { label: "Pria", value: "Pria" },
                        { label: "Wanita", value: "Wanita" },
                        { label: "Unisex", value: "Unisex" },
                        { label: "Lainnya", value: "Lainnya" },
                      ]}
                      selected={gender}
                      onChange={setGender}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Produk */}
            <div className="col-span-12 lg:col-span-9">
              {paginatedProducts.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {paginatedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center h-64 text-gray-500"
                >
                  <SearchX className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-lg font-medium">Produk tidak ditemukan</p>
                  <p className="text-sm text-gray-400 mt-1 text-center max-w-sm">
                    Coba ubah kata kunci pencarian atau periksa filter yang kamu
                    gunakan.
                  </p>
                </motion.div>
              )}

              {/* Pagination */}
              {filteredProducts.length > ITEMS_PER_PAGE && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    if (page !== currentPage) setCurrentPage(page);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
