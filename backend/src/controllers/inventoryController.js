import Property from "../models/Property.js";
import { success, error } from "../utils/response.js";

export const createProperty = async (req, res) => {
  try {
    const {
      name, listingType, assetType, possession,
      address, state, city, pincode,
      apartmentType, doorFacing, ageOfBuilding, floorNumber,
      bedrooms, bathrooms, balconies,
      parking, furnishing, pricePerSqft, askPrice, priceUnit, sbua,
      amenities, customAmenities, description,
    } = req.body;

    // image URLs uploaded separately, passed as array in body or via upload route
    const images = req.body.images || [];

    const property = await Property.create({
      name, listingType, assetType, possession,
      address: { street: address, city, state, pincode },
      images,
      primaryImage: images[0] || "",
      configuration: { bedrooms: bedrooms || 0, bathrooms: bathrooms || 0, balconies: balconies || 0 },
      specs: { apartmentType, doorFacing, ageOfBuilding, floorNumber, furnishing, parking, pricePerSqft, askPrice, priceUnit, sbua },
      amenities,
      customAmenities,
      description,
    });

    success(res, property, 201);
  } catch (err) {
    error(res, err.message);
  }
};