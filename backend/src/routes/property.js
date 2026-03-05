import { Router } from "express";
import { getProperties, getProperty, getSimilar } from "../controllers/propertyController.js";
import { protect } from "../middleware/auth.js";
import { validateQuery } from "../middleware/validate.js";
import { dashboardQuerySchema } from "shared/schemas";

const router = Router();

router.get("/",          protect, validateQuery(dashboardQuerySchema), getProperties);
router.get("/:id",       protect, getProperty);
router.get("/:id/similar", protect, getSimilar);

export default router;