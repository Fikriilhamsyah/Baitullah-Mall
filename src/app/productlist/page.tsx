"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SearchX, ChevronDown } from "lucide-react";

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
import { useProducts } from "@hooks/useProducts";
import { useCategories } from "@hooks/useCategories";
import { useCollection } from "@hooks/useCollection";
import { usePaymentType } from "@hooks/usePaymentType";

export default function ProductListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kategoriId = searchParams.get("kategori_id");

  const { products, loading: productLoading, error } = useProducts();
  const { categories, loading: loadingCategories, error: categoryError } = useCategories();
  const { collection, loading: loadingCollection, error: collectionError } = useCollection();
  const { paymentType, loading: loadingPaymentType, error: payementTypeError } = usePaymentType();

  const categoryList = Array.isArray(categories) ? categories : [];
  const collectionList = Array.isArray(collection) ? collection : [];
  const paymentTypeList = Array.isArray(paymentType) ? paymentType : [];

  // State
  const [category, setCategory] = useState<string[]>([]);
  const [collectionFilter, setCollectionFilter] = useState<string[]>([]);
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");
  const [productType, setProductType] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 8;
  const query = searchParams.get("query")?.toLowerCase() || "";

  const [showScrollDown, setShowScrollDown] = useState(true);
  const [showScrollUp, setShowScrollUp] = useState(false);

  // 🔹 Ambil filter awal dari URL + kategori API
  useEffect(() => {
    let initialCategory: string[] = [];
    const initialCollectionFilter = searchParams.get("collection")?.split(",") || [];
    const initialSort = searchParams.get("sort") || "";
    const initialType = searchParams.get("type")?.split(",") || [];
    const initialMin = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : "";
    const initialMax = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : "";
    const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;

    // Ambil dari URL atau kategori_id tapi pakai nama kategori dari API
    if (kategoriId && categoryList.length > 0) {
      const kategoriIdNumber = Number(kategoriId); // convert ke number
      const matchedCategory = categoryList.find(cat => cat.id === kategoriIdNumber);
      const urlCategory = searchParams.get("category");
      if (matchedCategory || urlCategory) {
        initialCategory = [urlCategory || matchedCategory?.nama_kategori || ""].filter(Boolean);
      }
    } else {
      initialCategory = searchParams.get("category")?.split(",") || [];
    }

    setCategory(initialCategory);
    setCollectionFilter(initialCollectionFilter);
    setPaymentTypeFilter(initialType);
    setSortBy(initialSort);
    setProductType(initialType);
    setMinPrice(initialMin);
    setMaxPrice(initialMax);
    setCurrentPage(page);
  }, [kategoriId, categoryList]);

  // 🔹 Scroll effect untuk sidebar
  useEffect(() => {
    const scrollArea = document.getElementById("filterScrollArea");
    if (!scrollArea) return;

    const handleScroll = () => {
      setShowScrollDown(scrollArea.scrollTop <= 20);
      setShowScrollUp(scrollArea.scrollTop > 100);
    };

    scrollArea.addEventListener("scroll", handleScroll);
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    const scrollArea = document.getElementById("filterScrollArea");
    scrollArea?.scrollBy({ top: 250, behavior: "smooth" });
  };

  const scrollToTop = () => {
    const scrollArea = document.getElementById("filterScrollArea");
    scrollArea?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Update URL setiap filter berubah
  useEffect(() => {
    const params = new URLSearchParams();

    if (query) params.set("query", query);
    if (category.length) params.set("category", category.join(","));
    if (collectionFilter.length) params.set("collection", collectionFilter.join(","));
    if (paymentTypeFilter.length) params.set("type", paymentTypeFilter.join(","));
    if (productType.length) params.set("type", productType.join(","));
    if (minPrice !== "") params.set("minPrice", String(minPrice));
    if (maxPrice !== "") params.set("maxPrice", String(maxPrice));
    if (sortBy) params.set("sort", sortBy);
    if (currentPage > 1) params.set("page", String(currentPage));

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [category, collectionFilter, paymentTypeFilter, productType, minPrice, maxPrice, sortBy, currentPage, query]);

  // 🔹 Simulasi loading awal
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 🔹 Filtering & Sorting
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];

    return list.filter((p) => {
      const matchesQuery = query ? p.nama_produk.toLowerCase().includes(query) : true;
      const matchesCategory = category.length
        ? category.includes(p.kategori.nama_kategori)
        : true;
      const matchesCollection = collectionFilter.length
        ? collectionFilter.includes(String(p.koleksi))
        : true;
      const matchesPaymentType = paymentTypeFilter.length
        ? paymentTypeFilter.includes(String(p.jenis))
        : true;
      const matchesType = productType.length
        ? productType.includes(p.jenis.nama_jenis)
        : true;
      const matchesPrice =
        (minPrice === "" || p.harga >= Number(minPrice)) &&
        (maxPrice === "" || p.harga <= Number(maxPrice));

      return matchesQuery && matchesCategory && matchesCollection && matchesPaymentType && matchesType && matchesPrice;
    });
  }, [products, category, collectionFilter, paymentTypeFilter, productType, minPrice, maxPrice, query]);

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading || productLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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
          totalCount={totalCount}
          totalAll={totalAll}
          category={category}
          collectionFilter={collectionFilter}
          paymentTypeFilter={paymentTypeFilter}
          productType={productType}
          sortBy={sortBy}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onChangeCategory={setCategory}
          onChangeCollectionFilter={setCollectionFilter}
          onChangePaymentTypeFilter={setPaymentTypeFilter}
          onChangeProductType={setProductType}
          onChangeSort={setSortBy}
          onChangeMinPrice={setMinPrice}
          onChangeMaxPrice={setMaxPrice}
          onResetFilters={() => {
            setCategory([]);
            setCollectionFilter([]);
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
              <div
                className="sticky top-[160px] h-[calc(100vh-140px)] overflow-y-auto bg-neutral-100 p-4 pt-12"
                id="filterScrollArea"
              >
                {/* Scroll Buttons */}
                <motion.button
                  onClick={scrollDown}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={showScrollDown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-auto absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 
                            bg-white border border-primary-500 text-primary-500 rounded-full 
                            py-1 px-3 text-[11px] shadow-md cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4" />
                  Gulir ke bawah
                </motion.button>

                <motion.button
                  onClick={scrollToTop}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={showScrollUp ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 
                            z-50 flex items-center gap-1 bg-primary-500 text-white 
                            rounded-full py-1 px-4 text-[11px] shadow-lg cursor-pointer"
                >
                  ↑ Ke atas
                </motion.button>

                <Button
                  label="Atur Ulang Filter"
                  color="primary"
                  onClick={() => {
                    setCategory([]);
                    setCollectionFilter([]);
                    setProductType([]);
                    setSortBy("");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  fullWidth
                />

                <div className="flex justify-between items-center mb-8 mt-8">
                  <p className="text-md font-normal text-neutral-600">Menampilkan produk</p>
                  <p className="text-md font-semibold text-primary-600">
                    {totalCount} / {totalAll}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Harga */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">Harga</p>
                    <div className="flex items-center">
                      <p className="text-md font-normal text-neutral-600 mr-2">Rp</p>
                      <div className="grid grid-cols-2 gap-2">
                        <InputField
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) =>
                            setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
                          }
                        />
                        <InputField
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) =>
                            setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Jenis Produk */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">Jenis Pembayaran Produk</p>
                    <CheckboxGroup
                      options={paymentTypeList.map((pay) => ({ label: pay.nama_jenis, value: pay.nama_jenis }))}
                      selected={paymentTypeFilter}
                      onChange={setPaymentTypeFilter}
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">Kategori</p>
                    <CheckboxGroup
                      options={categoryList.map((cat) => ({
                        label: cat.nama_kategori,
                        value: cat.nama_kategori,
                      }))}
                      selected={category}
                      onChange={setCategory}
                    />
                  </div>

                  {/* Koleksi / Gender */}
                  <div>
                    <p className="text-md font-bold text-neutral-700 mb-2">Gender</p>
                    <CheckboxGroup
                      options={collectionList.map((col) => ({
                        label: col.nama_koleksi,
                        value: col.nama_koleksi,
                      }))}
                      selected={collectionFilter}
                      onChange={setCollectionFilter}
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
                    Coba ubah kata kunci pencarian atau periksa filter yang kamu gunakan.
                  </p>
                </motion.div>
              )}

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
