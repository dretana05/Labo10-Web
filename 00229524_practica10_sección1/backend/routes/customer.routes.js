import { Router } from "express";
import { getCustomers } from "../controllers/customer.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyToken);

router.get("/", getCustomers);

export default router;