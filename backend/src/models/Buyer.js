// backend/src/models/Buyer.js
import mongoose from "mongoose";
import {
  ListingType,
  AssetType,
  BuyerStatus,
  PriceUnitExtended,
} from "shared/enums";

const buyerSchema = new mongoose.Schema(
  {
    // ── Identity ────────────────────────────────────────────────
    name: { type: String, required: true, trim: true },
    countryCode: { type: String, default: "+91" },
    contact: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    // ── Property Reference ──────────────────────────────────────
    propertyId: { type: String, trim: true }, // e.g. PB5609 — optional ref
    assetType: { type: String, enum: Object.values(AssetType), required: true },

    // ── Listing Type ────────────────────────────────────────────
    listingType: {
      type: String,
      enum: Object.values(ListingType),
      required: true,
    },

    // ── Resale fields (listingType === RESALE) ──────────────────
    askPrice: { type: Number },
    askPriceUnit: { type: String, enum: Object.values(PriceUnitExtended) },
    pricePaid: { type: Number },
    pricePaidUnit: { type: String, enum: Object.values(PriceUnitExtended) },

    // ── Rental fields (listingType === RENTAL) ──────────────────
    rent: { type: Number },
    rentUnit: { type: String, enum: Object.values(PriceUnitExtended) },
    deposit: { type: Number },
    depositUnit: { type: String, enum: Object.values(PriceUnitExtended) },

    // ── Status ──────────────────────────────────────────────────
    status: {
      type: String,
      enum: Object.values(BuyerStatus),
      default: BuyerStatus.IN_PROGRESS,
    },
    alternateContact: { type: String, trim: true },
    alternateCountryCode: { type: String, default: "+91" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

buyerSchema.index({ isActive: 1, listingType: 1, status: 1 });
buyerSchema.index({ isActive: 1, assetType: 1 });
buyerSchema.index({ createdAt: -1 });
buyerSchema.index({ name: 'text', email: 'text', contact: 'text', propertyId: 'text' });

export default mongoose.model("Buyer", buyerSchema);
