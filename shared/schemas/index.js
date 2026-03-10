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
  area:        z.string().optional(),            // locality / micromarket
  state:       z.string().min(1, "Please select a state"),
  city:        z.string().min(1, "Please select a city"),
  pincode:     z.string().regex(REGEX.PINCODE, "Enter a valid 6-digit pincode"),
  possession:  z.enum(Object.values(PossessionStatus), { required_error: "Please select a possession status" }),
  videoUrl:    z.string().url().optional(),
});

// ─────────────────────────────────────────────────────────────
// STEP 2 — Property Details: RESALE
// ─────────────────────────────────────────────────────────────

// Fields shared across most resale types
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

// Apartment (Resale) — Step 2
export const resaleApartmentStep2Schema = resaleBaseSpecs.extend({
  apartmentType: z.string().min(1, "Apartment type is required"),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

// Villa (Resale) — Step 2
export const resaleVillaStep2Schema = resaleBaseSpecs.extend({
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

// Plot (Resale) — Step 2 — minimal fields, uses plotArea not sbua
export const resalePlotStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  plotArea:     z.number({ required_error: "Plot area is required" }).min(1),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
});

// Independent House (Resale) — Step 2
export const resaleIndependentHouseStep2Schema = resaleBaseSpecs.extend({
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

// Row House (Resale) — Step 2
export const resaleRowHouseStep2Schema = resaleBaseSpecs.extend({
  apartmentType: z.string().min(1, "Apartment type is required"),
  balconyFacing: z.enum(Object.values(DoorFacing), { required_error: "Balcony facing is required" }),
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
});

// Villament (Resale) — Step 2
export const resaleVilamentStep2Schema = resaleBaseSpecs.extend({
  structure:     z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
  plotArea:      z.number({ required_error: "Plot area is required" }).min(1),
  uds:           z.number({ required_error: "UDS is required" }).min(1),
});

// Commercial Space (Resale) — Step 2 — minimal
export const resaleCommercialSpaceStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  sbua:         z.number({ required_error: "SBUA is required" }).min(1),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
});

// Commercial Property (Resale) — Step 2
export const resaleCommercialPropertyStep2Schema = z.object({
  doorFacing:   z.enum(Object.values(DoorFacing)).optional(),
  structure:    z.enum(Object.values(StructureType)).optional(),
  totalRooms:   z.number().int().min(0, { required_error: "Total rooms is required" }),
  waterSupply:  z.string().optional(),
  sbua:         z.number({ required_error: "SBUA is required" }).min(1),
  askPrice:     z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  pricePerSqft: z.number().min(0).optional(),
  eKhata:       z.boolean().optional(),
});

// Office Space (Resale) — Step 2
export const resaleOfficeSpaceStep2Schema = z.object({
  seats:         z.number().int().min(1, "Number of seats is required"),
  doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  floorNumber:   z.enum(Object.values(FloorRange)).optional(),
  furnishing:    z.literal(FurnishingStatus.PLUG_AND_PLAY).default(FurnishingStatus.PLUG_AND_PLAY),
  pricePerSqft:  z.number().min(0).optional(),
  askPrice:      z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:     z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
  buildingKhata: z.enum(Object.values(KhataType)).optional(),
});

// Retail Space (Resale) — Step 2
export const resaleRetailSpaceStep2Schema = z.object({
  doorFacing:    z.enum(Object.values(DoorFacing)).optional(),
  totalFloors:   z.number().int().min(1, "Total floors is required"),
  floorNumber:   z.enum(Object.values(FloorRange)).optional(),
  ageOfBuilding: z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  furnishing:    z.literal(FurnishingStatus.WARM_SHELL).default(FurnishingStatus.WARM_SHELL),
  pricePerSqft:  z.number().min(0).optional(),
  askPrice:      z.number({ required_error: "Ask price is required" }).min(1),
  priceUnit:     z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  sbua:          z.number({ required_error: "SBUA is required" }).min(1),
  plotArea:      z.number({ required_error: "Plot area is required" }).min(1),
});

// ─────────────────────────────────────────────────────────────
// STEP 2 — Property Details: RENTAL
// ─────────────────────────────────────────────────────────────

// Apartment (Rental) — Step 2 + Pricing
export const rentalApartmentStep2Schema = z.object({
  apartmentType:  z.string().min(1, "Apartment type is required"),
  doorFacing:     z.enum(Object.values(DoorFacing)).optional(),
  ageOfBuilding:  z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  totalFloors:    z.number().int().min(0).optional(),
  floorNumber:    z.enum(Object.values(FloorRange)).optional(),
  furnishing:     z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:           z.number({ required_error: "SBUA is required" }).min(1),
  bedrooms:       z.number().int().min(0).max(VALIDATION.BEDROOM_MAX).optional(),
  bathrooms:      z.number().int().min(0).max(VALIDATION.BATHROOM_MAX).optional(),
  balconies:      z.number().int().min(0).max(VALIDATION.BALCONY_MAX).optional(),
  // Pricing
  rentPerMonth:   z.number({ required_error: "Rent per month is required" }).min(1),
  rentUnit:       z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  deposit:        z.number({ required_error: "Deposit is required" }).min(0),
  depositUnit:    z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  maintenance:    z.enum(Object.values(MaintenanceType), { required_error: "Maintenance type is required" }),
  commissionType: z.enum(Object.values(CommissionType), { required_error: "Commission type is required" }),
});

// Villa (Rental) — Step 2 + Pricing (no deposit)
export const rentalVillaStep2Schema = z.object({
  doorFacing:     z.enum(Object.values(DoorFacing)).optional(),
  ageOfBuilding:  z.enum(Object.values(AgeOfBuilding), { required_error: "Age of building is required" }),
  structure:      z.enum(Object.values(StructureType), { required_error: "Structure is required" }),
  totalFloors:    z.number().int().min(0).optional(),
  furnishing:     z.enum(Object.values(FurnishingStatus), { required_error: "Furnishing is required" }),
  sbua:           z.number({ required_error: "SBUA is required" }).min(1),
  parking:        z.enum(Object.values(ParkingType)).optional(),
  bedrooms:       z.number().int().min(0).max(VALIDATION.BEDROOM_MAX).optional(),
  bathrooms:      z.number().int().min(0).max(VALIDATION.BATHROOM_MAX).optional(),
  balconies:      z.number().int().min(0).max(VALIDATION.BALCONY_MAX).optional(),
  // Pricing — no deposit for villa
  rentPerMonth:   z.number({ required_error: "Rent per month is required" }).min(1),
  rentUnit:       z.enum(Object.values(PriceUnit)).default(PriceUnit.LAKHS),
  maintenance:    z.enum(Object.values(MaintenanceType), { required_error: "Maintenance type is required" }),
  commissionType: z.enum(Object.values(CommissionType), { required_error: "Commission type is required" }),
});

// ─────────────────────────────────────────────────────────────
// STEP 3 — More Details
// ─────────────────────────────────────────────────────────────

// Resale — Apartment More Details
export const resaleApartmentStep3Schema = z.object({
  buildingKhata:   z.enum(Object.values(KhataType)).optional(),
  landKhata:       z.enum(Object.values(KhataType)).optional(),
  parking:         z.enum(Object.values(ParkingType), { required_error: "Parking is required" }),
  eKhata:          z.boolean().optional(),
  extraRooms:      z.array(z.enum(Object.values(ExtraRoom))).default([]),
  amenities:       z.array(z.enum(Object.values(Amenity))).min(1, "Please select at least one amenity"),
  customAmenities: z.array(z.string()).default([]),
  description:     z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

// Resale — Villa / IH / Villament / Commercial More Details
export const resaleGeneralStep3Schema = z.object({
  parking:         z.enum(Object.values(ParkingType), { required_error: "Parking is required" }),
  amenities:       z.array(z.enum(Object.values(Amenity))).min(1, "Please select at least one amenity"),
  customAmenities: z.array(z.string()).default([]),
  description:     z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

// Resale — Row House More Details
export const resaleRowHouseStep3Schema = z.object({
  buildingKhata:       z.enum(Object.values(KhataType)).optional(),
  cornerUnit:          z.boolean().optional(),
  eKhata:              z.boolean().optional(),
  bioppaApprovedKhata: z.boolean().optional(),
  parking:             z.enum(Object.values(ParkingType), { required_error: "Parking is required" }),
  amenities:           z.array(z.enum(Object.values(Amenity))).min(1, "Please select at least one amenity"),
  customAmenities:     z.array(z.string()).default([]),
  description:         z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

// Resale — Office Space More Details
export const resaleOfficeSpaceStep3Schema = z.object({
  landKhata:       z.enum(Object.values(KhataType)).optional(),
  cornerUnit:      z.boolean().optional(),
  exclusive:       z.boolean().optional(),
  parking:         z.enum(Object.values(ParkingType), { required_error: "Parking is required" }),
  amenities:       z.array(z.enum(Object.values(Amenity))).min(1, "Please select at least one amenity"),
  customAmenities: z.array(z.string()).default([]),
  description:     z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

// Resale — Plot More Details (description only, no amenities)
export const resalePlotStep3Schema = z.object({
  description: z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

// Rental — Apartment / Villa More Details
export const rentalStep3Schema = z.object({
  preferredTenant: z.enum(Object.values(PreferredTenant)).optional(),
  petAllowed:      z.boolean().optional(),
  nonVegAllowed:   z.boolean().optional(),
  amenities:       z.array(z.enum(Object.values(Amenity))).min(1, "Please select at least one amenity"),
  customAmenities: z.array(z.string()).default([]),
  description:     z.string().min(VALIDATION.DESCRIPTION.MIN).max(VALIDATION.DESCRIPTION.MAX),
});

// ─────────────────────────────────────────────────────────────
// Full create schema (flat merge for single-step API calls)
// ─────────────────────────────────────────────────────────────
export const inventoryCreateSchema = step1Schema
  .omit({ photoCount: true })
  .merge(resaleBaseSpecs)
  .merge(resaleApartmentStep3Schema)
  .partial();  // all optional at top level — controller handles asset-type logic

// ─────────────────────────────────────────────────────────────
// Dashboard query schema
// ─────────────────────────────────────────────────────────────
export const dashboardQuerySchema = z.object({
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