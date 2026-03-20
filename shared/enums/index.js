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
  // ── New commercial asset types ──────────────────────────
  SHOWROOM:            "SHOWROOM",
  SHOP:                "SHOP",
  TECH_PARK:           "TECH_PARK",
  WAREHOUSE:           "WAREHOUSE",
  INDUSTRIAL_LAND:     "INDUSTRIAL_LAND",
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
  NEW:           "NEW",
  THREE_TO_FIVE: "THREE_TO_FIVE",
  FIVE_TO_TEN:   "FIVE_TO_TEN",
  TEN_TO_FIFTEEN:"TEN_TO_FIFTEEN",
  FIFTEEN_PLUS:  "FIFTEEN_PLUS",
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
  PLUG_AND_PLAY:  "PLUG_AND_PLAY",
  WARM_SHELL:     "WARM_SHELL",
  BARE_SHELL:     "BARE_SHELL",
  FITTED:         "FITTED",
  SEMI_FITTED:    "SEMI_FITTED",
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
  VACANT_LAND:        "VACANT_LAND",
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
  FIRE_FIGHTING:      "FIRE_FIGHTING",
  ACCESS_CONTROL:     "ACCESS_CONTROL",
  FOOD_COURT:         "FOOD_COURT",
  CAFETERIA:          "CAFETERIA",
  VISITOR_PARKING:    "VISITOR_PARKING",
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
  CAM_EXTRA:    "CAM_EXTRA",
  NEGOTIABLE:   "NEGOTIABLE",
  BY_LESSEE:    "BY_LESSEE",
  NA:           "NA",
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
  SERVER_ROOM:   "SERVER_ROOM",
  RECEPTION:     "RECEPTION",
  LOUNGE:        "LOUNGE",
  AHU_ROOM:      "AHU_ROOM",
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

// ── Buyer-specific enums ──────────────────────────────
const BuyerStatus = Object.freeze({
  IN_PROGRESS: "IN_PROGRESS",
  ACTIVE:      "ACTIVE",
  CANCELLED:   "CANCELLED",
});

const PriceUnitExtended = Object.freeze({
  THOUSANDS: "THOUSANDS",
  LAKHS:     "LAKHS",
  CRORES:    "CRORES",
});
const SortOptionExtended = Object.freeze({
  PRICE_LOW_TO_HIGH:      "PRICE_LOW_TO_HIGH",
  PRICE_HIGH_TO_LOW:      "PRICE_HIGH_TO_LOW",
  NEWEST_FIRST:           "NEWEST_FIRST",
  OLDEST_FIRST:           "OLDEST_FIRST",
  PRICE_SQFT_LOW_TO_HIGH: "PRICE_SQFT_LOW_TO_HIGH",
  PRICE_SQFT_HIGH_TO_LOW: "PRICE_SQFT_HIGH_TO_LOW",
});

// ── New commercial enums ──────────────────────────────
const BuildingGrade = Object.freeze({
  A_PLUS: "A_PLUS",
  A:      "A",
  B_PLUS: "B_PLUS",
  B:      "B",
  C:      "C",
});

const ParkType = Object.freeze({
  SEZ:         "SEZ",
  IT_PARK:     "IT_PARK",
  NON_SEZ_STP: "NON_SEZ_STP",
  STPI:        "STPI",
  BIOTECH:     "BIOTECH",
});

const WarehouseType = Object.freeze({
  PEB_SHED:      "PEB_SHED",
  RCC_STRUCTURE: "RCC_STRUCTURE",
  COLD_STORAGE:  "COLD_STORAGE",
  MULTI_LEVEL:   "MULTI_LEVEL",
  BUILT_TO_SUIT: "BUILT_TO_SUIT",
});

const FloorType = Object.freeze({
  TRIMIX:       "TRIMIX",
  CONCRETE:     "CONCRETE",
  EPOXY_COATED: "EPOXY_COATED",
  VDF:          "VDF",
  HARDENER:     "HARDENER",
});

const TruckAccess = Object.freeze({
  TWENTY_FT:  "TWENTY_FT",
  THIRTY_TWO_FT: "THIRTY_TWO_FT",
  FORTY_FT:   "FORTY_FT",
  MULTI_AXLE: "MULTI_AXLE",
  ALL_TYPES:  "ALL_TYPES",
});

const Zoning = Object.freeze({
  INDUSTRIAL:    "INDUSTRIAL",
  LOGISTICS:     "LOGISTICS",
  SEZ:           "SEZ",
  MIXED_USE:     "MIXED_USE",
  AGRI_LOGISTICS:"AGRI_LOGISTICS",
  MIDC_KIADB:    "MIDC_KIADB",
});

const LandType = Object.freeze({
  INDUSTRIAL_CONVERTED:     "INDUSTRIAL_CONVERTED",
  LOGISTICS:                "LOGISTICS",
  AGRICULTURAL_CONVERTED:   "AGRICULTURAL_CONVERTED",
  NA_CONVERTED:             "NA_CONVERTED",
  GOVT_ALLOTTED:            "GOVT_ALLOTTED",
});

const LandShape = Object.freeze({
  RECTANGULAR:  "RECTANGULAR",
  SQUARE:       "SQUARE",
  CORNER_PLOT:  "CORNER_PLOT",
  IRREGULAR:    "IRREGULAR",
  L_SHAPED:     "L_SHAPED",
});

const Topography = Object.freeze({
  FLAT:           "FLAT",
  SLIGHTLY_SLOPED:"SLIGHTLY_SLOPED",
  SLOPED:         "SLOPED",
  LEVELLED:       "LEVELLED",
  ROCKY:          "ROCKY",
});

const CompoundWall = Object.freeze({
  FULL:              "FULL",
  PARTIAL:           "PARTIAL",
  NONE:              "NONE",
  UNDER_CONSTRUCTION:"UNDER_CONSTRUCTION",
  FENCED:            "FENCED",
});

const GateType = Object.freeze({
  YES_SINGLE:        "YES_SINGLE",
  YES_DOUBLE:        "YES_DOUBLE",
  NO:                "NO",
  UNDER_CONSTRUCTION:"UNDER_CONSTRUCTION",
  AUTOMATED:         "AUTOMATED",
});

const RoadType = Object.freeze({
  NH:              "NH",
  SH:              "SH",
  INDUSTRIAL_ROAD: "INDUSTRIAL_ROAD",
  EIGHTY_FT:       "EIGHTY_FT",
  SIXTY_FT:        "SIXTY_FT",
});

const LeaseTenure = Object.freeze({
  // Office Space / Shop
  ELEVEN_MONTHS: "ELEVEN_MONTHS",
  ONE_YEAR:      "ONE_YEAR",
  TWO_YEARS:     "TWO_YEARS",
  THREE_YEARS:   "THREE_YEARS",
  FIVE_YEARS:    "FIVE_YEARS",
  // Tech Park / Warehouse
  NINE_YEARS:    "NINE_YEARS",
  FIFTEEN_YEARS: "FIFTEEN_YEARS",
  // Industrial Land
  TWENTY_YEARS:  "TWENTY_YEARS",
  THIRTY_YEARS:  "THIRTY_YEARS",
});

const BuyerSortOption = Object.freeze({
  NEWEST_FIRST:           "NEWEST_FIRST",
  OLDEST_FIRST:           "OLDEST_FIRST",
  PRICE_LOW_TO_HIGH:      "PRICE_LOW_TO_HIGH",
  PRICE_HIGH_TO_LOW:      "PRICE_HIGH_TO_LOW",
  PRICE_PAID_LOW_TO_HIGH: "PRICE_PAID_LOW_TO_HIGH",
  PRICE_PAID_HIGH_TO_LOW: "PRICE_PAID_HIGH_TO_LOW",
})

export {
  ListingType, AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus, BHKType,
  Amenity, PriceUnit, SortOption, ViewMode, PropertyTab,
  CommissionType, MaintenanceType, PreferredTenant,
  KhataType, ExtraRoom, StructureType, BuyerStatus, PriceUnitExtended,
  // New commercial enums
  BuildingGrade, ParkType, WarehouseType, FloorType, TruckAccess,
  Zoning, LandType, LandShape, Topography, CompoundWall, GateType,
  RoadType, LeaseTenure,
  SortOptionExtended,
  BuyerSortOption
};