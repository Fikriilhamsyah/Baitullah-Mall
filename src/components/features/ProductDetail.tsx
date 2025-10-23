import React, { useState, useEffect } from "react";
import { useProductById } from "@hooks/useProductById";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import { formatPrice } from "@/utils/formatters";
import { categoryIcons } from "@/utils/helpers";
import { ArrowLeft, ShoppingCart } from "lucide-react";

interface ProductDetailProps {
  id: string;
  onBack: () => void;
}

// Komponen untuk menampilkan detail produk
const ProductDetail: React.FC<ProductDetailProps> = ({ id, onBack }) => {
  const { product, loading, error } = useProductById(id);

  // State untuk menyimpan varian yang dipilih
  const [selectedVariants, setSelectedVariants] = useState<Map<string, string>>(
    new Map()
  );

  // Inisialisasi pilihan varian pertama saat produk dimuat
  useEffect(() => {
    if (product?.variants) {
      const initialSelections = new Map<string, string>();
      product.variants.forEach((variantType) => {
        if (variantType.options.length > 0) {
          initialSelections.set(variantType.id, variantType.options[0].id);
        }
      });
      setSelectedVariants(initialSelections);
    }
  }, [product]);

  // Fungsi untuk menghitung total harga berdasarkan varian
  const calculateTotalPrice = () => {
    if (!product) return 0;

    let totalPrice = product.basePrice;

    selectedVariants.forEach((optionId, variantTypeId) => {
      const variantType = product.variants?.find((v) => v.id === variantTypeId);
      const option = variantType?.options.find((o) => o.id === optionId);
      if (option?.priceModifier) {
        totalPrice += option.priceModifier;
      }
    });

    return totalPrice;
  };

  const handleSelectVariant = (variantTypeId: string, optionId: string) => {
    setSelectedVariants(new Map(selectedVariants.set(variantTypeId, optionId)));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return null; // Tidak ada produk

  const totalPrice = calculateTotalPrice();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-medium mb-4 hover:underline"
      >
        <ArrowLeft className="w-5 h-5" />
        Kembali ke Daftar
      </button>

      <div className="md:flex md:gap-8">
        <div className="md:w-1/2">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/600x400/eeeeee/aaaaaa?text=Image+Error")
            }
          />
        </div>

        <div className="md:w-1/2 mt-6 md:mt-0">
          <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-2">
            {categoryIcons[product.category]}
            <span>{product.category}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-4">{product.description}</p>

          {/* Bagian Varian */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-6 space-y-4">
              {product.variants.map((variantType) => (
                <div key={variantType.id}>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Pilih {variantType.name}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variantType.options.map((option) => {
                      const isSelected =
                        selectedVariants.get(variantType.id) === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() =>
                            handleSelectVariant(variantType.id, option.id)
                          }
                          className={`
                            px-4 py-2 rounded-full border text-sm font-medium transition-all
                            ${
                              isSelected
                                ? "bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }
                          `}
                        >
                          {option.value}
                          {option.priceModifier > 0 && (
                            <span className="ml-1 text-xs">
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

          {/* Harga dan Tombol Beli */}
          <div className="mt-8">
            <span className="text-sm text-gray-500">Harga</span>
            <p className="text-4xl font-extrabold text-gray-900 mb-4">
              {formatPrice(totalPrice)}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Stok tersisa: {product.stock}
            </p>
            <button className="w-full flex justify-center items-center gap-3 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300">
              <ShoppingCart className="w-5 h-5" />
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
