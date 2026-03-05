import { Router } from "express";
import { protect } from "../middleware/auth.js";
import { success } from "../utils/response.js";
import {
  ASSET_TYPE_OPTIONS,
  POSSESSION_OPTIONS,
  AMENITY_OPTIONS,
} from "shared/constants";

const router = Router();

// Frontend fetches these to populate dynamic dropdowns with counts etc.
router.get("/asset-types", protect, (_req, res) => success(res, ASSET_TYPE_OPTIONS));
router.get("/possession",  protect, (_req, res) => success(res, POSSESSION_OPTIONS));
router.get("/amenities",   protect, (_req, res) => success(res, AMENITY_OPTIONS));

export default router;