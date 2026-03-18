// shared/schemas/buyer.js
import { z } from "zod";
import { ListingType, AssetType, PriceUnitExtended, BuyerStatus } from "../enums/index.js";

const assetTypeValues    = /** @type {[string, ...string[]]} */ ([...Object.values(AssetType)]);
const listingTypeValues  = /** @type {[string, ...string[]]} */ ([...Object.values(ListingType)]);
const priceUnitExtValues = /** @type {[string, ...string[]]} */ ([...Object.values(PriceUnitExtended)]);
const buyerStatusValues  = /** @type {[string, ...string[]]} */ ([...Object.values(BuyerStatus)]);

const buyerBaseSchema = z.object({
  name:        z.string().min(1, "Name is required").max(100),
  countryCode: z.string().default("+91"),
  contact:     z.string().min(7, "Valid contact number required").max(15),
  email:       z.string().email("Valid email required"),
  propertyId:  z.string().optional(),
  assetType:   z.enum(assetTypeValues,   { required_error: "Asset type is required" }),
  listingType: z.enum(listingTypeValues, { required_error: "Listing type is required" }),

  // Resale fields — all optional at base level, superRefine handles conditional required
  askPrice:      z.number().min(0).optional(),
  askPriceUnit:  z.enum(priceUnitExtValues).optional(),
  pricePaid:     z.number().min(0).optional(),
  pricePaidUnit: z.enum(priceUnitExtValues).optional(),

  // Rental fields — all optional at base level
  rent:         z.number().min(0).optional(),
  rentUnit:     z.enum(priceUnitExtValues).optional(),
  deposit:      z.number().min(0).optional(),
  depositUnit:  z.enum(priceUnitExtValues).optional(),

  status: z.enum(buyerStatusValues).default("IN_PROGRESS"),
});

export const buyerCreateSchema = buyerBaseSchema.superRefine((data, ctx) => {
  if (data.listingType === ListingType.RESALE) {
    if (data.askPrice === undefined || data.askPrice === null) {
      ctx.addIssue({ path: ["askPrice"], code: z.ZodIssueCode.custom, message: "Ask price is required for Resale" });
    }
    if (data.pricePaid === undefined || data.pricePaid === null) {
      ctx.addIssue({ path: ["pricePaid"], code: z.ZodIssueCode.custom, message: "Price paid is required for Resale" });
    }
  }
  if (data.listingType === ListingType.RENTAL) {
    if (data.rent === undefined || data.rent === null) {
      ctx.addIssue({ path: ["rent"], code: z.ZodIssueCode.custom, message: "Rent is required for Rental" });
    }
  }
});

export const buyerUpdateSchema = buyerBaseSchema.partial();

export const buyerStatusSchema = z.object({
  status: z.enum(buyerStatusValues, { required_error: "Status is required" }),
});

export const buyerQuerySchema = z.object({
  search:      z.string().optional(),
  listingType: z.enum(listingTypeValues).optional(),
  assetType:   z.enum(assetTypeValues).optional(),
  status:      z.enum(buyerStatusValues).optional(),
  page:        z.coerce.number().int().min(1).default(1),
  limit:       z.coerce.number().int().min(1).max(100).default(20),
});