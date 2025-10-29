import React from "react";
import { useProducts } from "@hooks/useProducts";
import LoadingSpinner from "@components/ui/LoadingSpinner";
import ErrorMessage from "@components/ui/ErrorMessage";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/Button";
import { ChevronRight } from "lucide-react";

interface ProductListProps {
  onProductSelect: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
  const { products, loading, error } = useProducts();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={onProductSelect}
          />
        ))}
      </div>
      <div>
        <Button label="Lihat Produk Lainnya" variant="normal" iconRight={ChevronRight} color="primary" />
      </div>
    </div>
  );
};

export default ProductList;
