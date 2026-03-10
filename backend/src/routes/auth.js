import { Router } from "express";
import { createAdmin, login, logout, getMe } from "../controllers/authController.js";
import { protect }        from "../middleware/auth.js";
import { validateBody }   from "../middleware/validate.js";
import { uploadAvatar }   from "../config/cloudinary.js";
import { loginSchema }    from "shared/schemas/index.js";
import { z } from "zod";

const router = Router();

const createAdminSchema = z.object({
  userName: z.string().min(2, "Username is required"),
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Admin authentication
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new admin account (with optional avatar)
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [userName, email, password]
 *             properties:
 *               userName: { type: string, example: "johndoe" }
 *               email:    { type: string, format: email, example: "admin@example.com" }
 *               password: { type: string, example: "secret123" }
 *               image:    { type: string, format: binary, description: "Optional avatar image" }
 *     responses:
 *       201: { description: Admin created }
 *       409: { description: Email or username already exists }
 */
router.post("/register", uploadAvatar.single("image"), validateBody(createAdminSchema), createAdmin);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email or username
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier: { type: string, example: "admin@example.com or johndoe" }
 *               password:   { type: string }
 *     responses:
 *       200: { description: Login successful, sets httpOnly cookie }
 *       401: { description: Invalid credentials }
 */
router.post("/login", validateBody(loginSchema), login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and clear cookie
 *     tags: [Auth]
 *     responses:
 *       200: { description: Logged out }
 */
router.post("/logout", protect, logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current admin
 *     tags: [Auth]
 *     responses:
 *       200: { description: Admin profile }
 *       401: { description: Unauthorized }
 */
router.get("/me", protect, getMe);

export default router;