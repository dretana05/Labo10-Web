import { Router } from "express";
import { createSale } from "../controllers/sales.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.post("/", createSale);

export default router;