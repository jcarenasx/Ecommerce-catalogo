import type { Product } from "../../types";
import ProductCard from "../ProductCard";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.model} product={product} />
      ))}
    </div>
  );
}
