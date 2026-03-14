import { z } from "zod";
import {
  AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus,
  Amenity, PriceUnit, ListingType, BHKType, SortOption,
  CommissionType, MaintenanceType, PreferredTenant,
  KhataType, ExtraRoom, StructureType,
} from "../enums/index.js";
import { VALIDATION, REGEX } from "../constants/app.js";

// ─────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password:   z.string().min(VALIDATION.PASSWORD_MIN, `Password must be at least ${VALIDATION.PASSWORD_MIN} characters`),
});

// ─────────────────────────────────────────────────────────────
// STEP 1 — Basic Details  (shared by Resale & Rental)
// ─────────────────────────────────────────────────────────────
export const step1Schema = z.object({
  listingType: z.enum(Object.values(ListingType), { required_error: "Please select a listing type" }),
  name:        z.string().min(VALIDATION.PROPERTY_NAME.MIN, "Property name is required").max(VALIDATION.PROPERTY_NAME.MAX),
  assetType:   z.enum(Object.values(AssetType), { required_error: "Please select an asset type" }),
  photoCount:  z.number().min(1, "At least one photo is required"),
  address:     z.string().min(5, "Please enter a complete address"),
  area:        z.string().optional(),
  state:       z.string().min(1, "Please select a state"),
  city:        z.string().min(1, "Please select a city"),
  pincode:     z.string().regex(REGEX.PINCODE, "Enter a valid 6-digit pincode"),
  possession:  z.enum(Object.values(PossessionStatus), { required_error: "Please select a possession status" }),
  videoUrl:    z.string().url().optional(),
});

// ─────────────────────────────────────────────────────────────
// STEP 2 — Property Details: RESALE
// ─────────────────────────────────────────────────────────────

const resaleBaseSpecs = z.object({
  doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
  furnishing:    z.enum(Object.values(FurnishingStatus)).optional(),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding)).optional(),
  floorNumber:   z.enum(Object.values(FloorRange)).optional(),
  sbua:          z.number().min(1, "Enter a valid SBUA in sqft").optional(),
  pricePerSqft:  z.number().min(0).optional(),
  askPrice:      z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:     z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  bedrooms:      z.number().int().min(0).max(VALIDATION.BEDROOM_MAX).optional(),
  bathrooms:     z.number().int().min(0).max(VALIDATION.BATHROOM_MAX).optional(),
  balconies:     z.number().int().min(0).max(VALIDATION.BALCONY_MAX).optional(),
});

export const resaleApartmentStep2Schema = resaleBaseSpecs.extend({
  apartmentType: z.string().min(1, "Apartment type is required"),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

export const resaleVillaStep2Schema = resaleBaseSpecs.extend({
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

export const resalePlotStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  plotArea:     z.number({ required_error: "Plot area is required" }).min(1),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
});

export const resaleIndependentHouseStep2Schema = resaleBaseSpecs.extend({
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

export const resaleCommercialSpaceStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  sbua:         z.number({ required_error: "SBUA is required" }).min(1),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
});

export const resaleCommercialPropertyStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  structure:    z.enum(Object.values(StructureType)).optional(),
  totalRooms:   z.number().int().min(0, { required_error: "Total rooms is required" }),
  waterSupply:  z.string().optional(),
  sbua:         z.number({ required_error: "SBUA is required" }).min(1),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
});

export const resaleRowHouseStep2Schema = resaleBaseSpecs.extend({
  apartmentType: z.string().min(1, "Apartment type is required"),
  balconyFacing: z.enum(Object.values(DoorFacing), { required_error: "Balcony facing is required" }),
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

export const resaleVilamentStep2Schema = resaleBaseSpecs.extend({
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
  plotArea:      z.number({ required_error: "Plot area is required" }).min(1),
  uds:           z.number({ required_error: "UDS is required" }).min(1),
});

export const resaleOfficeSpaceStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  furnishing:   z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:         z.number({ required_error: "SBUA is required" }).min(1),
  seats:        z.number().int().min(1, "Number of seats is required"),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
});

export const resaleRetailSpaceStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  furnishing:   z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  totalFloors:  z.number().int().min(1, "Total floors is required"),
  sbua:         z.number({ required_error: "SBUA is required" }).min(1),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
});

// ─────────────────────────────────────────────────────────────
// STEP 2 — Property Details: RENTAL
// ─────────────────────────────────────────────────────────────

const rentalBaseSpecs = z.object({
  doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
  furnishing:    z.enum(Object.values(FurnishingStatus)).optional(),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding)).optional(),
  floorNumber:   z.enum(Object.values(FloorRange)).optional(),
  sbua:          z.number().min(1).optional(),
  pricePerSqft:  z.number().min(0).optional(),
  rentPerMonth:  z.number({ required_error: "Rent is required" }).min(1),
  rentUnit:      z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  deposit:       z.number().min(0).optional(),
  depositUnit:   z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  maintenance:   z.enum(Object.values(MaintenanceType)).optional(),
  commissionType: z.enum(Object.values(CommissionType)).optional(),
  bedrooms:      z.number().int().min(0).max(VALIDATION.BEDROOM_MAX).optional(),
  bathrooms:     z.number().int().min(0).max(VALIDATION.BATHROOM_MAX).optional(),
  balconies:     z.number().int().min(0).max(VALIDATION.BALCONY_MAX).optional(),
});

export const rentalApartmentStep2Schema = rentalBaseSpecs.extend({
  apartmentType: z.string().min(1, "Apartment type is required"),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

export const rentalVillaStep2Schema = rentalBaseSpecs.extend({
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

export const rentalCommercialSpaceStep2Schema = z.object({
  doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
  rentPerMonth:  z.number({ required_error: "Rent is required" }).min(1),
  rentUnit:      z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  deposit:       z.number().min(0).optional(),
  depositUnit:   z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  commissionType: z.enum(Object.values(CommissionType)).optional(),
});

export const rentalOfficeSpaceStep2Schema = z.object({
  doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
  seats:         z.number().int().min(1, "Number of seats is required"),
  rentPerMonth:  z.number({ required_error: "Rent is required" }).min(1),
  rentUnit:      z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  deposit:       z.number().min(0).optional(),
  depositUnit:   z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  commissionType: z.enum(Object.values(CommissionType)).optional(),
});

export const rentalRetailSpaceStep2Schema = z.object({
  doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  totalFloors:   z.number().int().min(1, "Total floors is required"),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
  rentPerMonth:  z.number({ required_error: "Rent is required" }).min(1),
  rentUnit:      z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  deposit:       z.number().min(0).optional(),
  depositUnit:   z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  commissionType: z.enum(Object.values(CommissionType)).optional(),
});

// ─────────────────────────────────────────────────────────────
// STEP 3 — More Details
// ─────────────────────────────────────────────────────────────

export const resaleApartmentStep3Schema = z.object({
  parking:             z.enum(Object.values(ParkingType), { required_error: "Parking is required" }),
  amenities:           z.array(z.enum(Object.values(Amenity))).min(1, "Please select at least one amenity"),
  customAmenities:     z.array(z.string()).default([]),
  description:         z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

export const resalePlotStep3Schema = z.object({
  description: z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

export const rentalStep3Schema = z.object({
  preferredTenant: z.enum(Object.values(PreferredTenant)).optional(),
  petAllowed:      z.boolean().optional(),
  nonVegAllowed:   z.boolean().optional(),
  amenities:       z.array(z.enum(Object.values(Amenity))).min(1, "Please select at least one amenity"),
  customAmenities: z.array(z.string()).default([]),
  description:     z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

// ─────────────────────────────────────────────────────────────
// Full create schema
// ─────────────────────────────────────────────────────────────
export const inventoryCreateSchema = step1Schema
  .omit({ photoCount: true })
  .merge(resaleBaseSpecs)
  .merge(resaleApartmentStep3Schema)
  .partial();

// ─────────────────────────────────────────────────────────────
// Dashboard query schema
// ─────────────────────────────────────────────────────────────
export const dashboardQuerySchema = z.object({
  search:      z.string().optional(),
  listingType: z.enum(Object.values(ListingType)).optional(),
  assetType:   z.enum(Object.values(AssetType)).optional(),
  // FIX: BHKType values are numbers (0-5). Query params arrive as strings.
  // z.enum([0,1,2,3,4,5]) rejects "1","2" etc. Use coerce.number() instead.
  bhkTypes:    z.union([
    z.array(z.coerce.number().int().min(0).max(5)),
    z.coerce.number().int().min(0).max(5).transform(v => [v]),
  ]).optional(),
  budgetMin:   z.coerce.number().min(0).optional(),
  budgetMax:   z.coerce.number().min(0).optional(),
  sbuaMin:     z.coerce.number().min(0).optional(),
  // FIX: removed .max(VALIDATION.SBUA_FILTER_MAX) — was capped at 1000 sqft causing rejections
  sbuaMax:     z.coerce.number().min(0).optional(),
  sortBy:      z.enum(Object.values(SortOption)).default(SortOption.NEWEST_FIRST),
  page:        z.coerce.number().int().min(1).default(1),
  limit:       z.coerce.number().int().min(1).max(100).default(20),
});