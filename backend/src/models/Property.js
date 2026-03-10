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
      address:      { type: String, required: true },  // full formatted string
      area:         { type: String },                  // locality / micromarket e.g. "Whitefield"
      state:        { type: String, required: true },
      city:         { type: String, required: true },
      pincode:      { type: String, required: true },
      country:      { type: String, default: "India" },
      googleMapUrl: { type: String },

      // Possession
      possession: { type: String, enum: Object.values(PossessionStatus), required: true },

      // Configuration (BHK) — Not for: Plot, Commercial Space, Commercial Property, Retail Space
      bedrooms:  { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      balconies: { type: Number, default: 0 },
      seats:     { type: Number },  // Office Space only — No. of Seats
    },

    // ═════════════════════════════════════════════════════════
    // STEP 2 — Property Details
    // ═════════════════════════════════════════════════════════
    propertyDetails: {
      // ── Common ─────────────────────────────────────────────
      doorFacing:    { type: String, enum: [...Object.values(DoorFacing), null] },
      furnishing:    { type: String, enum: Object.values(FurnishingStatus) },
                     // FURNISHED / SEMI_FURNISHED / UNFURNISHED for most types
                     // PLUG_AND_PLAY for Office Space
                     // WARM_SHELL   for Retail Space
                     // Not applicable for Plot
      ageOfBuilding: { type: String, enum: Object.values(AgeOfBuilding) },
                     // Not applicable for Plot
      floorNumber:   { type: String, enum: [...Object.values(FloorRange), null] },
                     // Apartment, Row House, Office Space, Retail Space

      // ── Area fields ────────────────────────────────────────
      sbua:     { type: Number },  // Super Built-Up Area — NOT for Plot
      plotArea: { type: Number },  // Plot, Villament (unique), Retail Space (unique)
      uds:      { type: Number },  // Undivided Spaces — Villament only

      // ── Apartment / Row House ──────────────────────────────
      apartmentType: { type: String },  // e.g. Simplex, Duplex
      balconyFacing: { type: String, enum: [...Object.values(DoorFacing), null] },
                     // Row House only (unique field)

      // ── Villa / IH / Row House / Villament / Comm. Property / Rental Villa ──
      structure: { type: String, enum: Object.values(StructureType) },

      // ── Commercial Property unique ─────────────────────────
      totalRooms:  { type: Number },
      waterSupply: { type: String },

      // ── Retail Space unique ────────────────────────────────
      totalFloors: { type: Number },

      // ── Pricing — Resale ───────────────────────────────────
      pricePerSqft: { type: Number },
      askPrice:     { type: Number },   // required for RESALE
      priceUnit:    { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },

      // ── Pricing — Rental ───────────────────────────────────
      rentPerMonth:   { type: Number },  // required for RENTAL
      rentUnit:       { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },
      deposit:        { type: Number },  // Apartment Rental only — Villa Rental has no deposit
      depositUnit:    { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },
      maintenance:    { type: String, enum: Object.values(MaintenanceType) },
      commissionType: { type: String, enum: Object.values(CommissionType) },
    },

    // ═════════════════════════════════════════════════════════
    // STEP 3 — More Details
    // ═════════════════════════════════════════════════════════
    moreDetails: {
      // ── Resale — Apartment ─────────────────────────────────
      buildingKhata: { type: String, enum: [...Object.values(KhataType), null] },
                     // Apartment (Resale), Row House (Resale)
      landKhata:     { type: String, enum: [...Object.values(KhataType), null] },
                     // Apartment (Resale), Office Space (Resale)
      eKhata:        { type: Boolean },
                     // Apartment (Resale), Row House (Resale)
      extraRooms:    [{ type: String, enum: Object.values(ExtraRoom) }],
                     // Apartment (Resale) only

      // ── Resale — Row House ─────────────────────────────────
      cornerUnit:          { type: Boolean },  // Row House, Office Space
      bioppaApprovedKhata: { type: Boolean },  // Row House only

      // ── Resale — Office Space ──────────────────────────────
      exclusive: { type: Boolean },

      // ── Parking — all Resale types ─────────────────────────
      parking: { type: String, enum: Object.values(ParkingType) },

      // ── Rental — all ───────────────────────────────────────
      preferredTenant: { type: String, enum: Object.values(PreferredTenant) },
      petAllowed:      { type: Boolean },
      nonVegAllowed:   { type: Boolean },

      // ── Amenities — all types except Plot ──────────────────
      // Plain [String] — no enum, supports standard + custom entries freely
      amenities: [{ type: String }],

      // ── Description — all types ────────────────────────────
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