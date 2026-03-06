import express from "express";
const router = express.Router();
import { protect } from "../middleware/auth.js";
import { success } from "../utils/response.js";
import {
  ASSET_TYPE_OPTIONS,
  POSSESSION_OPTIONS,
  AMENITY_OPTIONS,
} from "shared/constants";

/**
 * @swagger
 * tags:
 *   name: Config
 *   description: Dropdown option lists for UI
 */

/**
 * @swagger
 * /api/config/asset-types:
 *   get:
 *     summary: Get asset type options
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of asset type options
 */
router.get("/asset-types", protect, (_req, res) => success(res, ASSET_TYPE_OPTIONS));

/**
 * @swagger
 * /api/config/possession:
 *   get:
 *     summary: Get possession status options
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of possession options
 */
router.get("/possession", protect, (_req, res) => success(res, POSSESSION_OPTIONS));

/**
 * @swagger
 * /api/config/amenities:
 *   get:
 *     summary: Get amenity options
 *     tags: [Config]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of amenity options with icons
 */
router.get("/amenities", protect, (_req, res) => success(res, AMENITY_OPTIONS));

export default router;