// shared/schemas/index.js
// Zod schemas — used by frontend (react-hook-form resolver)
// AND backend (Express request validation middleware).

import { z } from "zod";
import {
    AssetType, DoorFacing, AgeOfBuilding, FloorRange,
    FurnishingStatus, ParkingType, PossessionStatus,
    Amenity, PriceUnit, ListingType, BHKType, SortOption,
} from "../enums/index.js";
import { VALIDATION, REGEX } from "../constants/app.js";

const loginSchema = z.object({
    email: z.string()
        .min(1, "Email is required")
        .regex(REGEX.EMAIL, "Enter a valid email address"),
    password: z.string()
        .min(VALIDATION.PASSWORD_MIN, `Password must be at least ${VALIDATION.PASSWORD_MIN} characters`),
});

const createAdminSchema = z.object({
  name:     z.string().min(2, "Name is required"),
  email:    z.string().email("Enter a valid email"),
  imageUrl: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});


const step1Schema = z.object({
    listingType: z.enum(Object.values(ListingType), {
        required_error: "Please select a listing type",
    }),
    name: z.string()
        .min(VALIDATION.PROPERTY_NAME.MIN, "Property name is required")
        .max(VALIDATION.PROPERTY_NAME.MAX),
    assetType: z.enum(Object.values(AssetType), {
        required_error: "Please select an asset type",
    }),
    photoCount: z.number().min(1, "At least one photo is required"),
    address:    z.string().min(5, "Please enter a complete address"),
    state:      z.string().min(1, "Please select a state"),
    city:       z.string().min(1, "Please select a city"),
    pincode:    z.string().regex(REGEX.PINCODE, "Enter a valid 6-digit pincode"),
    possession: z.enum(Object.values(PossessionStatus), {
        required_error: "Please select a possession status",
    }),
});

const step2Schema = z.object({
    apartmentType: z.string().min(1, "Apartment type is required"),
    doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
    ageOfBuilding: z.enum(Object.values(AgeOfBuilding), {
        required_error: "Please select age of building",
    }),
    floorNumber: z.enum(Object.values(FloorRange)).optional(),
    bedrooms:    z.number().int().min(0).max(VALIDATION.BEDROOM_MAX).optional(),
    bathrooms:   z.number().int().min(0).max(VALIDATION.BATHROOM_MAX).optional(),
    balconies:   z.number().int().min(0).max(VALIDATION.BALCONY_MAX).optional(),
    parking: z.enum(Object.values(ParkingType), {
        required_error: "Please select parking availability",
    }),
    furnishing: z.enum(Object.values(FurnishingStatus), {
        required_error: "Please select furnishing type",
    }),
    pricePerSqft: z.number().min(0).optional(),
    askPrice: z.number({
        required_error: "Ask price is required",
    }).min(1, "Ask price must be greater than 0"),
    priceUnit: z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
    sbua: z.number({
        required_error: "SBUA is required",
    }).min(1, "Enter a valid SBUA in sqft"),
});

const step3Schema = z.object({
    amenities: z.array(z.enum(Object.values(Amenity)))
        .min(1, "Please select at least one amenity"),
    customAmenities: z.array(z.string()).default([]),
    description: z.string()
        .min(VALIDATION.DESCRIPTION.MIN, `Description must be at least ${VALIDATION.DESCRIPTION.MIN} characters`)
        .max(VALIDATION.DESCRIPTION.MAX),
});

const inventoryCreateSchema = step1Schema
    .omit({ photoCount: true })
    .merge(step2Schema)
    .merge(step3Schema);

const dashboardQuerySchema = z.object({
    search:      z.string().optional(),
    listingType: z.enum(Object.values(ListingType)).optional(),
    assetType:   z.enum(Object.values(AssetType)).optional(),
    bhkTypes:    z.array(z.enum(Object.values(BHKType))).optional(),
    budgetMin:   z.coerce.number().min(0).optional(),
    budgetMax:   z.coerce.number().min(0).optional(),
    sbuaMin:     z.coerce.number().min(0).optional(),
    sbuaMax:     z.coerce.number().min(0).max(VALIDATION.SBUA_FILTER_MAX).optional(),
    sortBy:      z.enum(Object.values(SortOption)).default(SortOption.NEWEST_FIRST),
    page:        z.coerce.number().int().min(1).default(1),
    limit:       z.coerce.number().int().min(1).max(100).default(20),
});

export {
    createAdminSchema,
    loginSchema,
    step1Schema,
    step2Schema,
    step3Schema,
    inventoryCreateSchema,
    dashboardQuerySchema,
};