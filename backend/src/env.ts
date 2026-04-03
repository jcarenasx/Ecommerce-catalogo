import "dotenv/config";
import path from "path";
import { z } from "zod";

const allowedSameSiteValues = ["lax", "strict", "none"] as const;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  WEB_ORIGIN: z.string().optional(),
  WEB_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(16),
  COOKIE_NAME: z.string().min(1).default("ecom_access"),
  COOKIE_SECURE: z.string().optional(),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SAME_SITE: z.enum(allowedSameSiteValues).default("lax"),
  TRUST_PROXY: z.string().optional(),
  UPLOAD_DIRECTORY: z.string().min(1).default("uploads"),
  AWS_REGION: z.string().min(1).default("us-east-1"),
  S3_BUCKET_NAME: z.string().min(1).optional(),
  S3_KEY_PREFIX: z.string().default("catalog"),
  S3_UPLOAD_MAX_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(5_242_880), // 5 MB by default
  S3_ALLOWED_CONTENT_TYPES: z
    .string()
    .default("image/jpeg,image/png,image/webp,avif"),
  S3_PUBLIC_URL_BASE: z.string().optional(),
  S3_ENDPOINT: z.string().optional(),
});

const parsed = envSchema.parse(process.env);

function parseOptionalUrl(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return z.string().url().parse(trimmed);
}

function parseOrigins(nodeEnv: string, webOrigins?: string, webOrigin?: string) {
  const raw = [webOrigins, webOrigin].filter(Boolean).join(",");
  if (raw.trim() === "") {
    if (nodeEnv === "development") {
      return ["http://localhost:5173", "http://127.0.0.1:5173"];
    }
    return [];
  }

  const seen = new Set<string>();
  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => z.string().url().parse(origin))
    .filter((origin) => {
      if (seen.has(origin)) return false;
      seen.add(origin);
      return true;
    });
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) return fallback;
  return value === "true";
}

function parseTrustProxy(value: string | undefined, nodeEnv: string) {
  if (!value || value.trim() === "") {
    return nodeEnv === "production" ? 1 : 0;
  }

  if (value === "true") return 1;
  if (value === "false") return 0;

  const numericValue = Number(value);
  if (Number.isInteger(numericValue) && numericValue >= 0) {
    return numericValue;
  }

  throw new Error("TRUST_PROXY must be true, false, or a non-negative integer.");
}

const isProduction = parsed.NODE_ENV === "production";
const cookieSecureDefault = isProduction || parsed.COOKIE_SAME_SITE === "none";
const allowedContentTypes = parsed.S3_ALLOWED_CONTENT_TYPES.split(",")
  .map((type) => type.trim())
  .filter(Boolean);
const s3KeyPrefix = parsed.S3_KEY_PREFIX.replace(/^\/+|\/+$/g, "");

export const env = {
  ...parsed,
  WEB_ORIGINS: parseOrigins(parsed.NODE_ENV, parsed.WEB_ORIGINS, parsed.WEB_ORIGIN),
  COOKIE_SECURE: parseBoolean(parsed.COOKIE_SECURE, cookieSecureDefault),
  COOKIE_DOMAIN: parsed.COOKIE_DOMAIN?.trim() || undefined,
  TRUST_PROXY: parseTrustProxy(parsed.TRUST_PROXY, parsed.NODE_ENV),
  UPLOAD_DIRECTORY_ABSOLUTE: path.resolve(process.cwd(), parsed.UPLOAD_DIRECTORY),
  S3_ALLOWED_CONTENT_TYPES: allowedContentTypes,
  S3_KEY_PREFIX: s3KeyPrefix,
  S3_PUBLIC_URL_BASE: parseOptionalUrl(parsed.S3_PUBLIC_URL_BASE),
  S3_ENDPOINT: parseOptionalUrl(parsed.S3_ENDPOINT),
  isProduction,
};
