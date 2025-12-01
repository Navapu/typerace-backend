import { Router } from "express";
import { health, healthExtended } from "../controllers/health.controller.js";

const router = Router();

router.get("/health", health);
router.get("/health/extended", healthExtended);

export default router;
