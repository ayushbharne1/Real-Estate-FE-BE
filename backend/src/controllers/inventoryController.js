import Property from "../models/Property.js";
import { success, error } from "../utils/response.js";

const createProperty = async (req, res) => {
  try {
    const {
      name, listingType, assetType, possession,
      address, state, city, pincode,
      apartmentType, doorFacing, ageOfBuilding, floorNumber,
      bedrooms, bathrooms, balconies,
      parking, furnishing, pricePerSqft, askPrice, priceUnit, sbua,
      amenities, customAmenities, description,
    } = req.body;

    // req.files populated by multer-storage-cloudinary
    // Each file has .path (Cloudinary secure URL) and .filename (public_id)
    const images = (req.files || []).map((f) => f.path);
    const primaryImage = images[0] || "";

    // amenities and customAmenities arrive as JSON strings from multipart form
    const parsedAmenities       = typeof amenities === "string"       ? JSON.parse(amenities)       : (amenities || []);
    const parsedCustomAmenities = typeof customAmenities === "string" ? JSON.parse(customAmenities) : (customAmenities || []);

    const property = await Property.create({
      name,
      listingType,
      assetType,
      possession,
      address: { street: address, city, state, pincode },
      images,
      primaryImage,
      configuration: {
        bedrooms:  Number(bedrooms)  || 0,
        bathrooms: Number(bathrooms) || 0,
        balconies: Number(balconies) || 0,
      },
      specs: {
        apartmentType,
        doorFacing:   doorFacing   || undefined,
        ageOfBuilding,
        floorNumber:  floorNumber  || undefined,
        furnishing,
        parking,
        pricePerSqft: pricePerSqft ? Number(pricePerSqft) : undefined,
        askPrice:     Number(askPrice),
        priceUnit:    priceUnit || "LAKHS",
        sbua:         Number(sbua),
      },
      amenities:       parsedAmenities,
      customAmenities: parsedCustomAmenities,
      description,
    });

    success(res, property, 201);
  } catch (err) {
    error(res, err.message);
  }
};

export { createProperty };