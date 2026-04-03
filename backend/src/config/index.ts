import { env } from "../env.js";

export const config = {
  env: env.NODE_ENV,
  port: env.PORT,
  databaseUrl: env.DATABASE_URL,
  jwtSecret: env.JWT_ACCESS_SECRET,
  cookieName: env.COOKIE_NAME,
  cookieSecure: env.COOKIE_SECURE,
  uploadDirectory: env.UPLOAD_DIRECTORY,
  bucketName: env.S3_BUCKET_NAME,
  awsRegion: env.AWS_REGION,
  maxUploadBytes: env.S3_UPLOAD_MAX_BYTES,
  allowedContentTypes: env.S3_ALLOWED_CONTENT_TYPES,
};
