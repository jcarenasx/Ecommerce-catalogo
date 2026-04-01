import { availabilityTagRepository } from "../repositories/availabilityTagRepository";

function normalizeName(value: string): string {
  return value.trim();
}

export const availabilityTagService = {
  list() {
    return availabilityTagRepository.findAll();
  },

  async create(name: string) {
    const normalized = normalizeName(name);
    if (!normalized) {
      const error = new Error("El nombre de la etiqueta no puede estar vacío.");
      (error as any).status = 400;
      (error as any).code = "INVALID_NAME";
      throw error;
    }

    const existing = await availabilityTagRepository.findByName(normalized);
    if (existing) {
      const error = new Error("Ya existe una etiqueta con ese nombre.");
      (error as any).status = 409;
      (error as any).code = "AVAILABILITY_TAG_EXISTS";
      throw error;
    }

    return availabilityTagRepository.create(normalized);
  },

  async remove(id: string) {
    const tag = await availabilityTagRepository.findById(id);
    if (!tag) {
      const error = new Error("No se encontró la etiqueta solicitada.");
      (error as any).status = 404;
      (error as any).code = "AVAILABILITY_TAG_NOT_FOUND";
      throw error;
    }

    const usage = await availabilityTagRepository.countProductsUsing(id);
    if (usage > 0) {
      const error = new Error("La etiqueta está asignada a productos activos.");
      (error as any).status = 409;
      (error as any).code = "AVAILABILITY_TAG_IN_USE";
      throw error;
    }

    return availabilityTagRepository.delete(id);
  },
};
