import Pill from "../ui/Pill";
import Loader from "../ui/Loader";
import type { AvailabilityTag } from "../../types";

type CatalogFiltersProps = {
  categories: string[];
  brands: string[];
  availabilityTags: AvailabilityTag[];
  categoriesLoading?: boolean;
  brandsLoading?: boolean;
  availabilityLoading?: boolean;
  categoryFilter: string | null;
  brandFilter: string | null;
  availabilityFilter: string | null;
  onCategoryChange: (value: string | null) => void;
  onBrandChange: (value: string | null) => void;
  onAvailabilityChange: (value: string | null) => void;
};

export default function CatalogFilters({
  categories,
  brands,
  availabilityTags,
  categoriesLoading,
  brandsLoading,
  availabilityLoading,
  categoryFilter,
  brandFilter,
  availabilityFilter,
  onCategoryChange,
  onBrandChange,
  onAvailabilityChange,
}: CatalogFiltersProps) {
  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Pill active={categoryFilter === null} onClick={() => onCategoryChange(null)} className="px-4">
          Todas las categorías
        </Pill>
        {categoriesLoading ? <Loader /> : null}
        {categories.map((category) => (
          <Pill
            key={category}
            active={categoryFilter === category}
            onClick={() => onCategoryChange(categoryFilter === category ? null : category)}
          >
            {category}
          </Pill>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill active={brandFilter === null} onClick={() => onBrandChange(null)} className="px-4">
          Todas las marcas
        </Pill>
        {brandsLoading ? <Loader /> : null}
        {brands.map((brand) => (
          <Pill
            key={brand}
            active={brandFilter === brand}
            onClick={() => onBrandChange(brandFilter === brand ? null : brand)}
          >
            {brand}
          </Pill>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Pill
          active={availabilityFilter === null}
          onClick={() => onAvailabilityChange(null)}
          className="px-4"
        >
          Disponibilidad
        </Pill>
        {availabilityLoading ? <Loader /> : null}
        {availabilityTags.map((tag) => (
          <Pill
            key={tag.id}
            active={availabilityFilter === tag.name}
            onClick={() => onAvailabilityChange(availabilityFilter === tag.name ? null : tag.name)}
          >
            {tag.name}
          </Pill>
        ))}
      </div>
    </>
  );
}
