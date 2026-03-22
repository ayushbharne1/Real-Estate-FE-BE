// backend/src/controllers/inventoryController.js
import Property from "../models/Property.js";
import { success, error } from "../utils/response.js";
import { SortOption } from "shared/enums";
import { cloudinary } from "../config/cloudinary.js";
import { UPLOAD } from "shared/constants/app.js";

// ── Sort map ──────────────────────────────────────────────────
const SORT_MAP = {
  [SortOption.PRICE_LOW_TO_HIGH]:      { "propertyDetails.askPrice": 1 },
  [SortOption.PRICE_HIGH_TO_LOW]:      { "propertyDetails.askPrice": -1 },
  [SortOption.NEWEST_FIRST]:           { createdAt: -1 },
  [SortOption.OLDEST_FIRST]:           { createdAt: 1 },
  [SortOption.PRICE_SQFT_LOW_TO_HIGH]: { "propertyDetails.pricePerSqft": 1 },
  [SortOption.PRICE_SQFT_HIGH_TO_LOW]: { "propertyDetails.pricePerSqft": -1 },
};

// ── Label maps (module-level constants) ───────────────────────
const ASSET_LABELS = {
  APARTMENT: 'Apartment', PLOT: 'Plot', VILLA: 'Villa',
  INDEPENDENT_HOUSE: 'Independent House', COMMERCIAL_SPACE: 'Commercial Space',
  ROW_HOUSE: 'Row House', COMMERCIAL_PROPERTY: 'Commercial Property',
  VILAMENT: 'Villament', OFFICE_SPACE: 'Office Space', RETAIL_SPACE: 'Retail Space',
  SHOWROOM: 'Showroom', SHOP: 'Shop', TECH_PARK: 'Tech Park',
  WAREHOUSE: 'Warehouse', INDUSTRIAL_LAND: 'Industrial Land',
};

const POSSESSION_LABELS = {
  READY_TO_MOVE: 'Ready to Move', UNDER_CONSTRUCTION: 'Under Construction',
  NEW_LAUNCH: 'New Launch', RESALE_READY: 'Resale Ready', VACANT_LAND: 'Vacant Land',
};

const FURNISHING_LABELS = {
  FURNISHED: 'Fully Furnished', SEMI_FURNISHED: 'Semi Furnished',
  UNFURNISHED: 'Unfurnished', PLUG_AND_PLAY: 'Plug and Play',
  WARM_SHELL: 'Warm Shell', BARE_SHELL: 'Bare Shell',
};

const FLOOR_LABELS = {
  GROUND: 'Ground Floor', LOWER: 'Lower Floor', MID: 'Mid Floor',
  HIGH: 'High Floor', ULTRA: 'Ultra High Floor',
};

const AGE_LABELS = {
  NEW: 'New Construction', THREE_TO_FIVE: '3 to 5 Years Old',
  FIVE_TO_TEN: '5 to 10 Years Old', TEN_TO_FIFTEEN: '10 to 15 Years Old',
  FIFTEEN_PLUS: '15 Plus Years Old',
};

// ── Pre-built reverse maps — O(1) lookup instead of O(n) scan ─
const REVERSE_ASSET      = Object.fromEntries(Object.entries(ASSET_LABELS).map(([k, v])      => [v.toLowerCase(), k]));
const REVERSE_POSSESSION = Object.fromEntries(Object.entries(POSSESSION_LABELS).map(([k, v]) => [v.toLowerCase(), k]));
const REVERSE_FURNISHING = Object.fromEntries(Object.entries(FURNISHING_LABELS).map(([k, v]) => [v.toLowerCase(), k]));
const REVERSE_FLOOR      = Object.fromEntries(Object.entries(FLOOR_LABELS).map(([k, v])      => [v.toLowerCase(), k]));
const REVERSE_AGE        = Object.fromEntries(Object.entries(AGE_LABELS).map(([k, v])        => [v.toLowerCase(), k]));

// ── Static keyword candidates (built once at module load) ──────
const STATIC_KEYWORD_CANDIDATES = [
  ...Object.values(ASSET_LABELS),
  ...Object.values(POSSESSION_LABELS),
  ...Object.values(FURNISHING_LABELS),
  ...Object.values(FLOOR_LABELS),
  ...Object.values(AGE_LABELS),
  'Resale', 'Rental',
  'Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK',
  'Corner Unit', 'Gated Community',
  'Swimming Pool', 'Gym', 'Parking', 'Power Backup',
  'CCTV', 'Security', 'Lift', 'Garden',
];

// ─────────────────────────────────────────────────────────────
// POST /api/inventory  — Create property
// ─────────────────────────────────────────────────────────────
export const createProperty = async (req, res) => {
  try {
    const {
      name, listingType, assetType, possession,
      address, area, state, city, pincode,
      bedrooms, bathrooms, balconies, seats,
      doorFacing, ageOfBuilding, floorNumber, furnishing, pricePerSqft,
      sbua, plotArea, uds,
      apartmentType, balconyFacing, structure,
      totalRooms, waterSupply, totalFloors,
      cabins, meetingRooms, boardRoom, buildingGrade,
      tower, parkType,
      frontage,
      warehouseType, landArea, floorType, floorLoading,
      docks, dockLevelers, truckAccess, powerLoad, officeBlock,
      landType, depth, shape, topography, compoundWall, gate,
      fsiFar, roadType, utilitiesNearby,
      pricePerAcre, pricePerAcreUnit,
      groundRent, groundRentUnit,
      zoning, leaseTenure,
      askPrice, priceUnit,
      rentPerMonth, rentUnit,
      deposit, depositUnit,
      maintenance, commissionType,
      extraRooms,
      cornerUnit, exclusive,
      parking, parkingNum,
      preferredTenant, petAllowed, nonVegAllowed,
      idealFor,
      amenities, description,
    } = req.body;

    const images       = req.imageUrls ?? [];
    const videoUrl     = req.videoUrl  ?? undefined;
    const finalImages  = images.length > 0 ? images : [UPLOAD.DEFAULT_IMAGE_URL];
    const primaryImage = finalImages[0];

    const parsedAmenities  = _parseJson(amenities,      []);
    const parsedExtraRooms = _parseJson(extraRooms,     []);
    const parsedIdealFor   = _parseJson(idealFor,       []);
    const parsedUtilities  = _parseJson(utilitiesNearby,[]);

    const property = await Property.create({
      basicDetails: {
        name, listingType, assetType,
        images: finalImages, primaryImage, videoUrl,
        address, area: area || undefined,
        state, city, pincode, possession,
        bedrooms:  Number(bedrooms)  || 0,
        bathrooms: Number(bathrooms) || 0,
        balconies: Number(balconies) || 0,
        seats:     seats ? Number(seats) : undefined,
      },
      propertyDetails: {
        doorFacing:       doorFacing       || undefined,
        furnishing:       furnishing       || undefined,
        ageOfBuilding:    ageOfBuilding    || undefined,
        floorNumber:      floorNumber      || undefined,
        sbua:             sbua             ? Number(sbua)          : undefined,
        plotArea:         plotArea         ? Number(plotArea)      : undefined,
        uds:              uds              ? Number(uds)           : undefined,
        apartmentType:    apartmentType    || undefined,
        balconyFacing:    balconyFacing    || undefined,
        structure:        structure        || undefined,
        totalRooms:       totalRooms       ? Number(totalRooms)    : undefined,
        waterSupply:      waterSupply      || undefined,
        totalFloors:      totalFloors      ? Number(totalFloors)   : undefined,
        cabins:           cabins           ? Number(cabins)        : undefined,
        meetingRooms:     meetingRooms     ? Number(meetingRooms)  : undefined,
        boardRoom:        boardRoom        ? Number(boardRoom)     : undefined,
        buildingGrade:    buildingGrade    || undefined,
        tower:            tower            || undefined,
        parkType:         parkType         || undefined,
        frontage:         frontage         ? Number(frontage)      : undefined,
        warehouseType:    warehouseType    || undefined,
        landArea:         landArea         ? Number(landArea)      : undefined,
        floorType:        floorType        || undefined,
        floorLoading:     floorLoading     ? Number(floorLoading)  : undefined,
        docks:            docks            ? Number(docks)         : undefined,
        dockLevelers:     dockLevelers     ? Number(dockLevelers)  : undefined,
        truckAccess:      truckAccess      || undefined,
        powerLoad:        powerLoad        ? Number(powerLoad)     : undefined,
        officeBlock:      officeBlock      ? Number(officeBlock)   : undefined,
        landType:         landType         || undefined,
        depth:            depth            ? Number(depth)         : undefined,
        shape:            shape            || undefined,
        topography:       topography       || undefined,
        compoundWall:     compoundWall     || undefined,
        gate:             gate             || undefined,
        fsiFar:           fsiFar           || undefined,
        roadType:         roadType         || undefined,
        utilitiesNearby:  parsedUtilities.length ? parsedUtilities : undefined,
        pricePerAcre:     pricePerAcre     ? Number(pricePerAcre)     : undefined,
        pricePerAcreUnit: pricePerAcreUnit || undefined,
        groundRent:       groundRent       ? Number(groundRent)       : undefined,
        groundRentUnit:   groundRentUnit   || undefined,
        zoning:           zoning           || undefined,
        leaseTenure:      leaseTenure      || undefined,
        pricePerSqft:     pricePerSqft     ? Number(pricePerSqft)  : undefined,
        askPrice:         askPrice         ? Number(askPrice)       : undefined,
        priceUnit:        priceUnit        || "LAKHS",
        rentPerMonth:     rentPerMonth     ? Number(rentPerMonth)   : undefined,
        rentUnit:         rentUnit         || "LAKHS",
        deposit:          deposit          ? Number(deposit)        : undefined,
        depositUnit:      depositUnit      || "LAKHS",
        maintenance:      maintenance      || undefined,
        commissionType:   commissionType   || undefined,
      },
      moreDetails: {
        extraRooms:      parsedExtraRooms,
        cornerUnit:      cornerUnit    !== undefined ? _parseBool(cornerUnit)    : undefined,
        exclusive:       exclusive     !== undefined ? _parseBool(exclusive)     : undefined,
        parking:         parking       || undefined,
        parkingNum:      parkingNum    ? Number(parkingNum) : undefined,
        preferredTenant: preferredTenant || undefined,
        petAllowed:      petAllowed    !== undefined ? _parseBool(petAllowed)    : undefined,
        nonVegAllowed:   nonVegAllowed !== undefined ? _parseBool(nonVegAllowed) : undefined,
        idealFor:        parsedIdealFor.length ? parsedIdealFor : undefined,
        amenities:       parsedAmenities,
        description:     description || "",
      },
    });

    success(res, property, 201);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory  — List / search properties
// ─────────────────────────────────────────────────────────────
export const getProperties = async (req, res) => {
  try {
    const {
      search, listingType, assetType, sortBy,
      budgetMin, budgetMax, sbuaMin, sbuaMax, page, limit,
    } = req.query;
    const rawBhk = req.query['bhkTypes[]'] || req.query.bhkTypes;

    const filter = { isActive: true };
    if (listingType) filter["basicDetails.listingType"] = listingType;
    if (assetType)   filter["basicDetails.assetType"]   = assetType;

    const bhkArray = rawBhk ? (Array.isArray(rawBhk) ? rawBhk : [rawBhk]) : [];
    if (bhkArray.length > 0) {
      filter["basicDetails.bedrooms"] = { $in: bhkArray.map(Number) };
    }

    if (search) {
      const re      = new RegExp(search, "i");
      const s       = search.trim();
      const s_lower = s.toLowerCase();

      // O(1) reverse map lookups
      const assetEnum      = REVERSE_ASSET[s_lower]      || null;
      const possessionEnum = REVERSE_POSSESSION[s_lower] || null;
      const furnishingEnum = REVERSE_FURNISHING[s_lower] || null;
      const floorEnum      = REVERSE_FLOOR[s_lower]      || null;
      const ageEnum        = REVERSE_AGE[s_lower]        || null;

      const bhkMatch  = s.match(/^(\d)\s*BHK$/i);
      const crMatch   = s.match(/₹?([\d.]+)\s*Cr/i);
      const lakhMatch = s.match(/₹?([\d.]+)\s*L/i);

      const priceOrClauses = [];

      if (crMatch) {
        const crVal = parseFloat(crMatch[1]);
        priceOrClauses.push(
          { "propertyDetails.priceUnit": "CRORES", "propertyDetails.askPrice":      { $gte: crVal - 0.5, $lte: crVal + 0.5 } },
          { "propertyDetails.rentUnit":  "CRORES", "propertyDetails.rentPerMonth":  { $gte: crVal - 0.5, $lte: crVal + 0.5 } },
          { "propertyDetails.priceUnit": "LAKHS",  "propertyDetails.askPrice":      { $gte: (crVal - 0.5) * 100, $lte: (crVal + 0.5) * 100 } },
        );
      }

      if (lakhMatch) {
        const lVal = parseFloat(lakhMatch[1]);
        priceOrClauses.push(
          { "propertyDetails.priceUnit": "LAKHS", "propertyDetails.askPrice":     { $gte: lVal - 5, $lte: lVal + 5 } },
          { "propertyDetails.rentUnit":  "LAKHS", "propertyDetails.rentPerMonth": { $gte: lVal - 5, $lte: lVal + 5 } },
        );
      }

      filter.$or = [
        { "basicDetails.name":             re },
        { "basicDetails.address":          re },
        { "basicDetails.area":             re },
        { "basicDetails.city":             re },
        { "basicDetails.state":            re },
        { propertyId:                      re },
        { "moreDetails.description":       re },
        { "moreDetails.amenities":         re },
        { "propertyDetails.doorFacing":    re },
        { "basicDetails.listingType":      re },
        { "basicDetails.assetType":        re },
        { "basicDetails.possession":       re },
        { "propertyDetails.furnishing":    re },
        { "propertyDetails.floorNumber":   re },
        { "propertyDetails.ageOfBuilding": re },
        ...(assetEnum      ? [{ "basicDetails.assetType":        assetEnum      }] : []),
        ...(possessionEnum ? [{ "basicDetails.possession":       possessionEnum }] : []),
        ...(furnishingEnum ? [{ "propertyDetails.furnishing":    furnishingEnum }] : []),
        ...(floorEnum      ? [{ "propertyDetails.floorNumber":   floorEnum      }] : []),
        ...(ageEnum        ? [{ "propertyDetails.ageOfBuilding": ageEnum        }] : []),
        ...(bhkMatch       ? [{ "basicDetails.bedrooms": Number(bhkMatch[1])   }] : []),
        ...priceOrClauses,
      ];
    }

    if (sbuaMin || sbuaMax) {
      filter["propertyDetails.sbua"] = {};
      if (sbuaMin) filter["propertyDetails.sbua"].$gte = Number(sbuaMin);
      if (sbuaMax) filter["propertyDetails.sbua"].$lte = Number(sbuaMax);
    }

    const isRentalFilter = listingType === 'RENTAL';

    if (budgetMin || budgetMax) {
      const priceField      = isRentalFilter ? 'propertyDetails.rentPerMonth' : 'propertyDetails.askPrice';
      const unitField       = isRentalFilter ? 'propertyDetails.rentUnit'     : 'propertyDetails.priceUnit';
      const normalizedPrice = {
        $cond: [{ $eq: [`$${unitField}`, 'CRORES'] }, { $multiply: [`$${priceField}`, 100] }, `$${priceField}`],
      };
      const exprs = [];
      if (budgetMin) exprs.push({ $gte: [normalizedPrice, Number(budgetMin)] });
      if (budgetMax) exprs.push({ $lte: [normalizedPrice, Number(budgetMax)] });
      if (exprs.length > 0) filter.$expr = exprs.length === 1 ? exprs[0] : { $and: exprs };
    }

    const sortObj  = SORT_MAP[sortBy] || SORT_MAP[SortOption.NEWEST_FIRST];
    const pageNum  = Math.max(1, Number(page)  || 1);
    const limitNum = Math.min(100, Number(limit) || 20);
    const skip     = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Property.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      Property.countDocuments(filter),
    ]);

    success(res, { items, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id
// ─────────────────────────────────────────────────────────────
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, isActive: true });
    if (!property) return error(res, "Property not found", 404);
    success(res, property);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/:id/similar
// ─────────────────────────────────────────────────────────────
export const getSimilar = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) return error(res, "Property not found", 404);
    const assetType = property.basicDetails?.assetType;
    const filter = { _id: { $ne: property._id }, isActive: true };
    if (assetType) filter["basicDetails.assetType"] = assetType;
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
      doorFacing, ageOfBuilding, floorNumber, furnishing, pricePerSqft,
      sbua, plotArea, uds,
      apartmentType, balconyFacing, structure,
      totalRooms, waterSupply, totalFloors,
      cabins, meetingRooms, boardRoom, buildingGrade,
      tower, parkType,
      frontage,
      warehouseType, landArea, floorType, floorLoading,
      docks, dockLevelers, truckAccess, powerLoad, officeBlock,
      landType, depth, shape, topography, compoundWall, gate,
      fsiFar, roadType, utilitiesNearby,
      pricePerAcre, pricePerAcreUnit,
      groundRent, groundRentUnit,
      zoning, leaseTenure,
      askPrice, priceUnit,
      rentPerMonth, rentUnit,
      deposit, depositUnit,
      maintenance, commissionType,
      extraRooms,
      cornerUnit, exclusive,
      parking, parkingNum,
      preferredTenant, petAllowed, nonVegAllowed,
      idealFor,
      amenities, description,
      existingImages, removeVideo,
    } = req.body;

    // ── Image management ───────────────────────────────────────
    const newImages   = req.imageUrls ?? [];
    const keptImages  = _parseJson(existingImages, property.basicDetails.images);
    const allImages   = [...keptImages, ...newImages];
    const finalImages = allImages.length > 0 ? allImages : [UPLOAD.DEFAULT_IMAGE_URL];

    // ── Video management ───────────────────────────────────────
    let videoUrl = property.basicDetails.videoUrl;
    if (_parseBool(removeVideo)) {
      if (videoUrl) {
        const pid = _extractCloudinaryId(videoUrl);
        if (pid) await cloudinary.uploader.destroy(pid, { resource_type: "video" }).catch(() => {});
      }
      videoUrl = undefined;
    } else if (req.videoUrl) {
      videoUrl = req.videoUrl;
    }

    const parsedAmenities  = _parseJson(amenities,       property.moreDetails?.amenities       ?? []);
    const parsedExtraRooms = _parseJson(extraRooms,      property.moreDetails?.extraRooms      ?? []);
    const parsedIdealFor   = _parseJson(idealFor,        property.moreDetails?.idealFor        ?? []);
    const parsedUtilities  = _parseJson(utilitiesNearby, property.propertyDetails?.utilitiesNearby ?? []);

    const _set = (obj, path, val) => {
      if (val === undefined || val === null || val === "") return;
      const keys = path.split(".");
      let cur = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!cur[keys[i]]) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = val;
    };

    const p = property;

    // Basic
    _set(p, "basicDetails.name",        name);
    _set(p, "basicDetails.listingType", listingType);
    _set(p, "basicDetails.assetType",   assetType);
    _set(p, "basicDetails.possession",  possession);
    _set(p, "basicDetails.address",     address);
    _set(p, "basicDetails.area",        area);
    _set(p, "basicDetails.state",       state);
    _set(p, "basicDetails.city",        city);
    _set(p, "basicDetails.pincode",     pincode);
    p.basicDetails.images       = finalImages;
    p.basicDetails.primaryImage = finalImages[0];
    if (videoUrl  !== undefined) p.basicDetails.videoUrl  = videoUrl;
    if (bedrooms  !== undefined) p.basicDetails.bedrooms  = Number(bedrooms);
    if (bathrooms !== undefined) p.basicDetails.bathrooms = Number(bathrooms);
    if (balconies !== undefined) p.basicDetails.balconies = Number(balconies);
    if (seats     !== undefined) p.basicDetails.seats     = Number(seats);

    // Property details
    _set(p, "propertyDetails.doorFacing",    doorFacing);
    _set(p, "propertyDetails.furnishing",    furnishing);
    _set(p, "propertyDetails.ageOfBuilding", ageOfBuilding);
    _set(p, "propertyDetails.floorNumber",   floorNumber);
    if (sbua        !== undefined) _set(p, "propertyDetails.sbua",        Number(sbua));
    if (plotArea    !== undefined) _set(p, "propertyDetails.plotArea",    Number(plotArea));
    if (uds         !== undefined) _set(p, "propertyDetails.uds",         Number(uds));
    _set(p, "propertyDetails.apartmentType", apartmentType);
    _set(p, "propertyDetails.balconyFacing", balconyFacing);
    _set(p, "propertyDetails.structure",     structure);
    if (totalRooms  !== undefined) _set(p, "propertyDetails.totalRooms",  Number(totalRooms));
    _set(p, "propertyDetails.waterSupply",   waterSupply);
    if (totalFloors !== undefined) _set(p, "propertyDetails.totalFloors", Number(totalFloors));
    if (cabins       !== undefined) _set(p, "propertyDetails.cabins",       Number(cabins));
    if (meetingRooms !== undefined) _set(p, "propertyDetails.meetingRooms", Number(meetingRooms));
    if (boardRoom    !== undefined) _set(p, "propertyDetails.boardRoom",    Number(boardRoom));
    _set(p, "propertyDetails.buildingGrade", buildingGrade);
    _set(p, "propertyDetails.tower",         tower);
    _set(p, "propertyDetails.parkType",      parkType);
    if (frontage !== undefined) _set(p, "propertyDetails.frontage", Number(frontage));
    _set(p, "propertyDetails.warehouseType", warehouseType);
    if (landArea     !== undefined) _set(p, "propertyDetails.landArea",     Number(landArea));
    _set(p, "propertyDetails.floorType",     floorType);
    if (floorLoading !== undefined) _set(p, "propertyDetails.floorLoading", Number(floorLoading));
    if (docks        !== undefined) _set(p, "propertyDetails.docks",        Number(docks));
    if (dockLevelers !== undefined) _set(p, "propertyDetails.dockLevelers", Number(dockLevelers));
    _set(p, "propertyDetails.truckAccess",   truckAccess);
    if (powerLoad   !== undefined) _set(p, "propertyDetails.powerLoad",   Number(powerLoad));
    if (officeBlock !== undefined) _set(p, "propertyDetails.officeBlock", Number(officeBlock));
    _set(p, "propertyDetails.landType",     landType);
    if (depth !== undefined) _set(p, "propertyDetails.depth", Number(depth));
    _set(p, "propertyDetails.shape",        shape);
    _set(p, "propertyDetails.topography",   topography);
    _set(p, "propertyDetails.compoundWall", compoundWall);
    _set(p, "propertyDetails.gate",         gate);
    _set(p, "propertyDetails.fsiFar",       fsiFar);
    _set(p, "propertyDetails.roadType",     roadType);
    if (parsedUtilities.length) p.propertyDetails.utilitiesNearby = parsedUtilities;
    if (pricePerAcre !== undefined) _set(p, "propertyDetails.pricePerAcre", Number(pricePerAcre));
    _set(p, "propertyDetails.pricePerAcreUnit", pricePerAcreUnit);
    if (groundRent !== undefined) _set(p, "propertyDetails.groundRent", Number(groundRent));
    _set(p, "propertyDetails.groundRentUnit", groundRentUnit);
    _set(p, "propertyDetails.zoning",       zoning);
    _set(p, "propertyDetails.leaseTenure",  leaseTenure);
    if (pricePerSqft !== undefined) _set(p, "propertyDetails.pricePerSqft", Number(pricePerSqft));
    if (askPrice     !== undefined) _set(p, "propertyDetails.askPrice",     Number(askPrice));
    _set(p, "propertyDetails.priceUnit",    priceUnit);
    if (rentPerMonth !== undefined) _set(p, "propertyDetails.rentPerMonth", Number(rentPerMonth));
    _set(p, "propertyDetails.rentUnit",     rentUnit);
    if (deposit !== undefined) _set(p, "propertyDetails.deposit", Number(deposit));
    _set(p, "propertyDetails.depositUnit",    depositUnit);
    _set(p, "propertyDetails.maintenance",    maintenance);
    _set(p, "propertyDetails.commissionType", commissionType);

    // Step 3
    if (cornerUnit    !== undefined) _set(p, "moreDetails.cornerUnit",    _parseBool(cornerUnit));
    if (exclusive     !== undefined) _set(p, "moreDetails.exclusive",     _parseBool(exclusive));
    _set(p, "moreDetails.parking",         parking);
    if (parkingNum    !== undefined) _set(p, "moreDetails.parkingNum", Number(parkingNum));
    _set(p, "moreDetails.preferredTenant", preferredTenant);
    if (petAllowed    !== undefined) _set(p, "moreDetails.petAllowed",    _parseBool(petAllowed));
    if (nonVegAllowed !== undefined) _set(p, "moreDetails.nonVegAllowed", _parseBool(nonVegAllowed));
    if (parsedExtraRooms.length) p.moreDetails.extraRooms = parsedExtraRooms;
    if (parsedIdealFor.length)   p.moreDetails.idealFor   = parsedIdealFor;
    if (parsedAmenities.length)  p.moreDetails.amenities  = parsedAmenities;
    if (description !== undefined) p.moreDetails.description = description;

    p.lastCheckedAt = new Date();
    await p.save();
    success(res, p);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/inventory/:id
// ─────────────────────────────────────────────────────────────
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return error(res, "Property not found", 404);
    property.isActive = false;
    await property.save();
    success(res, { message: "Property deleted" });
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/asset-type-counts
// ─────────────────────────────────────────────────────────────
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
      const isRentalFilter  = listingType === 'RENTAL';
      const priceField      = isRentalFilter ? 'propertyDetails.rentPerMonth' : 'propertyDetails.askPrice';
      const unitField       = isRentalFilter ? 'propertyDetails.rentUnit'     : 'propertyDetails.priceUnit';
      const normalizedPrice = {
        $cond: [{ $eq: [`$${unitField}`, 'CRORES'] }, { $multiply: [`$${priceField}`, 100] }, `$${priceField}`],
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

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/suggestions
// ─────────────────────────────────────────────────────────────
export const getSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) return success(res, []);

    const re = new RegExp(q.trim(), "i");

    const items = await Property.find({
      isActive: true,
      $or: [
        { "basicDetails.name":    re },
        { "basicDetails.city":    re },
        { "basicDetails.area":    re },
        { "basicDetails.address": re },
        { propertyId:             re },
      ],
    })
      .select(
        "propertyId basicDetails.name basicDetails.city basicDetails.area basicDetails.address " +
        "basicDetails.assetType basicDetails.listingType basicDetails.possession " +
        "basicDetails.bedrooms basicDetails.primaryImage " +
        "propertyDetails.askPrice propertyDetails.priceUnit " +
        "propertyDetails.rentPerMonth propertyDetails.rentUnit propertyDetails.sbua"
      )
      .limit(8)
      .lean();

    success(res, items);
  } catch (err) {
    error(res, err.message);
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/inventory/keywords
// ─────────────────────────────────────────────────────────────
export const getKeywords = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 1) return success(res, []);

    const q_lower = q.trim().toLowerCase();
    const re      = new RegExp(q.trim(), 'i');
    const keywords = new Set();

    // Static candidates — built at module load, zero cost here
    for (const val of STATIC_KEYWORD_CANDIDATES) {
      if (val.toLowerCase().includes(q_lower)) keywords.add(val);
    }

    const items = await Property.aggregate([
      {
        $match: {
          isActive: true,
          $or: [
            { 'basicDetails.name': re },
            { 'basicDetails.city': re },
            { 'basicDetails.area': re },
            { propertyId:          re },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          name:       '$basicDetails.name',
          city:       '$basicDetails.city',
          area:       '$basicDetails.area',
          propertyId: 1,
          bedrooms:   '$basicDetails.bedrooms',
          assetType:  '$basicDetails.assetType',
          possession: '$basicDetails.possession',
        },
      },
      { $limit: 20 },
    ]);

    for (const item of items) {
      const candidates = [
        item.name,
        item.city,
        item.area,
        item.propertyId,
        ASSET_LABELS[item.assetType],
        POSSESSION_LABELS[item.possession],
        item.bedrooms > 0 ? `${item.bedrooms} BHK` : null,
      ].filter(Boolean);

      for (const val of candidates) {
        if (val.toLowerCase().includes(q_lower)) keywords.add(val.trim());
      }
    }

    const result = [...keywords]
      .sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(q_lower) ? 0 : 1;
        const bStarts = b.toLowerCase().startsWith(q_lower) ? 0 : 1;
        return aStarts - bStarts || a.localeCompare(b);
      })
      .slice(0, 8);

    success(res, result);
  } catch (err) {
    error(res, err.message);
  }
};

// ─── helpers ──────────────────────────────────────────────────
function _parseBool(val) {
  if (typeof val === "boolean") return val;
  if (typeof val === "string")  return val.toLowerCase() === "true" || val === "Yes" || val === "1";
  return Boolean(val);
}

function _parseJson(val, fallback) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try { return JSON.parse(val); } catch { return fallback; }
  }
  return fallback;
}

function _extractCloudinaryId(url) {
  try {
    return url.replace(/^.*\/upload\/(?:v\d+\/)?/, "").replace(/\.[^.]+$/, "");
  } catch {
    return null;
  }
}