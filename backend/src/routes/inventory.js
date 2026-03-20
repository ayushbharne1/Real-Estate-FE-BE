import express from "express";
const router = express.Router();
import {
  createProperty, getProperties, getProperty, getSimilar,
  updateProperty, deleteProperty, getAssetTypeCounts,
  getSuggestions,getKeywords,
} from "../controllers/inventoryController.js";
import { protect }              from "../middleware/auth.js";
import { uploadProperty }       from "../config/cloudinary.js";
import { validateQuery }        from "../middleware/validate.js";
import { dashboardQuerySchema } from "shared/schemas";

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Property listings — create, read, edit, delete
 */

// ─────────────────────────────────────────────────────────────
// POST /api/inventory  — Create property
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new property (images + video uploaded to Cloudinary)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - listingType
 *               - assetType
 *               - possession
 *               - address
 *               - state
 *               - city
 *               - pincode
 *               - description
 *             properties:
 *
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Property photos — max 10, each <= 10 MB (JPEG/PNG/WebP)"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "Walkthrough video — max 1, <= 100 MB (MP4/WebM/MOV). Optional."
 *
 *               name:
 *                 type: string
 *               listingType:
 *                 type: string
 *                 enum: [RESALE, RENTAL]
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
 *               possession:
 *                 type: string
 *                 enum: [READY_TO_MOVE, UNDER_CONSTRUCTION, NEW_LAUNCH, RESALE_READY]
 *               address:
 *                 type: string
 *               area:
 *                 type: string
 *                 description: "Locality / micromarket e.g. Whitefield"
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               bedrooms:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *               balconies:
 *                 type: number
 *               seats:
 *                 type: number
 *                 description: "Office Space only — number of seats"
 *
 *               doorFacing:
 *                 type: string
 *                 enum: [NORTH, SOUTH, EAST, WEST, NORTH_EAST, NORTH_WEST, SOUTH_EAST, SOUTH_WEST]
 *               ageOfBuilding:
 *                 type: string
 *               floorNumber:
 *                 type: string
 *               furnishing:
 *                 type: string
 *                 enum: [UNFURNISHED, SEMI_FURNISHED, FULLY_FURNISHED]
 *               sbua:
 *                 type: number
 *                 description: "Super Built-Up Area in sq.ft"
 *               plotArea:
 *                 type: number
 *               uds:
 *                 type: number
 *               apartmentType:
 *                 type: string
 *               balconyFacing:
 *                 type: string
 *               structure:
 *                 type: string
 *               totalRooms:
 *                 type: number
 *               waterSupply:
 *                 type: string
 *               totalFloors:
 *                 type: number
 *
 *               askPrice:
 *                 type: number
 *               priceUnit:
 *                 type: string
 *                 enum: [LAKHS, CRORES]
 *               pricePerSqft:
 *                 type: number
 *               rentPerMonth:
 *                 type: number
 *               rentUnit:
 *                 type: string
 *               deposit:
 *                 type: number
 *               depositUnit:
 *                 type: string
 *               maintenance:
 *                 type: string
 *               commissionType:
 *                 type: string
 *
 *               
 *               extraRooms:
 *                 type: string
 *                 description: "JSON array e.g. [\"STUDY_ROOM\",\"SERVANT_ROOM\"]"
 *               cornerUnit:
 *                 type: boolean
 *               exclusive:
 *                 type: boolean
 *               parking:
 *                 type: string
 *                 enum: [NONE, ONE, TWO, THREE_PLUS, OPEN, COVERED]
 *               preferredTenant:
 *                 type: string
 *                 enum: [FAMILY, BACHELOR, COMPANY, ANY]
 *               petAllowed:
 *                 type: boolean
 *               nonVegAllowed:
 *                 type: boolean
 *               amenities:
 *                 type: string
 *                 description: "JSON array e.g. [\"GYM\",\"LIFTS\"]"
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Property created — images and video stored in Cloudinary
 *       400:
 *         description: "Validation error (e.g. more than 10 images, unsupported format)"
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, uploadProperty, createProperty);

// ─────────────────────────────────────────────────────────────
// GET /api/inventory
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all properties with filters, sorting, and pagination
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
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
 *         name: bhkTypes
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: budgetMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: budgetMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: sbuaMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: sbuaMax
 *         schema:
 *           type: number
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - PRICE_LOW_TO_HIGH
 *             - PRICE_HIGH_TO_LOW
 *             - NEWEST_FIRST
 *             - OLDEST_FIRST
 *             - PRICE_SQFT_LOW_TO_HIGH
 *             - PRICE_SQFT_HIGH_TO_LOW
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
 *         description: Paginated list of properties
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, validateQuery(dashboardQuerySchema), getProperties);

// ─────────────────────────────────────────────────────────────
//  GET /api/inventory/asset-type-counts
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/asset-type-counts:
 *   get:
 *     summary: Get count of properties grouped by asset type
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of asset types with their property counts
 *       401:
 *         description: Unauthorized
 */
router.get("/asset-type-counts", protect, getAssetTypeCounts);





/**
 * @swagger
 * /api/inventory/suggestions:
 *   get:
 *     summary: Get search suggestions for properties
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: "Search query string"
 *     responses:
 *       200:
 *         description: List of matching property suggestions (max 8)
 *       401:
 *         description: Unauthorized
 */
router.get("/suggestions", protect, getSuggestions);
 
// GET /api/inventory/keywords
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/keywords:
 *   get:
 *     summary: Get all keywords
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of keywords
 *       401:
 *         description: Unauthorized
 */
router.get("/keywords", protect, getKeywords);

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get a single property by ID
 *     tags: [Inventory]
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
 *         description: Property detail
 *       404:
 *         description: Property not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getProperty);

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id/similar
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/{id}/similar:
 *   get:
 *     summary: Get similar properties (same asset type)
 *     tags: [Inventory]
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
 *         description: Up to 4 similar properties
 *       404:
 *         description: Property not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id/similar", protect, getSimilar);

// ─────────────────────────────────────────────────────────────
// PUT /api/inventory/:id  — Edit / update property
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Edit an existing property (partial update — only send changed fields)
 *     tags: [Inventory]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "New image files to upload (appended to kept images)"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "New video file to replace existing one. Optional."
 *               existingImages:
 *                 type: string
 *                 description: "JSON array of current Cloudinary image URLs to keep"
 *               removeVideo:
 *                 type: boolean
 *                 description: "Pass true to delete the existing video"
 *               name:
 *                 type: string
 *               listingType:
 *                 type: string
 *                 enum: [RESALE, RENTAL]
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
 *               possession:
 *                 type: string
 *                 enum: [READY_TO_MOVE, UNDER_CONSTRUCTION, NEW_LAUNCH, RESALE_READY]
 *               address:
 *                 type: string
 *               area:
 *                 type: string
 *               state:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               bedrooms:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *               balconies:
 *                 type: number
 *               seats:
 *                 type: number
 *               doorFacing:
 *                 type: string
 *               ageOfBuilding:
 *                 type: string
 *               floorNumber:
 *                 type: string
 *               furnishing:
 *                 type: string
 *               sbua:
 *                 type: number
 *               plotArea:
 *                 type: number
 *               uds:
 *                 type: number
 *               totalRooms:
 *                 type: number
 *               waterSupply:
 *                 type: string
 *               totalFloors:
 *                 type: number
 *               pricePerSqft:
 *                 type: number
 *               askPrice:
 *                 type: number
 *               priceUnit:
 *                 type: string
 *               rentPerMonth:
 *                 type: number
 *               rentUnit:
 *                 type: string
 *               deposit:
 *                 type: number
 *               depositUnit:
 *                 type: string
 *               maintenance:
 *                 type: string
 *               commissionType:
 *                 type: string
 *               extraRooms:
 *                 type: string
 *                 description: "JSON array e.g. [\"STUDY_ROOM\"]"
 *               cornerUnit:
 *                 type: boolean
 *               exclusive:
 *                 type: boolean
 *               parking:
 *                 type: string
 *                 enum: [NONE, ONE, TWO, THREE_PLUS, OPEN, COVERED]
 *               preferredTenant:
 *                 type: string
 *                 enum: [FAMILY, BACHELOR, COMPANY, ANY]
 *               petAllowed:
 *                 type: boolean
 *               nonVegAllowed:
 *                 type: boolean
 *               amenities:
 *                 type: string
 *                 description: "JSON array e.g. [\"GYM\",\"LIFTS\"]"
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated property document
 *       404:
 *         description: Property not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, uploadProperty, updateProperty);

// ─────────────────────────────────────────────────────────────
// DELETE /api/inventory/:id  — soft delete
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Soft-delete a property (sets isActive to false)
 *     tags: [Inventory]
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
 *         description: Property deleted successfully
 *       404:
 *         description: Property not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteProperty);

export default router;