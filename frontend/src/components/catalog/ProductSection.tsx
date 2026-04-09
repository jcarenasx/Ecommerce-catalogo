import type { Product } from "../../types";
import ProductGrid from "./ProductGrid";
import SectionHeading from "./SectionHeading";

type ProductSectionProps = {
  products: Product[];
  title?: string;
  eyebrow?: string;
  description?: string;
};

export default function ProductSection({
  products,
  title,
  eyebrow,
  description,
}: ProductSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <ProductGrid products={products} />
    </section>
  );
}
