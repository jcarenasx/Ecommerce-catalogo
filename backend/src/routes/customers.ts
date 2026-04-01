import { Router } from "express";
import { customerController } from "../controllers/customerController";

const router = Router();

router.post("/", customerController.create);
router.get("/", customerController.list);

export default router;
