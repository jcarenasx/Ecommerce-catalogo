import { Router } from "express";
import multer from "multer";
import { env } from "../env.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { mediaController } from "../controllers/mediaController.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.S3_UPLOAD_MAX_BYTES },
});

router.post(
  "/upload",
  requireAuth,
  requireAdmin,
  upload.array("files"),
  mediaController.upload
);

export default router;
