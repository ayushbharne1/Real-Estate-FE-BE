// backend/src/models/Property.js
import mongoose from "mongoose";
import {
  ListingType, AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus, PriceUnit,
  CommissionType, MaintenanceType, PreferredTenant, ExtraRoom, StructureType,
  BuildingGrade, ParkType, WarehouseType, FloorType, TruckAccess,
  Zoning, LandType, LandShape, Topography, CompoundWall, GateType,
  RoadType, LeaseTenure,
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

      // Configuration (BHK) — residential
      bedrooms:  { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      balconies: { type: Number, default: 0 },

      // Office Space workstations
      seats: { type: Number },
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

      // ── Villa / IH / Row House / Villament / Comm. Property
      structure: { type: String, enum: Object.values(StructureType) },

      // ── Commercial Property unique ─────────────────────────
      totalRooms:  { type: Number },
      waterSupply: { type: String },

      // ── Retail Space unique ────────────────────────────────
      totalFloors: { type: Number },

      // ── Office Space ───────────────────────────────────────
      cabins:        { type: Number },
      meetingRooms:  { type: Number },
      boardRoom:     { type: Number },
      buildingGrade: { type: String, enum: Object.values(BuildingGrade) },

      // ── Tech Park ──────────────────────────────────────────
      tower:    { type: String },
      parkType: { type: String, enum: Object.values(ParkType) },

      // ── Showroom / Shop / Industrial Land ──────────────────
      frontage: { type: Number },

      // ── Warehouse ──────────────────────────────────────────
      warehouseType: { type: String, enum: Object.values(WarehouseType) },
      landArea:      { type: Number },
      floorType:     { type: String, enum: Object.values(FloorType) },
      floorLoading:  { type: Number },
      docks:         { type: Number },
      dockLevelers:  { type: Number },
      truckAccess:   { type: String, enum: Object.values(TruckAccess) },
      powerLoad:     { type: Number },
      officeBlock:   { type: Number },

      // ── Industrial Land ────────────────────────────────────
      landType:     { type: String, enum: Object.values(LandType) },
      depth:        { type: Number },
      shape:        { type: String, enum: Object.values(LandShape) },
      topography:   { type: String, enum: Object.values(Topography) },
      compoundWall: { type: String, enum: Object.values(CompoundWall) },
      gate:         { type: String, enum: Object.values(GateType) },
      fsiFar:       { type: String },
      roadType:     { type: String, enum: Object.values(RoadType) },
      utilitiesNearby: [{ type: String }],

      // ── Zoning (Warehouse + Industrial Land) ───────────────
      zoning: { type: String, enum: Object.values(Zoning) },

      // ── Rental — Lease Tenure (Office, Shop, Tech Park, Warehouse, Land)
      leaseTenure: { type: String, enum: Object.values(LeaseTenure) },

      // ── Industrial Land pricing ────────────────────────────
      pricePerAcre:    { type: Number },
      pricePerAcreUnit:{ type: String, enum: Object.values(PriceUnit), default: PriceUnit.CRORES },
      groundRent:      { type: Number },
      groundRentUnit:  { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },

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
      // ── Residential Khata ──────────────────────────────────
      extraRooms:    [{ type: String, enum: Object.values(ExtraRoom) }],

      // ── Resale — Row House ─────────────────────────────────
      cornerUnit:          { type: Boolean },

      // ── Resale — Office Space ──────────────────────────────
      exclusive: { type: Boolean },

      // ── Parking — residential (enum) ───────────────────────
      parking: { type: String, enum: Object.values(ParkingType) },

      // ── Parking — commercial (number of slots) ─────────────
      parkingNum: { type: Number },

      // ── Rental ─────────────────────────────────────────────
      preferredTenant: { type: String, enum: Object.values(PreferredTenant) },
      petAllowed:      { type: Boolean },
      nonVegAllowed:   { type: Boolean },

      // ── Showroom ───────────────────────────────────────────
      idealFor: [{ type: String }],

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