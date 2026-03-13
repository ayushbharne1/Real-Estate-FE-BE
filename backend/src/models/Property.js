// backend/src/models/Property.js
import mongoose from "mongoose";
import {
  ListingType, AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus, PriceUnit,
  CommissionType, MaintenanceType, PreferredTenant, KhataType, ExtraRoom, StructureType,
} from "shared/enums";

const propertySchema = new mongoose.Schema(
  {
    // ── Auto-generated ID ─────────────────────────────────────
    propertyId: { type: String, unique: true },

    // ═════════════════════════════════════════════════════════
    // STEP 1 — Basic Details
    // ═════════════════════════════════════════════════════════
    basicDetails: {
      name:        { type: String, required: true, trim: true },
      listingType: { type: String, enum: Object.values(ListingType), required: true },
      assetType:   { type: String, enum: Object.values(AssetType),   required: true },

      // Media
      images:       [{ type: String }],
      primaryImage: { type: String },
      videoUrl:     { type: String },

      // Address
      address:      { type: String, required: true },
      area:         { type: String },
      state:        { type: String, required: true },
      city:         { type: String, required: true },
      pincode:      { type: String, required: true },
      country:      { type: String, default: "India" },
      googleMapUrl: { type: String },

      // Possession
      possession: { type: String, enum: Object.values(PossessionStatus), required: true },

      // Configuration (BHK)
      bedrooms:  { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      balconies: { type: Number, default: 0 },
      seats:     { type: Number },  // Office Space only
    },

    // ═════════════════════════════════════════════════════════
    // STEP 2 — Property Details
    // ═════════════════════════════════════════════════════════
    propertyDetails: {
      // ── Common ─────────────────────────────────────────────
      doorFacing:    { type: String, enum: [...Object.values(DoorFacing), null] },
      furnishing:    { type: String, enum: Object.values(FurnishingStatus) },
      ageOfBuilding: { type: String, enum: Object.values(AgeOfBuilding) },
      floorNumber:   { type: String, enum: [...Object.values(FloorRange), null] },

      // ── Area fields ────────────────────────────────────────
      sbua:     { type: Number },
      plotArea: { type: Number },
      uds:      { type: Number },

      // ── Apartment / Row House ──────────────────────────────
      apartmentType: { type: String },
      balconyFacing: { type: String, enum: [...Object.values(DoorFacing), null] },

      // ── Villa / IH / Row House / Villament / Comm. Property / Rental Villa
      structure: { type: String, enum: Object.values(StructureType) },

      // ── Commercial Property unique ─────────────────────────
      totalRooms:  { type: Number },
      waterSupply: { type: String },

      // ── Retail Space unique ────────────────────────────────
      totalFloors: { type: Number },

      // ── Pricing — Resale ───────────────────────────────────
      pricePerSqft: { type: Number },
      askPrice:     { type: Number },
      priceUnit:    { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },

      // ── Pricing — Rental ───────────────────────────────────
      rentPerMonth:   { type: Number },
      rentUnit:       { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },
      deposit:        { type: Number },
      depositUnit:    { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },
      maintenance:    { type: String, enum: Object.values(MaintenanceType) },
      commissionType: { type: String, enum: Object.values(CommissionType) },
    },

    // ═════════════════════════════════════════════════════════
    // STEP 3 — More Details
    // ═════════════════════════════════════════════════════════
    moreDetails: {
      // FIX: buildingKhata and landKhata now store "Yes"/"No" strings
      // (changed from A/B KhataType enum — consistent with e-Khata UI pattern)
      buildingKhata: { type: String, enum: ['Yes', 'No', ...Object.values(KhataType), null] },
      landKhata:     { type: String, enum: ['Yes', 'No', ...Object.values(KhataType), null] },
      eKhata:        { type: Boolean },
      extraRooms:    [{ type: String, enum: Object.values(ExtraRoom) }],

      // ── Resale — Row House ─────────────────────────────────
      cornerUnit:          { type: Boolean },
      bioppaApprovedKhata: { type: Boolean },

      // ── Resale — Office Space ──────────────────────────────
      exclusive: { type: Boolean },

      // ── Parking ────────────────────────────────────────────
      parking: { type: String, enum: Object.values(ParkingType) },

      // ── Rental ─────────────────────────────────────────────
      preferredTenant: { type: String, enum: Object.values(PreferredTenant) },
      petAllowed:      { type: Boolean },
      nonVegAllowed:   { type: Boolean },

      // ── Amenities ──────────────────────────────────────────
      amenities: [{ type: String }],

      // ── Description ────────────────────────────────────────
      description: { type: String, required: true },
    },

    // ═════════════════════════════════════════════════════════
    // Meta
    // ═════════════════════════════════════════════════════════
    isActive:      { type: Boolean, default: true },
    lastCheckedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-generate propertyId before save
propertySchema.pre("save", async function (next) {
  if (!this.propertyId) {
    const count = await mongoose.model("Property").countDocuments();
    this.propertyId = `PB${1000 + count + 1}`;
  }
  next();
});

export default mongoose.model("Property", propertySchema);