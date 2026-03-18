// backend/src/routes/buyer.js
import express from "express";
const router = express.Router();
import {
  createBuyer, getBuyers, getBuyer,
  updateBuyer, updateBuyerStatus, deleteBuyer,
} from "../controllers/buyerController.js";
import { protect }       from "../middleware/auth.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import {
  buyerCreateSchema, buyerUpdateSchema,
  buyerStatusSchema, buyerQuerySchema,
} from "shared/schemas/buyer.js";

/**
 * @swagger
 * tags:
 *   name: Buyers
 *   description: Buyer management — create, read, update status, delete
 */

// ─────────────────────────────────────────────────────────────
// POST /api/buyers
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/buyers:
 *   post:
 *     summary: Add a new buyer
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - contact
 *               - email
 *               - assetType
 *               - listingType
 *             properties:
 *               name:
 *                 type: string
 *               countryCode:
 *                 type: string
 *                 default: "+91"
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               propertyId:
 *                 type: string
 *                 description: "Optional reference to an inventory property ID e.g. PB5609"
 *               assetType:
 *                 type: string
 *                 enum:
 *                   - APARTMENT
 *                   - PLOT
 *                   - VILLA
 *                   - INDEPENDENT_HOUSE
 *                   - COMMERCIAL_SPACE
 *                   - ROW_HOUSE
 *                   - COMMERCIAL_PROPERTY
 *                   - VILAMENT
 *                   - OFFICE_SPACE
 *                   - RETAIL_SPACE
 *               listingType:
 *                 type: string
 *                 enum: [RESALE, RENTAL]
 *               askPrice:
 *                 type: number
 *                 description: "Resale only"
 *               askPriceUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               pricePaid:
 *                 type: number
 *                 description: "Resale only"
 *               pricePaidUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               rent:
 *                 type: number
 *                 description: "Rental only"
 *               rentUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               deposit:
 *                 type: number
 *                 description: "Rental only"
 *               depositUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               status:
 *                 type: string
 *                 enum: [IN_PROGRESS, ACTIVE, CANCELLED]
 *                 default: IN_PROGRESS
 *     responses:
 *       201:
 *         description: Buyer created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, validateBody(buyerCreateSchema), createBuyer);

// ─────────────────────────────────────────────────────────────
// GET /api/buyers
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/buyers:
 *   get:
 *     summary: Get all buyers with filters and pagination
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: "Search by name, email, contact, or property ID"
 *       - in: query
 *         name: listingType
 *         schema:
 *           type: string
 *           enum: [RESALE, RENTAL]
 *       - in: query
 *         name: assetType
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [IN_PROGRESS, ACTIVE, CANCELLED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Paginated list of buyers
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, validateQuery(buyerQuerySchema), getBuyers);

// ─────────────────────────────────────────────────────────────
// GET /api/buyers/:id
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/buyers/{id}:
 *   get:
 *     summary: Get a single buyer by ID
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Buyer detail
 *       404:
 *         description: Buyer not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getBuyer);

// ─────────────────────────────────────────────────────────────
// PUT /api/buyers/:id
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/buyers/{id}:
 *   put:
 *     summary: Update a buyer (partial update — send only changed fields)
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: "All fields optional — only send what changed"
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               email:
 *                 type: string
 *               propertyId:
 *                 type: string
 *               assetType:
 *                 type: string
 *               listingType:
 *                 type: string
 *                 enum: [RESALE, RENTAL]
 *               askPrice:
 *                 type: number
 *               askPriceUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               pricePaid:
 *                 type: number
 *               pricePaidUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               rent:
 *                 type: number
 *               rentUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               deposit:
 *                 type: number
 *               depositUnit:
 *                 type: string
 *                 enum: [THOUSANDS, LAKHS, CRORES]
 *               status:
 *                 type: string
 *                 enum: [IN_PROGRESS, ACTIVE, CANCELLED]
 *     responses:
 *       200:
 *         description: Updated buyer document
 *       404:
 *         description: Buyer not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, validateBody(buyerUpdateSchema), updateBuyer);

// ─────────────────────────────────────────────────────────────
// PATCH /api/buyers/:id/status
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/buyers/{id}/status:
 *   patch:
 *     summary: Update buyer status only (used by inline status dropdown in table)
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [IN_PROGRESS, ACTIVE, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Buyer not found
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/status", protect, validateBody(buyerStatusSchema), updateBuyerStatus);

// ─────────────────────────────────────────────────────────────
// DELETE /api/buyers/:id
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/buyers/{id}:
 *   delete:
 *     summary: Soft-delete a buyer (sets isActive to false)
 *     tags: [Buyers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Buyer deleted successfully
 *       404:
 *         description: Buyer not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteBuyer);

export default router;