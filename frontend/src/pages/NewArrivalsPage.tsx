import { useProducts } from "../hooks/useProducts";
import { getRecentProducts } from "../lib/catalog";
import ProductSection from "../components/catalog/ProductSection";

export default function NewArrivalsPage() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const newestProducts = getRecentProducts(products);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.75rem)] w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:py-8">
      {isLoading ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          Cargando productos...
        </p>
      ) : null}

      {isError ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
          {error instanceof Error ? error.message : "No se pudieron cargar productos."}
        </p>
      ) : null}

      {!isLoading && !isError && newestProducts.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          No hay productos nuevos por mostrar.
        </p>
      ) : null}

      {!isLoading && !isError && newestProducts.length > 0 ? (
        <ProductSection
          eyebrow="Catalogo"
          title="Mira lo nuevo"
          description="Selección ordenada por fecha de publicación."
          products={newestProducts}
        />
      ) : null}
    </main>
  );
}
