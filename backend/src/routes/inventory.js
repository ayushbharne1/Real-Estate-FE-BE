import express from "express";
const router = express.Router();
import {
  createProperty, getProperties, getProperty, getSimilar,
  updateProperty, deleteProperty,
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
 *     summary: Create a new property (images + video uploaded to Cloudinary in one request)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, listingType, assetType, possession, address, state, city, pincode, description]
 *             properties:
 *
 *               # ── Media ────────────────────────────────────────────────────
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *                 description: "Property photos — max 10, each ≤ 10 MB (JPEG/PNG/WebP). Default placeholder used if omitted."
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "Property walkthrough video — max 1, ≤ 100 MB (MP4/WebM/MOV). Optional."
 *
 *               # ── STEP 1: Basic Details ─────────────────────────────────────
 *               name:        { type: string }
 *               listingType: { type: string, enum: [RESALE, RENTAL] }
 *               assetType:
 *                 type: string
 *                 enum: [APARTMENT, PLOT, VILLA, INDEPENDENT_HOUSE, COMMERCIAL_SPACE,
 *                        ROW_HOUSE, COMMERCIAL_PROPERTY, VILAMENT, OFFICE_SPACE, RETAIL_SPACE]
 *               possession:
 *                 type: string
 *                 enum: [READY_TO_MOVE, UNDER_CONSTRUCTION, NEW_LAUNCH, RESALE_READY]
 *               address:  { type: string }
 *               area:     { type: string, description: "Locality / micromarket e.g. Whitefield" }
 *               state:    { type: string }
 *               city:     { type: string }
 *               pincode:  { type: string }
 *               bedrooms:  { type: number }
 *               bathrooms: { type: number }
 *               balconies: { type: number }
 *               seats:     { type: number, description: "Office Space only — No. of Seats" }
 *
 *               # ── STEP 2: Property Details ──────────────────────────────────
 *               doorFacing:
 *                 type: string
 *                 enum: [NORTH, SOUTH, EAST, WEST, NORTH_EAST, NORTH_WEST, SOUTH_EAST, SOUTH_WEST]
 *               ageOfBuilding:
 *                 type: string
 *                 enum: [NEW, ONE_TO_FIVE, FIVE_TO_TEN, TEN_PLUS]
 *               floorNumber:
 *                 type: string
 *                 enum: [GROUND, LOWER, MID, HIGH, ULTRA]
 *               structure:
 *                 type: string
 *                 enum: [G, G+1, G+2, G+3, G+4, G+5+]
 *               furnishing:
 *                 type: string
 *                 enum: [FURNISHED, SEMI_FURNISHED, UNFURNISHED, PLUG_AND_PLAY, WARM_SHELL]
 *               apartmentType: { type: string }
 *               balconyFacing:
 *                 type: string
 *                 enum: [NORTH, SOUTH, EAST, WEST, NORTH_EAST, NORTH_WEST, SOUTH_EAST, SOUTH_WEST]
 *                 description: "Row House only"
 *               sbua:        { type: number }
 *               plotArea:    { type: number }
 *               uds:         { type: number, description: "Villament only" }
 *               totalRooms:  { type: number, description: "Commercial Property only" }
 *               waterSupply: { type: string,  description: "Commercial Property only" }
 *               totalFloors: { type: number,  description: "Retail Space only" }
 *               pricePerSqft:   { type: number }
 *               askPrice:       { type: number, description: "Required for RESALE" }
 *               priceUnit:      { type: string, enum: [LAKHS, CRORES] }
 *               rentPerMonth:   { type: number, description: "Required for RENTAL" }
 *               rentUnit:       { type: string, enum: [LAKHS, CRORES] }
 *               deposit:        { type: number, description: "Rental Apartment only" }
 *               depositUnit:    { type: string, enum: [LAKHS, CRORES] }
 *               maintenance:    { type: string, enum: [INCLUDED, NOT_INCLUDED] }
 *               commissionType: { type: string, enum: [COMMISSION_SHARING, OWNER_PAYS, TENANT_PAYS] }
 *
 *               # ── STEP 3: More Details ──────────────────────────────────────
 *               buildingKhata:       { type: string, enum: [A, B] }
 *               landKhata:           { type: string, enum: [A, B] }
 *               eKhata:              { type: boolean }
 *               extraRooms:          { type: string, description: 'JSON array e.g. ["STUDY_ROOM"]' }
 *               cornerUnit:          { type: boolean }
 *               bioppaApprovedKhata: { type: boolean }
 *               exclusive:           { type: boolean }
 *               parking:             { type: string, enum: [NONE, ONE, TWO, THREE_PLUS, OPEN, COVERED] }
 *               preferredTenant:     { type: string, enum: [FAMILY, BACHELOR, COMPANY, ANY] }
 *               petAllowed:          { type: boolean }
 *               nonVegAllowed:       { type: boolean }
 *               amenities:           { type: string, description: 'JSON array e.g. ["GYM","LIFTS"]' }
 *               description:         { type: string }
 *
 *     responses:
 *       201: { description: Property created — images and video stored in Cloudinary }
 *       400: { description: Validation error (e.g. >10 images, >1 video, unsupported type) }
 *       401: { description: Unauthorized }
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
 *       - { in: query, name: search,      schema: { type: string } }
 *       - { in: query, name: listingType, schema: { type: string, enum: [RESALE, RENTAL] } }
 *       - { in: query, name: assetType,   schema: { type: string } }
 *       - { in: query, name: bhkTypes,    schema: { type: array, items: { type: string } } }
 *       - { in: query, name: budgetMin,   schema: { type: number } }
 *       - { in: query, name: budgetMax,   schema: { type: number } }
 *       - { in: query, name: sbuaMin,     schema: { type: number } }
 *       - { in: query, name: sbuaMax,     schema: { type: number } }
 *       - { in: query, name: sortBy,      schema: { type: string, enum: [PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW, NEWEST_FIRST, OLDEST_FIRST, PRICE_SQFT_LOW_TO_HIGH, PRICE_SQFT_HIGH_TO_LOW] } }
 *       - { in: query, name: page,        schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit,       schema: { type: integer, default: 20 } }
 *     responses:
 *       200: { description: Paginated list of properties }
 */
router.get("/", protect, validateQuery(dashboardQuerySchema), getProperties);

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
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Property detail }
 *       404: { description: Not found }
 */
router.get("/:id", protect, getProperty);

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id/similar
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/{id}/similar:
 *   get:
 *     summary: Get similar properties (same asset type + city)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Up to 4 similar properties }
 */
router.get("/:id/similar", protect, getSimilar);

// ─────────────────────────────────────────────────────────────
// PUT /api/inventory/:id  — Edit / update property
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Edit an existing property (partial update, images + video managed in one request)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             description: All fields optional — only send what changed.
 *             properties:
 *
 *               # ── Media ────────────────────────────────────────────────────
 *               images:
 *                 type: array
 *                 items: { type: string, format: binary }
 *                 description: "New photos to add (merged with existingImages, total max 10)"
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: "New video — replaces existing. Old video deleted from Cloudinary."
 *               existingImages:
 *                 type: string
 *                 description: >
 *                   JSON array of existing Cloudinary URLs to KEEP.
 *                   Images NOT in this list are deleted from Cloudinary.
 *                   Omit entirely to keep all existing images unchanged.
 *               removeVideo:
 *                 type: boolean
 *                 description: "Pass true to delete the existing video without uploading a new one."
 *
 *               name:            { type: string }
 *               listingType:     { type: string, enum: [RESALE, RENTAL] }
 *               assetType:       { type: string }
 *               possession:      { type: string }
 *               address:         { type: string }
 *               area:            { type: string }
 *               state:           { type: string }
 *               city:            { type: string }
 *               pincode:         { type: string }
 *               bedrooms:        { type: number }
 *               bathrooms:       { type: number }
 *               balconies:       { type: number }
 *               seats:           { type: number }
 *               doorFacing:      { type: string }
 *               ageOfBuilding:   { type: string }
 *               floorNumber:     { type: string }
 *               structure:       { type: string }
 *               furnishing:      { type: string }
 *               apartmentType:   { type: string }
 *               balconyFacing:   { type: string }
 *               sbua:            { type: number }
 *               plotArea:        { type: number }
 *               uds:             { type: number }
 *               totalRooms:      { type: number }
 *               waterSupply:     { type: string }
 *               totalFloors:     { type: number }
 *               pricePerSqft:    { type: number }
 *               askPrice:        { type: number }
 *               priceUnit:       { type: string }
 *               rentPerMonth:    { type: number }
 *               rentUnit:        { type: string }
 *               deposit:         { type: number }
 *               depositUnit:     { type: string }
 *               maintenance:     { type: string }
 *               commissionType:  { type: string }
 *               buildingKhata:   { type: string }
 *               landKhata:       { type: string }
 *               eKhata:          { type: boolean }
 *               extraRooms:      { type: string }
 *               cornerUnit:      { type: boolean }
 *               bioppaApprovedKhata: { type: boolean }
 *               exclusive:       { type: boolean }
 *               parking:         { type: string }
 *               preferredTenant: { type: string }
 *               petAllowed:      { type: boolean }
 *               nonVegAllowed:   { type: boolean }
 *               amenities:       { type: string }
 *               description:     { type: string }
 *
 *     responses:
 *       200: { description: Updated property document }
 *       404: { description: Not found }
 *       401: { description: Unauthorized }
 */
router.put("/:id", protect, uploadProperty, updateProperty);

// ─────────────────────────────────────────────────────────────
// DELETE /api/inventory/:id  — soft delete
// ─────────────────────────────────────────────────────────────
/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Soft-delete a property (sets isActive = false)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Deleted successfully }
 *       404: { description: Not found }
 *       401: { description: Unauthorized }
 */
router.delete("/:id", protect, deleteProperty);

export default router;