// shared/constants/dropdown.js
// All dropdown option arrays — used by frontend selects AND
// served by backend /api/config/* endpoints. Never duplicate these.

import {
  AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus,
  BHKType, Amenity, PriceUnit, SortOption, ListingType,
  CommissionType, MaintenanceType, PreferredTenant,
  KhataType, ExtraRoom, StructureType, BuyerStatus, PriceUnitExtended,
  BuildingGrade, ParkType, WarehouseType, FloorType, TruckAccess,
  Zoning, LandType, LandShape, Topography, CompoundWall, GateType,
  RoadType, LeaseTenure,
} from "../enums/index.js";

const LISTING_TYPE_OPTIONS = [
  { value: ListingType.RESALE, label: "Resale" },
  { value: ListingType.RENTAL, label: "Rental" },
];

const ASSET_TYPE_OPTIONS = [
  { value: AssetType.APARTMENT,           label: "Apartment" },
  { value: AssetType.PLOT,                label: "Plot" },
  { value: AssetType.VILLA,               label: "Villa" },
  { value: AssetType.INDEPENDENT_HOUSE,   label: "Independent House" },
  { value: AssetType.COMMERCIAL_SPACE,    label: "Commercial Space" },
  { value: AssetType.ROW_HOUSE,           label: "Row House" },
  { value: AssetType.COMMERCIAL_PROPERTY, label: "Commercial Property" },
  { value: AssetType.VILAMENT,            label: "Villament" },
  { value: AssetType.OFFICE_SPACE,        label: "Office Space" },
  { value: AssetType.RETAIL_SPACE,        label: "Retail Space" },
  // ── New commercial types ──────────────────────────────────
  { value: AssetType.SHOWROOM,            label: "Showroom" },
  { value: AssetType.SHOP,                label: "Shop" },
  { value: AssetType.TECH_PARK,           label: "Tech Park" },
  { value: AssetType.WAREHOUSE,           label: "Warehouse" },
  { value: AssetType.INDUSTRIAL_LAND,     label: "Industrial Land" },
];

const DOOR_FACING_OPTIONS = [
  { value: DoorFacing.NORTH,      label: "North" },
  { value: DoorFacing.SOUTH,      label: "South" },
  { value: DoorFacing.EAST,       label: "East" },
  { value: DoorFacing.WEST,       label: "West" },
  { value: DoorFacing.NORTH_EAST, label: "North-East" },
  { value: DoorFacing.NORTH_WEST, label: "North-West" },
  { value: DoorFacing.SOUTH_EAST, label: "South-East" },
  { value: DoorFacing.SOUTH_WEST, label: "South-West" },
];

const AGE_OF_BUILDING_OPTIONS = [
  { value: AgeOfBuilding.NEW,            label: "New (0–3 yrs)" },
  { value: AgeOfBuilding.THREE_TO_FIVE,  label: "3–5 Years" },
  { value: AgeOfBuilding.FIVE_TO_TEN,    label: "5–10 Years" },
  { value: AgeOfBuilding.TEN_TO_FIFTEEN, label: "10–15 Years" },
  { value: AgeOfBuilding.FIFTEEN_PLUS,   label: "15+ Years" },
];

const FLOOR_RANGE_OPTIONS = [
  { value: FloorRange.GROUND, label: "Ground Floor" },
  { value: FloorRange.LOWER,  label: "Lower Floor (1–5)" },
  { value: FloorRange.MID,    label: "Mid Floor (6–10)" },
  { value: FloorRange.HIGH,   label: "High Floor (10+)" },
  { value: FloorRange.ULTRA,  label: "Ultra High (20+)" },
];

const FURNISHING_OPTIONS = [
  { value: FurnishingStatus.FURNISHED,      label: "Fully Furnished" },
  { value: FurnishingStatus.SEMI_FURNISHED, label: "Semi Furnished" },
  { value: FurnishingStatus.UNFURNISHED,    label: "Unfurnished" },
  { value: FurnishingStatus.PLUG_AND_PLAY,  label: "Plug & Play" },
  { value: FurnishingStatus.WARM_SHELL,     label: "Warm Shell" },
];

const FURNISHING_OFFICE_OPTIONS = [
  { value: FurnishingStatus.FURNISHED,      label: "Fully Furnished" },
  { value: FurnishingStatus.PLUG_AND_PLAY,  label: "Plug & Play" },
  { value: FurnishingStatus.WARM_SHELL,     label: "Warm Shell" },
  { value: FurnishingStatus.BARE_SHELL,     label: "Bare Shell" },
  { value: FurnishingStatus.SEMI_FURNISHED, label: "Semi Furnished" },
];

const FURNISHING_RETAIL_OPTIONS = [
  { value: FurnishingStatus.BARE_SHELL,     label: "Bare Shell" },
  { value: FurnishingStatus.WARM_SHELL,     label: "Warm Shell" },
  { value: FurnishingStatus.FITTED,         label: "Fitted" },
  { value: FurnishingStatus.SEMI_FITTED,    label: "Semi-Fitted" },
  { value: FurnishingStatus.PLUG_AND_PLAY,  label: "Plug & Play" },
];

const FURNISHING_SHOP_OPTIONS = [
  { value: FurnishingStatus.UNFURNISHED,    label: "Unfurnished" },
  { value: FurnishingStatus.BARE_SHELL,     label: "Bare Shell" },
  { value: FurnishingStatus.FITTED,         label: "Fitted" },
  { value: FurnishingStatus.SEMI_FITTED,    label: "Semi-Fitted" },
  { value: FurnishingStatus.WARM_SHELL,     label: "Warm Shell" },
];

const PARKING_OPTIONS = [
  { value: ParkingType.NONE,       label: "No Parking" },
  { value: ParkingType.ONE,        label: "1 Car Park" },
  { value: ParkingType.TWO,        label: "2 Car Parks" },
  { value: ParkingType.THREE_PLUS, label: "3+ Car Parks" },
  { value: ParkingType.OPEN,       label: "Open Parking" },
  { value: ParkingType.COVERED,    label: "Covered Parking" },
];

const POSSESSION_OPTIONS = [
  { value: PossessionStatus.READY_TO_MOVE,      label: "Ready to Move" },
  { value: PossessionStatus.UNDER_CONSTRUCTION, label: "Under Construction" },
  { value: PossessionStatus.NEW_LAUNCH,         label: "New Launch" },
  { value: PossessionStatus.RESALE_READY,       label: "Resale Ready" },
  { value: PossessionStatus.VACANT_LAND,        label: "Vacant Land" },
];

// Possession without Vacant Land — for built structures (Shop, Showroom, Office, Tech Park, Warehouse)
const POSSESSION_BUILT_OPTIONS = POSSESSION_OPTIONS.filter(
  o => o.value !== PossessionStatus.VACANT_LAND
);

// Possession for Industrial Land — Vacant Land only relevant
const POSSESSION_LAND_OPTIONS = [
  { value: PossessionStatus.VACANT_LAND,        label: "Vacant Land" },
  { value: PossessionStatus.UNDER_CONSTRUCTION, label: "Under Construction" },
  { value: PossessionStatus.READY_TO_MOVE,      label: "Ready to Move" },
];

const BHK_OPTIONS = [
  { value: String(BHKType.STUDIO),    label: "Studio" },
  { value: String(BHKType.ONE_BHK),   label: "1 BHK" },
  { value: String(BHKType.TWO_BHK),   label: "2 BHK" },
  { value: String(BHKType.THREE_BHK), label: "3 BHK" },
  { value: String(BHKType.FOUR_BHK),  label: "4 BHK" },
  { value: String(BHKType.FIVE_BHK),  label: "5 BHK" },
];

const AMENITY_OPTIONS = [
  { value: Amenity.SWIMMING_POOL,      label: "Swimming Pool" },
  { value: Amenity.LIFTS,              label: "Lifts" },
  { value: Amenity.CCTV_SURVEILLANCE,  label: "CCTV Surveillance" },
  { value: Amenity.SECURITY,           label: "Security" },
  { value: Amenity.POWER_BACKUP,       label: "Power Backup" },
  { value: Amenity.WATER_STORAGE,      label: "Water Storage" },
  { value: Amenity.GYM,                label: "Gym" },
  { value: Amenity.GARDEN_LANDSCAPING, label: "Garden / Landscaping" },
  { value: Amenity.COMMUNITY_CENTER,   label: "Community Center" },
  { value: Amenity.CONCIERGE_SERVICE,  label: "Concierge Service" },
  { value: Amenity.PLAY_AREA,          label: "Play Area" },
  { value: Amenity.FIRE_FIGHTING,      label: "Fire Fighting System" },
  { value: Amenity.ACCESS_CONTROL,     label: "Access Control" },
  { value: Amenity.FOOD_COURT,         label: "Food Court" },
  { value: Amenity.CAFETERIA,          label: "Cafeteria" },
  { value: Amenity.VISITOR_PARKING,    label: "Visitor Parking" },
];

const COMMISSION_TYPE_OPTIONS = [
  { value: CommissionType.COMMISSION_SHARING, label: "Commission Sharing" },
  { value: CommissionType.OWNER_PAYS,         label: "Owner Pays" },
  { value: CommissionType.TENANT_PAYS,        label: "Tenant Pays" },
];

const MAINTENANCE_OPTIONS = [
  { value: MaintenanceType.INCLUDED,     label: "Included" },
  { value: MaintenanceType.NOT_INCLUDED, label: "Not Included" },
  { value: MaintenanceType.CAM_EXTRA,    label: "CAM Extra" },
  { value: MaintenanceType.NEGOTIABLE,   label: "Negotiable" },
  { value: MaintenanceType.BY_LESSEE,    label: "By Lessee" },
  { value: MaintenanceType.NA,           label: "N/A" },
];

const PREFERRED_TENANT_OPTIONS = [
  { value: PreferredTenant.FAMILY,   label: "Family" },
  { value: PreferredTenant.BACHELOR, label: "Bachelor" },
  { value: PreferredTenant.COMPANY,  label: "Company" },
  { value: PreferredTenant.ANY,      label: "Any" },
];

const KHATA_OPTIONS = [
  { value: KhataType.A, label: "A Khata" },
  { value: KhataType.B, label: "B Khata" },
];

const EXTRA_ROOM_OPTIONS = [
  { value: ExtraRoom.STUDY_ROOM,   label: "Study Room" },
  { value: ExtraRoom.SERVANT_ROOM, label: "Servant Room" },
  { value: ExtraRoom.POOJA_ROOM,   label: "Pooja Room" },
  { value: ExtraRoom.STORE_ROOM,   label: "Store Room" },
  { value: ExtraRoom.SERVER_ROOM,  label: "Server Room" },
  { value: ExtraRoom.RECEPTION,    label: "Reception" },
  { value: ExtraRoom.LOUNGE,       label: "Lounge" },
  { value: ExtraRoom.AHU_ROOM,     label: "AHU Room" },
];

const STRUCTURE_OPTIONS = [
  { value: StructureType.G,      label: "G" },
  { value: StructureType.G_1,    label: "G+1" },
  { value: StructureType.G_2,    label: "G+2" },
  { value: StructureType.G_3,    label: "G+3" },
  { value: StructureType.G_4,    label: "G+4" },
  { value: StructureType.G_PLUS, label: "G+5+" },
];

// ── New commercial dropdowns ──────────────────────────────────────────────────

const BUILDING_GRADE_OPTIONS = [
  { value: BuildingGrade.A_PLUS, label: "Grade A+" },
  { value: BuildingGrade.A,      label: "Grade A" },
  { value: BuildingGrade.B_PLUS, label: "Grade B+" },
  { value: BuildingGrade.B,      label: "Grade B" },
  { value: BuildingGrade.C,      label: "Grade C" },
];

const PARK_TYPE_OPTIONS = [
  { value: ParkType.SEZ,         label: "SEZ" },
  { value: ParkType.IT_PARK,     label: "IT Park" },
  { value: ParkType.NON_SEZ_STP, label: "Non-SEZ / STP" },
  { value: ParkType.STPI,        label: "STPI" },
  { value: ParkType.BIOTECH,     label: "Biotech Park" },
];

const WAREHOUSE_TYPE_OPTIONS = [
  { value: WarehouseType.PEB_SHED,      label: "PEB Shed" },
  { value: WarehouseType.RCC_STRUCTURE, label: "RCC Structure" },
  { value: WarehouseType.COLD_STORAGE,  label: "Cold Storage" },
  { value: WarehouseType.MULTI_LEVEL,   label: "Multi-Level" },
  { value: WarehouseType.BUILT_TO_SUIT, label: "Built-to-Suit" },
];

const FLOOR_TYPE_OPTIONS = [
  { value: FloorType.TRIMIX,       label: "Trimix" },
  { value: FloorType.CONCRETE,     label: "Concrete" },
  { value: FloorType.EPOXY_COATED, label: "Epoxy Coated" },
  { value: FloorType.VDF,          label: "VDF" },
  { value: FloorType.HARDENER,     label: "Hardener" },
];

const TRUCK_ACCESS_OPTIONS = [
  { value: TruckAccess.TWENTY_FT,     label: "20 ft" },
  { value: TruckAccess.THIRTY_TWO_FT, label: "32 ft" },
  { value: TruckAccess.FORTY_FT,      label: "40 ft Container" },
  { value: TruckAccess.MULTI_AXLE,    label: "Multi-Axle" },
  { value: TruckAccess.ALL_TYPES,     label: "All Types" },
];

const ZONING_WAREHOUSE_OPTIONS = [
  { value: Zoning.INDUSTRIAL,     label: "Industrial" },
  { value: Zoning.LOGISTICS,      label: "Logistics" },
  { value: Zoning.SEZ,            label: "SEZ" },
  { value: Zoning.MIXED_USE,      label: "Mixed Use" },
  { value: Zoning.AGRI_LOGISTICS, label: "Agri-Logistics" },
];

const ZONING_LAND_OPTIONS = [
  { value: Zoning.INDUSTRIAL,  label: "Industrial" },
  { value: Zoning.MIXED_USE,   label: "Mixed Use" },
  { value: Zoning.LOGISTICS,   label: "Logistics" },
  { value: Zoning.SEZ,         label: "SEZ" },
  { value: Zoning.MIDC_KIADB,  label: "MIDC / KIADB Allotted" },
];

const LAND_TYPE_OPTIONS = [
  { value: LandType.INDUSTRIAL_CONVERTED,   label: "Industrial Converted" },
  { value: LandType.LOGISTICS,              label: "Logistics" },
  { value: LandType.AGRICULTURAL_CONVERTED, label: "Agricultural Converted" },
  { value: LandType.NA_CONVERTED,           label: "NA Converted" },
  { value: LandType.GOVT_ALLOTTED,          label: "Govt. Allotted" },
];

const LAND_SHAPE_OPTIONS = [
  { value: LandShape.RECTANGULAR, label: "Rectangular" },
  { value: LandShape.SQUARE,      label: "Square" },
  { value: LandShape.CORNER_PLOT, label: "Corner Plot" },
  { value: LandShape.IRREGULAR,   label: "Irregular" },
  { value: LandShape.L_SHAPED,    label: "L-Shaped" },
];

const TOPOGRAPHY_OPTIONS = [
  { value: Topography.FLAT,           label: "Flat" },
  { value: Topography.SLIGHTLY_SLOPED,label: "Slightly Sloped" },
  { value: Topography.SLOPED,         label: "Sloped" },
  { value: Topography.LEVELLED,       label: "Levelled" },
  { value: Topography.ROCKY,          label: "Rocky" },
];

const COMPOUND_WALL_OPTIONS = [
  { value: CompoundWall.FULL,               label: "Full" },
  { value: CompoundWall.PARTIAL,            label: "Partial" },
  { value: CompoundWall.NONE,               label: "None" },
  { value: CompoundWall.UNDER_CONSTRUCTION, label: "Under Construction" },
  { value: CompoundWall.FENCED,             label: "Fenced" },
];

const GATE_TYPE_OPTIONS = [
  { value: GateType.YES_SINGLE,        label: "Yes — Single" },
  { value: GateType.YES_DOUBLE,        label: "Yes — Double" },
  { value: GateType.NO,                label: "No" },
  { value: GateType.UNDER_CONSTRUCTION,label: "Under Construction" },
  { value: GateType.AUTOMATED,         label: "Automated" },
];

const ROAD_TYPE_OPTIONS = [
  { value: RoadType.NH,              label: "National Highway (NH)" },
  { value: RoadType.SH,              label: "State Highway (SH)" },
  { value: RoadType.INDUSTRIAL_ROAD, label: "Industrial Road" },
  { value: RoadType.EIGHTY_FT,       label: "80 ft Road" },
  { value: RoadType.SIXTY_FT,        label: "60 ft Road" },
];

const LEASE_TENURE_OFFICE_SHOP_OPTIONS = [
  { value: LeaseTenure.ELEVEN_MONTHS, label: "11 Months" },
  { value: LeaseTenure.ONE_YEAR,      label: "1 Year" },
  { value: LeaseTenure.TWO_YEARS,     label: "2 Years" },
  { value: LeaseTenure.THREE_YEARS,   label: "3 Years" },
  { value: LeaseTenure.FIVE_YEARS,    label: "5 Years" },
];

const LEASE_TENURE_TECH_WAREHOUSE_OPTIONS = [
  { value: LeaseTenure.ONE_YEAR,      label: "1 Year" },
  { value: LeaseTenure.THREE_YEARS,   label: "3 Years" },
  { value: LeaseTenure.FIVE_YEARS,    label: "5 Years" },
  { value: LeaseTenure.NINE_YEARS,    label: "9 Years" },
  { value: LeaseTenure.FIFTEEN_YEARS, label: "15 Years" },
];

const LEASE_TENURE_LAND_OPTIONS = [
  { value: LeaseTenure.FIVE_YEARS,    label: "5 Years" },
  { value: LeaseTenure.NINE_YEARS,    label: "9 Years" },
  { value: LeaseTenure.FIFTEEN_YEARS, label: "15 Years" },
  { value: LeaseTenure.TWENTY_YEARS,  label: "20 Years" },
  { value: LeaseTenure.THIRTY_YEARS,  label: "30 Years" },
];

const IDEAL_FOR_OPTIONS = [
  { value: "FASHION",      label: "Fashion" },
  { value: "ELECTRONICS",  label: "Electronics" },
  { value: "F_AND_B",      label: "F&B" },
  { value: "BANK",         label: "Bank" },
  { value: "CLINIC",       label: "Clinic" },
  { value: "SALON",        label: "Salon" },
  { value: "PHARMACY",     label: "Pharmacy" },
];

const UTILITIES_NEARBY_OPTIONS = [
  { value: "POWER",     label: "Power" },
  { value: "WATER",     label: "Water" },
  { value: "GAS",       label: "Gas" },
  { value: "DRAINAGE",  label: "Drainage" },
  { value: "TELECOM",   label: "Telecom" },
];

const BUYER_STATUS_OPTIONS = [
  { value: BuyerStatus.IN_PROGRESS, label: "In Progress" },
  { value: BuyerStatus.ACTIVE,      label: "Active" },
  { value: BuyerStatus.CANCELLED,   label: "Cancelled" },
];

const PRICE_UNIT_OPTIONS = [
  { value: PriceUnit.LAKHS,  label: "Lakhs" },
  { value: PriceUnit.CRORES, label: "Crores" },
];

const PRICE_UNIT_EXTENDED_OPTIONS = [
  { value: PriceUnitExtended.THOUSANDS, label: "Thousands" },
  { value: PriceUnitExtended.LAKHS,     label: "Lakhs" },
  { value: PriceUnitExtended.CRORES,    label: "Crores" },
];

export {
  LISTING_TYPE_OPTIONS,
  ASSET_TYPE_OPTIONS,
  DOOR_FACING_OPTIONS,
  AGE_OF_BUILDING_OPTIONS,
  FLOOR_RANGE_OPTIONS,
  FURNISHING_OPTIONS,
  FURNISHING_OFFICE_OPTIONS,
  FURNISHING_RETAIL_OPTIONS,
  FURNISHING_SHOP_OPTIONS,
  PARKING_OPTIONS,
  POSSESSION_OPTIONS,
  POSSESSION_BUILT_OPTIONS,
  POSSESSION_LAND_OPTIONS,
  BHK_OPTIONS,
  AMENITY_OPTIONS,
  COMMISSION_TYPE_OPTIONS,
  MAINTENANCE_OPTIONS,
  PREFERRED_TENANT_OPTIONS,
  KHATA_OPTIONS,
  EXTRA_ROOM_OPTIONS,
  STRUCTURE_OPTIONS,
  BUYER_STATUS_OPTIONS,
  PRICE_UNIT_OPTIONS,
  PRICE_UNIT_EXTENDED_OPTIONS,
  // New commercial dropdowns
  BUILDING_GRADE_OPTIONS,
  PARK_TYPE_OPTIONS,
  WAREHOUSE_TYPE_OPTIONS,
  FLOOR_TYPE_OPTIONS,
  TRUCK_ACCESS_OPTIONS,
  ZONING_WAREHOUSE_OPTIONS,
  ZONING_LAND_OPTIONS,
  LAND_TYPE_OPTIONS,
  LAND_SHAPE_OPTIONS,
  TOPOGRAPHY_OPTIONS,
  COMPOUND_WALL_OPTIONS,
  GATE_TYPE_OPTIONS,
  ROAD_TYPE_OPTIONS,
  LEASE_TENURE_OFFICE_SHOP_OPTIONS,
  LEASE_TENURE_TECH_WAREHOUSE_OPTIONS,
  LEASE_TENURE_LAND_OPTIONS,
  IDEAL_FOR_OPTIONS,
  UTILITIES_NEARBY_OPTIONS,
};