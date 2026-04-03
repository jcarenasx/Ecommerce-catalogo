import fs from "fs/promises";
import path from "path";
import type { Express } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { mediaRepository } from "../repositories/mediaRepository.js";

const usage = `
Uso:
  npm run catalog:import -- ./catalog/catalog.json
`;

const imageExtensionsToMimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

const catalogProductSchema = z.object({
  model: z.string().trim().min(1),
  name: z.string().trim().min(1).optional(),
  sku: z.string().trim().min(1).optional().nullable(),
  size: z.string().trim().min(1).optional().nullable(),
  color: z.string().trim().min(1).optional().nullable(),
  category: z.string().trim().min(1).optional().nullable(),
  brand: z.string().trim().min(1).optional().nullable(),
  priceCents: z.number().int().nonnegative().optional().nullable(),
  paymentLinkWithShipping: z.string().trim().url().optional().nullable(),
  paymentLinkWithoutShipping: z.string().trim().url().optional().nullable(),
  images: z.array(z.string().trim().min(1)).optional(),
  active: z.boolean().optional(),
  availabilityTag: z.string().trim().min(1).optional().nullable(),
});

const catalogSchema = z.array(catalogProductSchema);

type CatalogProduct = z.infer<typeof catalogProductSchema>;

function normalizeOptionalText(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function inferMimeType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  const mimeType = imageExtensionsToMimeTypes[extension];

  if (!mimeType) {
    throw new Error(`No se reconoce el tipo de archivo de imagen: ${filePath}`);
  }

  return mimeType;
}

async function loadLocalImages(imagePaths: string[], catalogDirectory: string) {
  const files: Express.Multer.File[] = [];

  for (const imagePath of imagePaths) {
    const absolutePath = path.isAbsolute(imagePath)
      ? imagePath
      : path.resolve(catalogDirectory, imagePath);
    const buffer = await fs.readFile(absolutePath);

    files.push({
      fieldname: "files",
      originalname: path.basename(absolutePath),
      encoding: "7bit",
      mimetype: inferMimeType(absolutePath),
      size: buffer.byteLength,
      buffer,
      stream: undefined as never,
      destination: "",
      filename: "",
      path: absolutePath,
    });
  }

  return mediaRepository.saveFiles(files);
}

async function resolveAvailabilityTagId(name?: string | null) {
  const trimmed = normalizeOptionalText(name);
  if (!trimmed) return null;

  const tag = await prisma.availabilityTag.upsert({
    where: { name: trimmed },
    update: {},
    create: { name: trimmed },
  });

  return tag.id;
}

async function importCatalog(catalogPath: string) {
  const absoluteCatalogPath = path.resolve(process.cwd(), catalogPath);
  const catalogDirectory = path.dirname(absoluteCatalogPath);
  const rawContent = await fs.readFile(absoluteCatalogPath, "utf8");
  const parsedContent = catalogSchema.parse(JSON.parse(rawContent));

  let created = 0;
  let updated = 0;

  for (const item of parsedContent) {
    const remoteImages = (item.images ?? []).filter((image) => /^https?:\/\//i.test(image));
    const localImages = (item.images ?? []).filter((image) => !/^https?:\/\//i.test(image));
    const uploadedImages =
      localImages.length > 0 ? await loadLocalImages(localImages, catalogDirectory) : [];
    const availabilityTagId = await resolveAvailabilityTagId(item.availabilityTag);

    const payload = {
      name: item.name?.trim() || item.model,
      sku: normalizeOptionalText(item.sku),
      size: normalizeOptionalText(item.size),
      color: normalizeOptionalText(item.color),
      model: item.model.trim(),
      category: normalizeOptionalText(item.category),
      brand: normalizeOptionalText(item.brand),
      priceCents: item.priceCents ?? null,
      paymentLinkWithShipping: normalizeOptionalText(item.paymentLinkWithShipping),
      paymentLinkWithoutShipping: normalizeOptionalText(item.paymentLinkWithoutShipping),
      images: [...remoteImages, ...uploadedImages],
      active: item.active ?? true,
      availabilityTagId,
    };

    const existing = await prisma.product.findUnique({
      where: { model: payload.model },
      select: { model: true },
    });

    await prisma.product.upsert({
      where: { model: payload.model },
      update: payload,
      create: payload,
    });

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  console.log(`Catalogo importado. Creados: ${created}. Actualizados: ${updated}.`);
}

async function main() {
  const catalogPath = process.argv[2];

  if (!catalogPath) {
    console.error(usage.trim());
    process.exitCode = 1;
    return;
  }

  await importCatalog(catalogPath);
}

main()
  .catch(async (error) => {
    console.error("No se pudo importar el catálogo.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
