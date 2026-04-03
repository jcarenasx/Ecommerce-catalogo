import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { Express } from "express";
import { env } from "../env.js";
import { HttpError } from "../utils/httpError.js";

const ensureUploadsDirectory = () => {
  const uploadPath = env.UPLOAD_DIRECTORY_ABSOLUTE;
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

const s3Client = env.S3_BUCKET_NAME
  ? new S3Client({
      region: env.AWS_REGION,
      ...(env.S3_ENDPOINT
        ? {
            endpoint: env.S3_ENDPOINT,
            forcePathStyle: true,
          }
        : {}),
    })
  : null;

function sanitizeFilename(originalname: string) {
  return originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function encodeObjectKey(key: string) {
  return key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

function buildObjectKey(filename: string) {
  return env.S3_KEY_PREFIX ? `${env.S3_KEY_PREFIX}/${filename}` : filename;
}

function buildPublicUrl(key: string) {
  const encodedKey = encodeObjectKey(key);

  if (env.S3_PUBLIC_URL_BASE) {
    const base = env.S3_PUBLIC_URL_BASE.endsWith("/")
      ? env.S3_PUBLIC_URL_BASE
      : `${env.S3_PUBLIC_URL_BASE}/`;
    return new URL(encodedKey, base).toString();
  }

  if (env.S3_ENDPOINT && env.S3_BUCKET_NAME) {
    return `${env.S3_ENDPOINT.replace(/\/+$/g, "")}/${env.S3_BUCKET_NAME}/${encodedKey}`;
  }

  if (!env.S3_BUCKET_NAME) {
    throw new Error("Cannot build an S3 URL without a bucket name.");
  }

  return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${encodedKey}`;
}

function assertValidFile(file: Pick<Express.Multer.File, "mimetype" | "size" | "originalname">) {
  if (!env.S3_ALLOWED_CONTENT_TYPES.includes(file.mimetype)) {
    throw new HttpError(
      400,
      "UNSUPPORTED_MEDIA_TYPE",
      `El archivo "${file.originalname}" no tiene un formato permitido.`
    );
  }

  if (file.size > env.S3_UPLOAD_MAX_BYTES) {
    throw new HttpError(
      400,
      "FILE_TOO_LARGE",
      `El archivo "${file.originalname}" excede el límite permitido.`
    );
  }
}

async function saveToLocalStorage(file: Express.Multer.File) {
  const uploadDir = ensureUploadsDirectory();
  const sanitized = sanitizeFilename(file.originalname);
  const filename = `${Date.now()}-${randomUUID()}-${sanitized}`;
  const filepath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filepath, file.buffer);
  return `/uploads/${filename}`;
}

async function saveToS3(file: Express.Multer.File) {
  if (!s3Client || !env.S3_BUCKET_NAME) {
    throw new Error("S3 client is not configured.");
  }

  const sanitized = sanitizeFilename(file.originalname);
  const filename = `${Date.now()}-${randomUUID()}-${sanitized}`;
  const key = buildObjectKey(filename);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return buildPublicUrl(key);
}

export const mediaRepository = {
  async saveFiles(files: Express.Multer.File[]): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      assertValidFile(file);
      const url = env.S3_BUCKET_NAME
        ? await saveToS3(file)
        : await saveToLocalStorage(file);
      urls.push(url);
    }

    return urls;
  },
};
