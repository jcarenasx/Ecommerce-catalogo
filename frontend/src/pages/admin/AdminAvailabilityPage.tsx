import { useState } from "react";
import type { FormEvent } from "react";
import Button from "../../components/ui/Button";
import Loader from "../../components/ui/Loader";
import { useAvailabilityTags } from "../../hooks/useAvailabilityTags";
import { useAdminAvailabilityTags } from "../../hooks/useAdminAvailabilityTags";

export default function AdminAvailabilityPage() {
  const { data: tags = [], isLoading, isError, error } = useAvailabilityTags();
  const { createTag, deleteTag } = useAdminAvailabilityTags();
  const [newTagName, setNewTagName] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);

  const handleCreateTag = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackMessage(null);
    setErrorMessage(null);

    const trimmedName = newTagName.trim();
    if (trimmedName === "") {
      setErrorMessage("Escribe el nombre de la etiqueta antes de crearla.");
      return;
    }

    try {
      await createTag.mutateAsync(trimmedName);
      setFeedbackMessage("Etiqueta creada correctamente.");
      setNewTagName("");
    } catch (createError) {
      const message =
        createError instanceof Error ? createError.message : "No se pudo crear la etiqueta.";
      setErrorMessage(message);
    }
  };

  const handleDeleteTag = async (id: string) => {
    setFeedbackMessage(null);
    setErrorMessage(null);
    setDeletingTagId(id);
    try {
      await deleteTag.mutateAsync(id);
      setFeedbackMessage("Etiqueta eliminada.");
    } catch (deleteError) {
      const message =
        deleteError instanceof Error ? deleteError.message : "No se pudo eliminar la etiqueta.";
      setErrorMessage(message);
    } finally {
      setDeletingTagId(null);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">
          Disponibilidad
        </p>
        <h1 className="text-3xl font-semibold text-stone-900">Etiquetas de disponibilidad</h1>
        <p className="max-w-2xl text-sm text-stone-600">
          Gestiona las etiquetas que se pueden asignar a los productos desde el catálogo.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-stone-900">Etiquetas disponibles</h2>
          </div>
          <div className="border-b border-stone-200 px-5 py-5">
            <p className="text-sm text-stone-600">
              Estas etiquetas están disponibles para asignarse desde el formulario de productos.
            </p>
            {isLoading && (
              <p className="mt-4 flex items-center gap-2 text-sm text-stone-500">
                <Loader />
                Cargando etiquetas...
              </p>
            )}
            {isError && (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error instanceof Error ? error.message : "No se pudieron cargar las etiquetas."}
              </p>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-stone-50 text-left text-xs uppercase tracking-[0.3em] text-stone-500">
                <tr>
                  <th className="px-5 py-3">Nombre</th>
                  <th className="px-5 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {!isLoading && tags.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-5 py-6 text-center text-sm text-stone-500">
                      No hay etiquetas aún. Crea una para empezar.
                    </td>
                  </tr>
                ) : (
                  tags.map((tag) => (
                    <tr key={tag.id}>
                      <td className="px-5 py-4 text-stone-700">{tag.name}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-start gap-2">
                          <Button
                            variant="ghost"
                            type="button"
                            disabled={deleteTag.isPending && deletingTagId === tag.id}
                            onClick={() => handleDeleteTag(tag.id)}
                          >
                            {deleteTag.isPending && deletingTagId === tag.id
                              ? "Eliminando..."
                              : "Eliminar"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Crear nueva etiqueta</h2>
              <p className="mt-1 text-sm text-stone-600">
                Añadir una etiqueta permitirá que se use desde el formulario de productos.
              </p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleCreateTag}>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-stone-700">Nombre</span>
              <input
                type="text"
                value={newTagName}
                onChange={(event) => setNewTagName(event.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2.5 text-stone-900 outline-none transition focus:border-stone-500"
                placeholder="Por ejemplo: Bajo pedido"
                disabled={createTag.isPending}
              />
            </label>

            {feedbackMessage && (
              <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {feedbackMessage}
              </p>
            )}
            {errorMessage && (
              <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={createTag.isPending}>
              {createTag.isPending ? "Creando etiqueta..." : "Crear etiqueta"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
