import { Router } from "express";
import { login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema } from "shared/schemas";

const router = Router();

router.post("/login", validateBody(loginSchema), login);
router.get("/me", protect, getMe);

export default router;