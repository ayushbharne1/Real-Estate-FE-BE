import { Router } from "express";
import { createProperty } from "../controllers/inventoryController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { inventoryCreateSchema } from "shared/schemas";

const router = Router();

router.post("/", protect, validateBody(inventoryCreateSchema), createProperty);

export default router;