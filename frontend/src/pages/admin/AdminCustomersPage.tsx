import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useCustomers } from "../../hooks/useCustomers";

const NOTIFICATION_MESSAGE = "Tenemos nuevos productos disponibles en el catálogo 👇";

function buildWhatsAppLink(phone: string): string {
  const baseUrl = window.location.origin;
  const encodedMessage = encodeURIComponent(`${NOTIFICATION_MESSAGE}\n${baseUrl}`);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

export default function AdminCustomersPage() {
  const { data: customers = [], isLoading, isError, error } = useCustomers();

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Clientes
        </p>
        <h1 className="text-3xl font-semibold text-stone-900">Clientes registrados</h1>
        <p className="max-w-2xl text-sm text-stone-600">
          Contacta directamente a los clientes por WhatsApp para avisarles de nuevos productos.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-stone-900">Lista de clientes</h2>
        </div>
        <div className="border-b border-stone-200 px-5 py-5">
          {isLoading && (
            <p className="flex items-center gap-2 text-sm text-stone-500">
              <Loader />
              Cargando clientes...
            </p>
          )}
          {isError && (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error instanceof Error ? error.message : "No se pudieron cargar los clientes."}
            </p>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.3em] text-stone-500">
              <tr>
                <th className="px-5 py-3">Nombre</th>
                <th className="px-5 py-3">Teléfono</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {!isLoading && customers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-sm text-stone-500">
                    No hay clientes registrados aún.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-5 py-4 text-stone-700 font-semibold">{customer.name}</td>
                    <td className="px-5 py-4 text-stone-700">{customer.phone}</td>
                    <td className="px-5 py-4 text-right">
                      <a
                        href={buildWhatsAppLink(customer.phone)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="ghost">Enviar WhatsApp</Button>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
