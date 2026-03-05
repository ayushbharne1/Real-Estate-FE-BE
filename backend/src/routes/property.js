import express from "express";
const router = express.Router();
import { getProperties, getProperty, getSimilar } from "../controllers/propertyController.js";
import { protect } from "../middleware/auth.js";
import { validateQuery } from "../middleware/validate.js";
import { dashboardQuerySchema } from "shared/schemas";

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property listings
 */

/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: Get all properties with filters, sorting, and pagination
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: listingType
 *         schema: { type: string, enum: [RESALE, RENTAL] }
 *       - in: query
 *         name: assetType
 *         schema: { type: string }
 *       - in: query
 *         name: bhkTypes
 *         schema: { type: array, items: { type: string } }
 *       - in: query
 *         name: budgetMin
 *         schema: { type: number }
 *       - in: query
 *         name: budgetMax
 *         schema: { type: number }
 *       - in: query
 *         name: sbuaMin
 *         schema: { type: number }
 *       - in: query
 *         name: sbuaMax
 *         schema: { type: number }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW, NEWEST_FIRST, OLDEST_FIRST, PRICE_SQFT_LOW_TO_HIGH, PRICE_SQFT_HIGH_TO_LOW] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated list of properties
 */
router.get("/", protect, validateQuery(dashboardQuerySchema), getProperties);

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get a single property by ID
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Property detail
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Property' }
 *       404:
 *         description: Property not found
 */
router.get("/:id", protect, getProperty);

/**
 * @swagger
 * /api/properties/{id}/similar:
 *   get:
 *     summary: Get similar properties (same type + city)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Up to 4 similar properties
 */
router.get("/:id/similar", protect, getSimilar);

export default router;