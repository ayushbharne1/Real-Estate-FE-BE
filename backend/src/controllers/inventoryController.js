import Property from "../models/Property.js";
import { success, error } from "../utils/response.js";
import { SortOption } from "shared/enums";
import { cloudinary } from "../config/cloudinary.js";
import { UPLOAD } from "shared/constants/app.js";

// ── Sort map ──────────────────────────────────────────────────
const SORT_MAP = {
  [SortOption.PRICE_LOW_TO_HIGH]: { "propertyDetails.askPrice": 1 },
  [SortOption.PRICE_HIGH_TO_LOW]: { "propertyDetails.askPrice": -1 },
  [SortOption.NEWEST_FIRST]: { createdAt: -1 },
  [SortOption.OLDEST_FIRST]: { createdAt: 1 },
  [SortOption.PRICE_SQFT_LOW_TO_HIGH]: { "propertyDetails.pricePerSqft": 1 },
  [SortOption.PRICE_SQFT_HIGH_TO_LOW]: { "propertyDetails.pricePerSqft": -1 },
};

// ─────────────────────────────────────────────────────────────
// POST /api/inventory  — Create property
// ─────────────────────────────────────────────────────────────
export const createProperty = async (req, res) => {
  try {
    const {
      name, listingType, assetType, possession,
      address, area, state, city, pincode,
      bedrooms, bathrooms, balconies, seats,
      doorFacing, ageOfBuilding, floorNumber,
      furnishing, pricePerSqft,
      sbua, plotArea, uds,
      apartmentType, balconyFacing, structure,
      totalRooms, waterSupply, totalFloors,
      askPrice, priceUnit,
      rentPerMonth, rentUnit,
      deposit, depositUnit,
      maintenance, commissionType,
      buildingKhata, landKhata, eKhata, extraRooms,
      cornerUnit, bioppaApprovedKhata,
      exclusive, parking,
      preferredTenant, petAllowed, nonVegAllowed,
      amenities, description,
    } = req.body;

    // ── Media — set by uploadProperty middleware ───────────────
    // req.imageUrls: string[]       Cloudinary image URLs
    // req.videoUrl:  string | null  Cloudinary video URL
    const images = req.imageUrls ?? [];
    const videoUrl = req.videoUrl ?? undefined;

    // Fall back to placeholder if no images uploaded
    const finalImages = images.length > 0 ? images : [UPLOAD.DEFAULT_IMAGE_URL];
    const primaryImage = finalImages[0];

    const parsedAmenities = _parseJson(amenities, []);
    const parsedExtraRooms = _parseJson(extraRooms, []);

    const property = await Property.create({
      basicDetails: {
        name, listingType, assetType,
        images: finalImages, primaryImage, videoUrl,
        address, area: area || undefined,
        state, city, pincode, possession,
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        balconies: Number(balconies) || 0,
        seats: seats ? Number(seats) : undefined,
      },

      propertyDetails: {
        doorFacing: doorFacing || undefined,
        furnishing: furnishing || undefined,
        ageOfBuilding: ageOfBuilding || undefined,
        floorNumber: floorNumber || undefined,
        sbua: sbua ? Number(sbua) : undefined,
        plotArea: plotArea ? Number(plotArea) : undefined,
        uds: uds ? Number(uds) : undefined,
        apartmentType: apartmentType || undefined,
        balconyFacing: balconyFacing || undefined,
        structure: structure || undefined,
        totalRooms: totalRooms ? Number(totalRooms) : undefined,
        waterSupply: waterSupply || undefined,
        totalFloors: totalFloors ? Number(totalFloors) : undefined,
        pricePerSqft: pricePerSqft ? Number(pricePerSqft) : undefined,
        askPrice: askPrice ? Number(askPrice) : undefined,
        priceUnit: priceUnit || "LAKHS",
        rentPerMonth: rentPerMonth ? Number(rentPerMonth) : undefined,
        rentUnit: rentUnit || "LAKHS",
        deposit: deposit ? Number(deposit) : undefined,
        depositUnit: depositUnit || "LAKHS",
        maintenance: maintenance || undefined,
        commissionType: commissionType || undefined,
      },

      moreDetails: {
        buildingKhata: buildingKhata || undefined,
        landKhata: landKhata || undefined,
        eKhata: eKhata !== undefined ? _parseBool(eKhata) : undefined,
        extraRooms: parsedExtraRooms,
        cornerUnit: cornerUnit !== undefined ? _parseBool(cornerUnit) : undefined,
        bioppaApprovedKhata: bioppaApprovedKhata !== undefined ? _parseBool(bioppaApprovedKhata) : undefined,
        exclusive: exclusive !== undefined ? _parseBool(exclusive) : undefined,
        parking: parking || undefined,
        preferredTenant: preferredTenant || undefined,
        petAllowed: petAllowed !== undefined ? _parseBool(petAllowed) : undefined,
        nonVegAllowed: nonVegAllowed !== undefined ? _parseBool(nonVegAllowed) : undefined,
        amenities: parsedAmenities,
        description,
      },
    });

    success(res, property, 201);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory  — list with filters, sort, pagination
// ─────────────────────────────────────────────────────────────
export const getProperties = async (req, res) => {
  try {
    const {
      search, listingType, assetType, bhkTypes,
      budgetMin, budgetMax, sbuaMin, sbuaMax,
      sortBy, page = 1, limit = 20,
    } = req.query;

    const filter = { isActive: true };
    if (listingType) filter["basicDetails.listingType"] = listingType;
    if (assetType) filter["basicDetails.assetType"] = assetType;

    if (search) {
      filter["$or"] = [
        { "basicDetails.name": { $regex: search, $options: "i" } },
        { "basicDetails.city": { $regex: search, $options: "i" } },
        { "basicDetails.area": { $regex: search, $options: "i" } },
        { "basicDetails.address": { $regex: search, $options: "i" } },
        { "basicDetails.state": { $regex: search, $options: "i" } },
        { "basicDetails.pincode": { $regex: search, $options: "i" } },
        { "basicDetails.assetType": { $regex: search, $options: "i" } },
        { "basicDetails.listingType": { $regex: search, $options: "i" } },
        { "propertyId": { $regex: search, $options: "i" } },
        { "propertyDetails.apartmentType": { $regex: search, $options: "i" } },
        { "propertyDetails.furnishing": { $regex: search, $options: "i" } },
        { "propertyDetails.floorNumber": { $regex: search, $options: "i" } },
        { "propertyDetails.doorFacing": { $regex: search, $options: "i" } },
        { "moreDetails.preferredTenant": { $regex: search, $options: "i" } },
        { "moreDetails.amenities": { $regex: search, $options: "i" } },
      ];
    }

    const rawBhk = req.query['bhkTypes[]'] || req.query.bhkTypes;
    const bhkArray = rawBhk ? (Array.isArray(rawBhk) ? rawBhk : [rawBhk]) : [];
    if (bhkArray.length > 0) {
      filter["basicDetails.bedrooms"] = { $in: bhkArray.map(Number) };
    }

    if (sbuaMin || sbuaMax) {
      filter["propertyDetails.sbua"] = {};
      if (sbuaMin) filter["propertyDetails.sbua"].$gte = Number(sbuaMin);
      if (sbuaMax) filter["propertyDetails.sbua"].$lte = Number(sbuaMax);
    }

    const isRentalFilter = listingType === 'RENTAL';
    const priceField = isRentalFilter ? 'propertyDetails.rentPerMonth' : 'propertyDetails.askPrice';
    const unitField = isRentalFilter ? 'propertyDetails.rentUnit' : 'propertyDetails.priceUnit';

    const pipeline = [{ $match: filter }];

    if (budgetMin || budgetMax) {
      const normalizedPrice = {
        $cond: [{ $eq: [`$${unitField}`, 'CRORES'] }, { $multiply: [`$${priceField}`, 100] }, `$${priceField}`]
      };
      const exprs = [];
      if (budgetMin) exprs.push({ $gte: [normalizedPrice, Number(budgetMin)] });
      if (budgetMax) exprs.push({ $lte: [normalizedPrice, Number(budgetMax)] });
      pipeline.push({ $match: { $expr: exprs.length === 1 ? exprs[0] : { $and: exprs } } });
    }

    // Always add normalized price field for correct sorting
    pipeline.push({
      $addFields: {
        _normalizedPrice: {
          $cond: [{ $eq: [`$${unitField}`, 'CRORES'] }, { $multiply: [`$${priceField}`, 100] }, `$${priceField}`]
        }
      }
    });

    const SORT_MAP = {
      PRICE_LOW_TO_HIGH: { _normalizedPrice: 1 },
      PRICE_HIGH_TO_LOW: { _normalizedPrice: -1 },
      NEWEST_FIRST: { createdAt: -1 },
      OLDEST_FIRST: { createdAt: 1 },
      PRICE_SQFT_LOW_TO_HIGH: { "propertyDetails.pricePerSqft": 1 },
      PRICE_SQFT_HIGH_TO_LOW: { "propertyDetails.pricePerSqft": -1 },
    };

    pipeline.push({ $sort: SORT_MAP[sortBy] || { createdAt: -1 } });

    const skip = (Number(page) - 1) * Number(limit);

    // Count before pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Property.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: Number(limit) });
    pipeline.push({ $unset: '_normalizedPrice' });

    const items = await Property.aggregate(pipeline);

    success(res, {
      items, total,
      page: Number(page), limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    error(res, err.message);
  }
};
// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id
// ─────────────────────────────────────────────────────────────
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return error(res, "Property not found", 404);
    success(res, property);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id/similar  — FIXED: assetType only, no city filter
// ─────────────────────────────────────────────────────────────
export const getSimilar = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return error(res, "Property not found", 404);

    const assetType = property.basicDetails?.assetType;

    const filter = {
      _id: { $ne: property._id },
      isActive: true,
    };

    // Only filter by assetType — never by city, so results always exist
    if (assetType) {
      filter["basicDetails.assetType"] = assetType;
    }

    const items = await Property.find(filter).limit(4);
    success(res, items);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// PUT /api/inventory/:id  — Edit / update property
// ─────────────────────────────────────────────────────────────
export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return error(res, "Property not found", 404);

    const {
      name, listingType, assetType, possession,
      address, area, state, city, pincode,
      bedrooms, bathrooms, balconies, seats,
      doorFacing, ageOfBuilding, floorNumber,
      furnishing, pricePerSqft,
      sbua, plotArea, uds,
      apartmentType, balconyFacing, structure,
      totalRooms, waterSupply, totalFloors,
      askPrice, priceUnit,
      rentPerMonth, rentUnit,
      deposit, depositUnit,
      maintenance, commissionType,
      buildingKhata, landKhata, eKhata, extraRooms,
      cornerUnit, bioppaApprovedKhata,
      exclusive, parking,
      preferredTenant, petAllowed, nonVegAllowed,
      amenities, description,
      // existingImages: JSON array of current Cloudinary URLs to KEEP
      existingImages,
      // removeVideo: pass "true" to delete the existing video
      removeVideo,
    } = req.body;

    // ── Image management ───────────────────────────────────────
    const newImages = req.imageUrls ?? [];
    const keptImages = _parseJson(existingImages, property.basicDetails.images);
    const allImages = [...keptImages, ...newImages];

    // Fall back to placeholder if result is empty
    const finalImages = allImages.length > 0 ? allImages : [UPLOAD.DEFAULT_IMAGE_URL];
    const primaryImage = finalImages[0];

    // Delete removed Cloudinary images (skip placeholder)
    const removedImages = (property.basicDetails.images ?? []).filter(
      (url) => !keptImages.includes(url) && url !== UPLOAD.DEFAULT_IMAGE_URL
    );
    await Promise.allSettled(
      removedImages.map((url) => {
        const pid = _cloudinaryPublicId(url);
        return pid ? cloudinary.uploader.destroy(pid) : Promise.resolve();
      })
    );

    // ── Video management ───────────────────────────────────────
    let videoUrl = property.basicDetails.videoUrl ?? null;

    // removeVideo=true → delete old video, set null
    if (_parseBool(removeVideo) && videoUrl) {
      const pid = _cloudinaryPublicId(videoUrl);
      if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" }).catch(() => null);
      videoUrl = null;
    }

    // New video uploaded → replace old one
    if (req.videoUrl) {
      if (videoUrl && videoUrl !== req.videoUrl) {
        const pid = _cloudinaryPublicId(videoUrl);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" }).catch(() => null);
      }
      videoUrl = req.videoUrl;
    }

    // ── Build $set payload (only fields present in request) ────
    const p = {};

    // Step 1
    _set(p, "basicDetails.name", name);
    _set(p, "basicDetails.listingType", listingType);
    _set(p, "basicDetails.assetType", assetType);
    _set(p, "basicDetails.possession", possession);
    _set(p, "basicDetails.address", address);
    _set(p, "basicDetails.area", area);
    _set(p, "basicDetails.state", state);
    _set(p, "basicDetails.city", city);
    _set(p, "basicDetails.pincode", pincode);
    _set(p, "basicDetails.bedrooms", bedrooms !== undefined ? Number(bedrooms) : undefined);
    _set(p, "basicDetails.bathrooms", bathrooms !== undefined ? Number(bathrooms) : undefined);
    _set(p, "basicDetails.balconies", balconies !== undefined ? Number(balconies) : undefined);
    _set(p, "basicDetails.seats", seats !== undefined ? Number(seats) : undefined);

    if (newImages.length || existingImages !== undefined) {
      p["basicDetails.images"] = finalImages;
      p["basicDetails.primaryImage"] = primaryImage;
    }
    if (req.videoUrl !== undefined || _parseBool(removeVideo)) {
      p["basicDetails.videoUrl"] = videoUrl;
    }

    // Step 2
    _set(p, "propertyDetails.doorFacing", doorFacing);
    _set(p, "propertyDetails.furnishing", furnishing);
    _set(p, "propertyDetails.ageOfBuilding", ageOfBuilding);
    _set(p, "propertyDetails.floorNumber", floorNumber);
    _set(p, "propertyDetails.sbua", sbua !== undefined ? Number(sbua) : undefined);
    _set(p, "propertyDetails.plotArea", plotArea !== undefined ? Number(plotArea) : undefined);
    _set(p, "propertyDetails.uds", uds !== undefined ? Number(uds) : undefined);
    _set(p, "propertyDetails.apartmentType", apartmentType);
    _set(p, "propertyDetails.balconyFacing", balconyFacing);
    _set(p, "propertyDetails.structure", structure);
    _set(p, "propertyDetails.totalRooms", totalRooms !== undefined ? Number(totalRooms) : undefined);
    _set(p, "propertyDetails.waterSupply", waterSupply);
    _set(p, "propertyDetails.totalFloors", totalFloors !== undefined ? Number(totalFloors) : undefined);
    _set(p, "propertyDetails.pricePerSqft", pricePerSqft !== undefined ? Number(pricePerSqft) : undefined);
    _set(p, "propertyDetails.askPrice", askPrice !== undefined ? Number(askPrice) : undefined);
    _set(p, "propertyDetails.priceUnit", priceUnit);
    _set(p, "propertyDetails.rentPerMonth", rentPerMonth !== undefined ? Number(rentPerMonth) : undefined);
    _set(p, "propertyDetails.rentUnit", rentUnit);
    _set(p, "propertyDetails.deposit", deposit !== undefined ? Number(deposit) : undefined);
    _set(p, "propertyDetails.depositUnit", depositUnit);
    _set(p, "propertyDetails.maintenance", maintenance);
    _set(p, "propertyDetails.commissionType", commissionType);

    // Step 3
    _set(p, "moreDetails.buildingKhata", buildingKhata);
    _set(p, "moreDetails.landKhata", landKhata);
    _set(p, "moreDetails.eKhata", eKhata !== undefined ? _parseBool(eKhata) : undefined);
    _set(p, "moreDetails.cornerUnit", cornerUnit !== undefined ? _parseBool(cornerUnit) : undefined);
    _set(p, "moreDetails.bioppaApprovedKhata", bioppaApprovedKhata !== undefined ? _parseBool(bioppaApprovedKhata) : undefined);
    _set(p, "moreDetails.exclusive", exclusive !== undefined ? _parseBool(exclusive) : undefined);
    _set(p, "moreDetails.parking", parking);
    _set(p, "moreDetails.preferredTenant", preferredTenant);
    _set(p, "moreDetails.petAllowed", petAllowed !== undefined ? _parseBool(petAllowed) : undefined);
    _set(p, "moreDetails.nonVegAllowed", nonVegAllowed !== undefined ? _parseBool(nonVegAllowed) : undefined);
    _set(p, "moreDetails.description", description);
    if (amenities !== undefined) p["moreDetails.amenities"] = _parseJson(amenities, property.moreDetails.amenities);
    if (extraRooms !== undefined) p["moreDetails.extraRooms"] = _parseJson(extraRooms, property.moreDetails.extraRooms);

    p["lastCheckedAt"] = new Date();

    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: p },
      { new: true, runValidators: true }
    );

    success(res, updated);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/inventory/:id  — soft delete
// ─────────────────────────────────────────────────────────────
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return error(res, "Property not found", 404);
    await Property.findByIdAndUpdate(req.params.id, { $set: { isActive: false } });
    success(res, { message: "Property deleted successfully" });
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function _set(payload, key, value) {
  if (value !== undefined) payload[key] = value;
}

function _parseJson(value, fallback = []) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return fallback;
}

// PATCH FILE: backend/src/controllers/inventoryController.js
// Only the helper functions and relevant sections need changing.
// Replace the _parseBool function at the bottom of the file:

// OLD:
// function _parseBool(value) {
//   if (typeof value === "boolean") return value;
//   return value === "true" || value === "1";
// }

// NEW (handles Yes/No from frontend dropdowns):
function _parseBool(value) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.toLowerCase();
    return v === "true" || v === "1" || v === "yes";
  }
  return false;
}

function _cloudinaryPublicId(url) {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    return parts[1].replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}


// GET /api/inventory/asset-type-counts
export const getAssetTypeCounts = async (req, res) => {
  try {
    const { listingType, budgetMin, budgetMax, sbuaMin, sbuaMax } = req.query;
    const rawBhk = req.query['bhkTypes[]'] || req.query.bhkTypes;

    const filter = { isActive: true };
    if (listingType) filter["basicDetails.listingType"] = listingType;

    const bhkArray = rawBhk ? (Array.isArray(rawBhk) ? rawBhk : [rawBhk]) : [];
    if (bhkArray.length > 0) {
      filter["basicDetails.bedrooms"] = { $in: bhkArray.map(Number) };
    }

    if (sbuaMin || sbuaMax) {
      filter["propertyDetails.sbua"] = {};
      if (sbuaMin) filter["propertyDetails.sbua"].$gte = Number(sbuaMin);
      if (sbuaMax) filter["propertyDetails.sbua"].$lte = Number(sbuaMax);
    }

    const pipeline = [{ $match: filter }];

    if (budgetMin || budgetMax) {
      const isRentalFilter = listingType === 'RENTAL';
      const priceField = isRentalFilter ? 'propertyDetails.rentPerMonth' : 'propertyDetails.askPrice';
      const unitField = isRentalFilter ? 'propertyDetails.rentUnit' : 'propertyDetails.priceUnit';
      const normalizedPrice = {
        $cond: [{ $eq: [`$${unitField}`, 'CRORES'] }, { $multiply: [`$${priceField}`, 100] }, `$${priceField}`]
      };
      const exprs = [];
      if (budgetMin) exprs.push({ $gte: [normalizedPrice, Number(budgetMin)] });
      if (budgetMax) exprs.push({ $lte: [normalizedPrice, Number(budgetMax)] });
      pipeline.push({ $match: { $expr: exprs.length === 1 ? exprs[0] : { $and: exprs } } });
    }

    pipeline.push({ $group: { _id: "$basicDetails.assetType", count: { $sum: 1 } } });

    const counts = await Property.aggregate(pipeline);
    const result = {};
    counts.forEach(({ _id, count }) => { if (_id) result[_id] = count; });
    success(res, result);
  } catch (err) {
    error(res, err.message);
  }
};