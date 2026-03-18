// backend/src/controllers/buyerController.js
import Buyer from "../models/Buyer.js";
import { success, error } from "../utils/response.js";

// ─────────────────────────────────────────────────────────────
// POST /api/buyers  — Create buyer
// ─────────────────────────────────────────────────────────────
export const createBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.create(req.body);
    success(res, buyer, 201);
  } catch (err) {
    error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/buyers  — List with filters + pagination
// ─────────────────────────────────────────────────────────────
export const getBuyers = async (req, res) => {
  try {
    const {
      search,
      listingType,
      assetType,
      status,
      page  = 1,
      limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (listingType) filter.listingType = listingType;
    if (assetType)   filter.assetType   = assetType;
    if (status)      filter.status      = status;

    if (search) {
      filter.$or = [
        { name:       { $regex: search, $options: "i" } },
        { email:      { $regex: search, $options: "i" } },
        { contact:    { $regex: search, $options: "i" } },
        { propertyId: { $regex: search, $options: "i" } },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Buyer.countDocuments(filter);
    const items = await Buyer.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    success(res, {
      items,
      total,
      page:       Number(page),
      limit:      Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/buyers/:id
// ─────────────────────────────────────────────────────────────
export const getBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) return error(res, "Buyer not found", 404);
    success(res, buyer);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/buyers/:id  — Full / partial update
// ─────────────────────────────────────────────────────────────
export const updateBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) return error(res, "Buyer not found", 404);

    const updated = await Buyer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    success(res, updated);
  } catch (err) {
    error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────────────────────
// PATCH /api/buyers/:id/status  — Update status only
// ─────────────────────────────────────────────────────────────
export const updateBuyerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return error(res, "status is required", 400);

    const buyer = await Buyer.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true, runValidators: true }
    );
    if (!buyer) return error(res, "Buyer not found", 404);
    success(res, buyer);
  } catch (err) {
    error(res, err.message, 400);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/buyers/:id  — Soft delete
// ─────────────────────────────────────────────────────────────
export const deleteBuyer = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) return error(res, "Buyer not found", 404);
    await Buyer.findByIdAndUpdate(req.params.id, { $set: { isActive: false } });
    success(res, { message: "Buyer deleted successfully" });
  } catch (err) {
    error(res, err.message);
  }
};