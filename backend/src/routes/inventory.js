import express from "express";
const router = express.Router();
import { createProperty } from "../controllers/inventoryController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";
import { UPLOAD } from "shared/constants";

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Create property listings
 */

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new property (with image upload to Cloudinary)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, listingType, assetType, possession, address, state, city, pincode, ageOfBuilding, parking, furnishing, askPrice, sbua, amenities, description]
 *             properties:
 *               images:          { type: array, items: { type: string, format: binary }, description: "Property photos (max 15)" }
 *               name:            { type: string }
 *               listingType:     { type: string, enum: [RESALE, RENTAL] }
 *               assetType:       { type: string }
 *               possession:      { type: string }
 *               address:         { type: string }
 *               state:           { type: string }
 *               city:            { type: string }
 *               pincode:         { type: string }
 *               apartmentType:   { type: string }
 *               doorFacing:      { type: string }
 *               ageOfBuilding:   { type: string }
 *               floorNumber:     { type: string }
 *               bedrooms:        { type: number }
 *               bathrooms:       { type: number }
 *               balconies:       { type: number }
 *               parking:         { type: string }
 *               furnishing:      { type: string }
 *               pricePerSqft:    { type: number }
 *               askPrice:        { type: number }
 *               priceUnit:       { type: string, enum: [LAKHS, CRORES] }
 *               sbua:            { type: number }
 *               amenities:       { type: string, description: "JSON array string e.g. [\"GYM\",\"LIFTS\"]" }
 *               customAmenities: { type: string, description: "JSON array string e.g. [\"EV Charging\"]" }
 *               description:     { type: string }
 *     responses:
 *       201:
 *         description: Property created with Cloudinary image URLs
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data: { $ref: '#/components/schemas/Property' }
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  protect,
  upload.array("images", UPLOAD.IMAGE_MAX_COUNT),
  createProperty
);

export default router;