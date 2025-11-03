import React from "react";
import { useProducts } from "@hooks/useProducts";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import ProductCard from "./ProductCard";

interface ProductListProps {
  onProductSelect: (id: string) => void;
  paymentType?: "rupiah" | "poin";
}

const ProductList: React.FC<ProductListProps> = ({ onProductSelect, paymentType }) => {
  const { products, loading, error } = useProducts();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const filteredProducts = paymentType
    ? products.filter((p) => p.paymentType === paymentType)
    : products;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
