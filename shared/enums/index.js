// shared/enums/index.js
// All application enums — imported by both frontend and backend.

const ListingType = Object.freeze({
  RESALE: "RESALE",
  RENTAL: "RENTAL",
});

const AssetType = Object.freeze({
  APARTMENT:           "APARTMENT",
  PLOT:                "PLOT",
  VILLA:               "VILLA",
  INDEPENDENT_HOUSE:   "INDEPENDENT_HOUSE",
  COMMERCIAL_SPACE:    "COMMERCIAL_SPACE",
  ROW_HOUSE:           "ROW_HOUSE",
  COMMERCIAL_PROPERTY: "COMMERCIAL_PROPERTY",
  VILAMENT:            "VILAMENT",
  OFFICE_SPACE:        "OFFICE_SPACE",
  RETAIL_SPACE:        "RETAIL_SPACE",
});

const DoorFacing = Object.freeze({
  NORTH:      "NORTH",
  SOUTH:      "SOUTH",
  EAST:       "EAST",
  WEST:       "WEST",
  NORTH_EAST: "NORTH_EAST",
  NORTH_WEST: "NORTH_WEST",
  SOUTH_EAST: "SOUTH_EAST",
  SOUTH_WEST: "SOUTH_WEST",
});

const AgeOfBuilding = Object.freeze({
  NEW:         "NEW",
  ONE_TO_FIVE: "ONE_TO_FIVE",
  FIVE_TO_TEN: "FIVE_TO_TEN",
  TEN_PLUS:    "TEN_PLUS",
});

const FloorRange = Object.freeze({
  GROUND: "GROUND",
  LOWER:  "LOWER",
  MID:    "MID",
  HIGH:   "HIGH",
  ULTRA:  "ULTRA",
});

const FurnishingStatus = Object.freeze({
  FURNISHED:      "FURNISHED",
  SEMI_FURNISHED: "SEMI_FURNISHED",
  UNFURNISHED:    "UNFURNISHED",
  PLUG_AND_PLAY:  "PLUG_AND_PLAY",   // Office Space
  WARM_SHELL:     "WARM_SHELL",      // Retail Space
});

const ParkingType = Object.freeze({
  NONE:       "NONE",
  ONE:        "ONE",
  TWO:        "TWO",
  THREE_PLUS: "THREE_PLUS",
  OPEN:       "OPEN",
  COVERED:    "COVERED",
});

const PossessionStatus = Object.freeze({
  READY_TO_MOVE:      "READY_TO_MOVE",
  UNDER_CONSTRUCTION: "UNDER_CONSTRUCTION",
  NEW_LAUNCH:         "NEW_LAUNCH",
  RESALE_READY:       "RESALE_READY",
});

const BHKType = Object.freeze({
  STUDIO:    0,
  ONE_BHK:   1,
  TWO_BHK:   2,
  THREE_BHK: 3,
  FOUR_BHK:  4,
  FIVE_BHK:  5,
});

const Amenity = Object.freeze({
  SWIMMING_POOL:      "SWIMMING_POOL",
  LIFTS:              "LIFTS",
  CCTV_SURVEILLANCE:  "CCTV_SURVEILLANCE",
  SECURITY:           "SECURITY",
  POWER_BACKUP:       "POWER_BACKUP",
  WATER_STORAGE:      "WATER_STORAGE",
  GYM:                "GYM",
  GARDEN_LANDSCAPING: "GARDEN_LANDSCAPING",
  COMMUNITY_CENTER:   "COMMUNITY_CENTER",
  CONCIERGE_SERVICE:  "CONCIERGE_SERVICE",
  PLAY_AREA:          "PLAY_AREA",
});

const PriceUnit = Object.freeze({
  LAKHS:  "LAKHS",
  CRORES: "CRORES",
});

// ── Rental-specific enums ─────────────────────────────
const CommissionType = Object.freeze({
  COMMISSION_SHARING: "COMMISSION_SHARING",
  OWNER_PAYS:         "OWNER_PAYS",
  TENANT_PAYS:        "TENANT_PAYS",
});

const MaintenanceType = Object.freeze({
  INCLUDED:     "INCLUDED",
  NOT_INCLUDED: "NOT_INCLUDED",
});

const PreferredTenant = Object.freeze({
  FAMILY:       "FAMILY",
  BACHELOR:     "BACHELOR",
  COMPANY:      "COMPANY",
  ANY:          "ANY",
});

// ── Resale-specific enums ─────────────────────────────
const KhataType = Object.freeze({
  A: "A",
  B: "B",
});

const ExtraRoom = Object.freeze({
  STUDY_ROOM:    "STUDY_ROOM",
  SERVANT_ROOM:  "SERVANT_ROOM",
  POOJA_ROOM:    "POOJA_ROOM",
  STORE_ROOM:    "STORE_ROOM",
});

const StructureType = Object.freeze({
  G:      "G",
  G_1:    "G+1",
  G_2:    "G+2",
  G_3:    "G+3",
  G_4:    "G+4",
  G_PLUS: "G+5+",
});

const SortOption = Object.freeze({
  PRICE_LOW_TO_HIGH:      "PRICE_LOW_TO_HIGH",
  PRICE_HIGH_TO_LOW:      "PRICE_HIGH_TO_LOW",
  NEWEST_FIRST:           "NEWEST_FIRST",
  OLDEST_FIRST:           "OLDEST_FIRST",
  PRICE_SQFT_LOW_TO_HIGH: "PRICE_SQFT_LOW_TO_HIGH",
  PRICE_SQFT_HIGH_TO_LOW: "PRICE_SQFT_HIGH_TO_LOW",
});

const ViewMode = Object.freeze({
  GRID:  "GRID",
  TABLE: "TABLE",
});

const PropertyTab = Object.freeze({
  ALL:        "ALL",
  COMMERCIAL: "COMMERCIAL",
  APARTMENT:  "APARTMENT",
  PLOT:       "PLOT",
  VILLAS:     "VILLAS",
});

export {
  ListingType, AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus, BHKType,
  Amenity, PriceUnit, SortOption, ViewMode, PropertyTab,
  CommissionType, MaintenanceType, PreferredTenant,
  KhataType, ExtraRoom, StructureType,
};