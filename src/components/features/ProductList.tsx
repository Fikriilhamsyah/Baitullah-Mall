import React from "react";
import { useProducts } from "@hooks/useProducts";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import { formatPrice } from "@utils/formatters";
import { categoryIcons } from "@/utils/helpers";

interface ProductListProps {
  onProductSelect: (id: string) => void;
}

// Komponen untuk menampilkan daftar produk
const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
  const { products, loading, error } = useProducts();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          onClick={() => onProductSelect(product.id)}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-56 object-cover"
            onError={(e) =>
              (e.currentTarget.src =
                "https://placehold.co/600x400/eeeeee/aaaaaa?text=Image+Error")
            }
          />
          <div className="p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-2">
              {categoryIcons[product.category]}
              <span>{product.category}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-xl font-bold text-gray-800 mt-2">
              {formatPrice(product.basePrice)}
            </p>
            {product.variants && (
              <span className="text-xs text-gray-500 mt-1 block">
                Tersedia {product.variants.length} varian
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
