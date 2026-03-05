import Property from "../models/Property.js";
import { success, error } from "../utils/response.js";
import { SortOption } from "shared/enums";

const SORT_MAP = {
  [SortOption.PRICE_LOW_TO_HIGH]:      { "specs.askPrice": 1 },
  [SortOption.PRICE_HIGH_TO_LOW]:      { "specs.askPrice": -1 },
  [SortOption.NEWEST_FIRST]:           { createdAt: -1 },
  [SortOption.OLDEST_FIRST]:           { createdAt: 1 },
  [SortOption.PRICE_SQFT_LOW_TO_HIGH]: { "specs.pricePerSqft": 1 },
  [SortOption.PRICE_SQFT_HIGH_TO_LOW]: { "specs.pricePerSqft": -1 },
};

export const getProperties = async (req, res) => {
  try {
    const {
      search, listingType, assetType, bhkTypes,
      budgetMin, budgetMax, sbuaMin, sbuaMax,
      sortBy, page = 1, limit = 20,
    } = req.query;

    const filter = { isActive: true };
    if (listingType) filter.listingType = listingType;
    if (assetType)   filter.assetType   = assetType;
    if (search)      filter.name        = { $regex: search, $options: "i" };
    if (bhkTypes?.length) filter["configuration.bedrooms"] = { $in: bhkTypes.map(Number) };
    if (budgetMin || budgetMax) {
      filter["specs.askPrice"] = {};
      if (budgetMin) filter["specs.askPrice"].$gte = Number(budgetMin);
      if (budgetMax) filter["specs.askPrice"].$lte = Number(budgetMax);
    }
    if (sbuaMin || sbuaMax) {
      filter["specs.sbua"] = {};
      if (sbuaMin) filter["specs.sbua"].$gte = Number(sbuaMin);
      if (sbuaMax) filter["specs.sbua"].$lte = Number(sbuaMax);
    }

    const sort  = SORT_MAP[sortBy] || { createdAt: -1 };
    const skip  = (page - 1) * limit;
    const total = await Property.countDocuments(filter);
    const items = await Property.find(filter).sort(sort).skip(skip).limit(Number(limit));

    success(res, { items, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    error(res, err.message);
  }
};

export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return error(res, "Property not found", 404);
    success(res, property);
  } catch (err) {
    error(res, err.message);
  }
};

export const getSimilar = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return error(res, "Property not found", 404);
    const items = await Property.find({
      _id:       { $ne: property._id },
      assetType: property.assetType,
      "address.city": property.address.city,
      isActive:  true,
    }).limit(4);
    success(res, items);
  } catch (err) {
    error(res, err.message);
  }
};