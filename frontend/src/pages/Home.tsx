import { useEffect, useMemo, useState } from "react";
import CatalogFilters from "../components/catalog/CatalogFilters";
import CatalogIntro from "../components/catalog/CatalogIntro";
import NotificationSignupModal from "../components/catalog/NotificationSignupModal";
import ProductGrid from "../components/catalog/ProductGrid";
import { useAvailabilityTags } from "../hooks/useAvailabilityTags";
import { useProductBrands } from "../hooks/useProductBrands";
import { useProductCategories } from "../hooks/useProductCategories";
import { useProducts } from "../hooks/useProducts";
import { registerCustomer } from "../services/customerService";

const NOTIFICATION_KEY = "acceptedNotifications";

export default function Home() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [brandFilter, setBrandFilter] = useState<string | null>(null);
  const [availabilityFilter, setAvailabilityFilter] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: products = [], isLoading, isError, error } = useProducts({
    category: categoryFilter ?? undefined,
    brand: brandFilter ?? undefined,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useProductCategories();
  const { data: brands = [], isLoading: brandsLoading } = useProductBrands();
  const { data: availabilityTags = [], isLoading: availabilityLoading } = useAvailabilityTags();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesAvailability =
        !availabilityFilter || product.availabilityTag?.name === availabilityFilter;

      return matchesAvailability;
    });
  }, [availabilityFilter, products]);

  useEffect(() => {
    const saved = window.localStorage.getItem(NOTIFICATION_KEY);
    if (!saved) {
      setShowModal(true);
    }
  }, []);

  const handleDecline = () => {
    window.localStorage.setItem(NOTIFICATION_KEY, "declined");
    setShowModal(false);
  };

  const handleAccept = async () => {
    if (!name.trim() || !phone.trim()) {
      setFormError("Ingresa tu nombre y WhatsApp para recibir avisos.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);
    try {
      await registerCustomer({ name: name.trim(), phone: phone.trim() });
      window.localStorage.setItem(NOTIFICATION_KEY, "accepted");
      setShowModal(false);
    } catch {
      setFormError("No se pudo guardar tu preferencia. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4.75rem)] w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:py-8">
      <CatalogIntro description="Productos disponibles y bajo pedido." ctaLabel="Mira lo nuevo" ctaTo="/nuevo" />

      <CatalogFilters
        categories={categories}
        brands={brands}
        availabilityTags={availabilityTags}
        categoriesLoading={categoriesLoading}
        brandsLoading={brandsLoading}
        availabilityLoading={availabilityLoading}
        categoryFilter={categoryFilter}
        brandFilter={brandFilter}
        availabilityFilter={availabilityFilter}
        onCategoryChange={setCategoryFilter}
        onBrandChange={setBrandFilter}
        onAvailabilityChange={setAvailabilityFilter}
      />

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

      {!isLoading && !isError && filteredProducts.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          No hay productos con ese filtro.
        </p>
      ) : null}

      {!isLoading && !isError && filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : null}

      <NotificationSignupModal
        open={showModal}
        name={name}
        phone={phone}
        error={formError}
        isSubmitting={isSubmitting}
        onNameChange={setName}
        onPhoneChange={setPhone}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </main>
  );
}
