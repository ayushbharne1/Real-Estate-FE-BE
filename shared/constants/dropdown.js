// shared/constants/dropdowns.js
// All dropdown option arrays — used by frontend selects AND
// served by backend /api/config/* endpoints. Never duplicate these.

import {
  AssetType, DoorFacing, AgeOfBuilding, FloorRange,
  FurnishingStatus, ParkingType, PossessionStatus,
  BHKType, Amenity, PriceUnit, SortOption, ListingType,
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
  { value: AssetType.VILAMENT,            label: "Vilament" },
  { value: AssetType.OFFICE_SPACE,        label: "Office Space" },
  { value: AssetType.RETAIL_SPACE,        label: "Retail Space" },
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
  { value: AgeOfBuilding.NEW,         label: "New / Just Built" },
  { value: AgeOfBuilding.ONE_TO_FIVE, label: "1–5 Years" },
  { value: AgeOfBuilding.FIVE_TO_TEN, label: "5–10 Years" },
  { value: AgeOfBuilding.TEN_PLUS,    label: "10+ Years" },
];

const FLOOR_RANGE_OPTIONS = [
  { value: FloorRange.GROUND, label: "Ground Floor" },
  { value: FloorRange.LOWER,  label: "Lower Floor (1–5)" },
  { value: FloorRange.MID,    label: "Mid Floor (6–15)" },
  { value: FloorRange.HIGH,   label: "High Floor (16–25)" },
  { value: FloorRange.ULTRA,  label: "Ultra High (25+)" },
];

const FURNISHING_OPTIONS = [
  { value: FurnishingStatus.FURNISHED,      label: "Furnished" },
  { value: FurnishingStatus.SEMI_FURNISHED, label: "Semi-Furnished" },
  { value: FurnishingStatus.UNFURNISHED,    label: "Unfurnished" },
];

const PARKING_OPTIONS = [
  { value: ParkingType.NONE,       label: "No Parking" },
  { value: ParkingType.ONE,        label: "1 Parking" },
  { value: ParkingType.TWO,        label: "2 Parking" },
  { value: ParkingType.THREE_PLUS, label: "3+ Parking" },
  { value: ParkingType.OPEN,       label: "Open Parking" },
  { value: ParkingType.COVERED,    label: "Covered Parking" },
];

const POSSESSION_OPTIONS = [
  { value: PossessionStatus.READY_TO_MOVE,      label: "Ready to Move" },
  { value: PossessionStatus.UNDER_CONSTRUCTION, label: "Under Construction" },
  { value: PossessionStatus.NEW_LAUNCH,         label: "New Launch" },
  { value: PossessionStatus.RESALE_READY,       label: "Resale Ready" },
];

const BHK_OPTIONS = [
  { value: BHKType.STUDIO,    label: "Studio" },
  { value: BHKType.ONE_BHK,   label: "1 BHK" },
  { value: BHKType.TWO_BHK,   label: "2 BHK" },
  { value: BHKType.THREE_BHK, label: "3 BHK" },
  { value: BHKType.FOUR_BHK,  label: "4 BHK" },
  { value: BHKType.FIVE_BHK,  label: "5 BHK" },
];

// Dashboard filter chips (no studio)
const BHK_FILTER_OPTIONS = [
  { value: BHKType.ONE_BHK,   label: "1BHK" },
  { value: BHKType.TWO_BHK,   label: "2BHK" },
  { value: BHKType.THREE_BHK, label: "3BHK" },
  { value: BHKType.FOUR_BHK,  label: "4BHK" },
  { value: BHKType.FIVE_BHK,  label: "5BHK" },
];

const AMENITY_OPTIONS = [
  { value: Amenity.SWIMMING_POOL,      label: "Swimming Pool",        icon: "🏊" },
  { value: Amenity.LIFTS,              label: "Lifts",                icon: "🛗" },
  { value: Amenity.CCTV_SURVEILLANCE,  label: "CCTV Surveillance",    icon: "📹" },
  { value: Amenity.SECURITY,           label: "Security",             icon: "🔒" },
  { value: Amenity.POWER_BACKUP,       label: "Power Backup",         icon: "⚡" },
  { value: Amenity.WATER_STORAGE,      label: "Water Storage",        icon: "💧" },
  { value: Amenity.GYM,                label: "Gym",                  icon: "🏋️" },
  { value: Amenity.GARDEN_LANDSCAPING, label: "Garden / Landscaping", icon: "🌿" },
  { value: Amenity.COMMUNITY_CENTER,   label: "Community Center",     icon: "🏛️" },
  { value: Amenity.CONCIERGE_SERVICE,  label: "Concierge Service",    icon: "🛎️" },
  { value: Amenity.PLAY_AREA,          label: "Play Area",            icon: "🛝" },
];

const PRICE_UNIT_OPTIONS = [
  { value: PriceUnit.LAKHS,  label: "Lakhs" },
  { value: PriceUnit.CRORES, label: "Crores" },
];

const SORT_OPTIONS = [
  { value: SortOption.PRICE_LOW_TO_HIGH,      label: "Price: Low to High" },
  { value: SortOption.PRICE_HIGH_TO_LOW,      label: "Price: High to Low" },
  { value: SortOption.NEWEST_FIRST,           label: "Newest First" },
  { value: SortOption.OLDEST_FIRST,           label: "Oldest First" },
  { value: SortOption.PRICE_SQFT_LOW_TO_HIGH, label: "Price/Sqft: Low to High" },
  { value: SortOption.PRICE_SQFT_HIGH_TO_LOW, label: "Price/Sqft: High to Low" },
];

const ITEMS_PER_PAGE_OPTIONS = [
  { value: 10,  label: "10 / page" },
  { value: 20,  label: "20 / page" },
  { value: 50,  label: "50 / page" },
];

export {
  LISTING_TYPE_OPTIONS, ASSET_TYPE_OPTIONS, DOOR_FACING_OPTIONS,
  AGE_OF_BUILDING_OPTIONS, FLOOR_RANGE_OPTIONS, FURNISHING_OPTIONS,
  PARKING_OPTIONS, POSSESSION_OPTIONS, BHK_OPTIONS, BHK_FILTER_OPTIONS,
  AMENITY_OPTIONS, PRICE_UNIT_OPTIONS, SORT_OPTIONS, ITEMS_PER_PAGE_OPTIONS,
};