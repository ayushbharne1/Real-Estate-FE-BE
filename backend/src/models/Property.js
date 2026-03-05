import mongoose from "mongoose";
import {
  ListingType, AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus, Amenity, PriceUnit,
} from "shared/enums";

const propertySchema = new mongoose.Schema(
  {
    propertyId:   { type: String, unique: true },
    name:         { type: String, required: true, trim: true },
    listingType:  { type: String, enum: Object.values(ListingType), required: true },
    assetType:    { type: String, enum: Object.values(AssetType),   required: true },
    possession:   { type: String, enum: Object.values(PossessionStatus), required: true },

    address: {
      street:       { type: String, required: true },
      city:         { type: String, required: true },
      state:        { type: String, required: true },
      pincode:      { type: String, required: true },
      country:      { type: String, default: "India" },
      googleMapUrl: { type: String },
    },

    images:       [{ type: String }],
    primaryImage: { type: String },

    configuration: {
      bedrooms:  { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      balconies: { type: Number, default: 0 },
    },

    specs: {
      apartmentType: { type: String },
      doorFacing:    { type: String, enum: [...Object.values(DoorFacing), null] },
      ageOfBuilding: { type: String, enum: Object.values(AgeOfBuilding) },
      floorNumber:   { type: String, enum: [...Object.values(FloorRange), null] },
      furnishing:    { type: String, enum: Object.values(FurnishingStatus) },
      parking:       { type: String, enum: Object.values(ParkingType) },
      area:          { type: Number },
      sbua:          { type: Number, required: true },
      pricePerSqft:  { type: Number },
      askPrice:      { type: Number, required: true },
      priceUnit:     { type: String, enum: Object.values(PriceUnit), default: PriceUnit.LAKHS },
    },

    amenities:       [{ type: String, enum: Object.values(Amenity) }],
    customAmenities: [{ type: String }],
    description:     { type: String, required: true },
    isActive:        { type: Boolean, default: true },
    lastCheckedAt:   { type: Date, default: Date.now },
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