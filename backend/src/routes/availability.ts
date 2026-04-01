import { Router } from "express";
import { requireAdmin } from "../middleware/requireAdmin";
import { requireAuth } from "../middleware/requireAuth";
import { availabilityTagController } from "../controllers/availabilityTagController";

const router = Router();

router.get("/", availabilityTagController.list);
router.post("/", requireAuth, requireAdmin, availabilityTagController.create);
router.delete("/:id", requireAuth, requireAdmin, availabilityTagController.remove);

export default router;
