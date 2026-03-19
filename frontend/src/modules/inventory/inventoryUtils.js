// src/modules/inventory/inventoryUtils.js

import * as Yup from 'yup'
import {
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
  BHK_OPTIONS,
  AMENITY_OPTIONS,
  COMMISSION_TYPE_OPTIONS,
  MAINTENANCE_OPTIONS,
  PREFERRED_TENANT_OPTIONS,
  KHATA_OPTIONS,
  EXTRA_ROOM_OPTIONS,
  STRUCTURE_OPTIONS,
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
  FURNISHING_OFFICE_OPTIONS as FURNISHING_TECH_OPTIONS,
} from 'shared/constants/dropdown.js'
import { AssetType, ListingType } from 'shared/enums/index.js'

// ─── Asset type options filtered by listing type ──────────────────────────────

// All commercial types support both Resale and Rental
const COMMERCIAL_ASSET_VALUES = new Set([
  AssetType.OFFICE_SPACE,
  AssetType.RETAIL_SPACE,
  AssetType.SHOWROOM,
  AssetType.SHOP,
  AssetType.TECH_PARK,
  AssetType.WAREHOUSE,
  AssetType.INDUSTRIAL_LAND,
])

// Residential types that support Rental
const RESIDENTIAL_RENTAL_VALUES = new Set([AssetType.APARTMENT, AssetType.VILLA])

const RENTAL_ASSET_VALUES = new Set([
  ...RESIDENTIAL_RENTAL_VALUES,
  ...COMMERCIAL_ASSET_VALUES,
])

export const RESALE_ASSET_OPTIONS = ASSET_TYPE_OPTIONS

export const RENTAL_ASSET_OPTIONS = ASSET_TYPE_OPTIONS.filter(o =>
  RENTAL_ASSET_VALUES.has(o.value)
)

export function getAssetTypeOptions(listingType) {
  return listingType === ListingType.RENTAL ? RENTAL_ASSET_OPTIONS : RESALE_ASSET_OPTIONS
}

export const AMENITIES_LIST = AMENITY_OPTIONS

export const isRentalLocked = (listingType, assetType) =>
  listingType === ListingType.RENTAL && !RENTAL_ASSET_VALUES.has(assetType)

// ─── field descriptor factories ───────────────────────────────────────────────

const APT_TYPE_OPTIONS = [
  { value: 'SIMPLEX',    label: 'Simplex' },
  { value: 'DUPLEX',     label: 'Duplex' },
  { value: 'TRIPLEX',    label: 'Triplex' },
  { value: 'PENTHOUSE',  label: 'Penthouse' },
]

const TOTAL_FLOORS_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: String(i + 1), label: String(i + 1),
}))

const BALCONY_FACING_OPTIONS = DOOR_FACING_OPTIONS

const YES_NO_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No',  label: 'No' },
]

const F = {
  text:        (label, required = false)              => ({ label, required, type: 'text' }),
  number:      (label, suffix = '', required = false) => ({ label, required, type: 'number', suffix }),
  dropdown:    (label, options, required = false)     => ({ label, required, type: 'dropdown', options }),
  yesno:       (label)                                => ({ label, required: false, type: 'yesno' }),
  price:       (label, required = true)               => ({ label, required, type: 'price' }),
  config:      ()                                     => ({ label: 'Configuration (BHK + Bath + Balcony)', required: true, type: 'config' }),
  amenities:   ()                                     => ({ label: 'Amenities', required: false, type: 'amenities' }),
  multiselect: (label, options, required = false)     => ({ label, required, type: 'multiselect', options }),
}

// ─── Shared field descriptors ─────────────────────────────────────────────────

const S = {
  // Residential
  aptType:      F.dropdown('Apartment Type', APT_TYPE_OPTIONS, true),
  facing:       F.dropdown('Door Facing', DOOR_FACING_OPTIONS),
  age:          F.dropdown('Age of Building', AGE_OF_BUILDING_OPTIONS),
  floorNo:      F.dropdown('Floor Number', FLOOR_RANGE_OPTIONS),
  totalFloors:  F.dropdown('Total Floors', TOTAL_FLOORS_OPTIONS),
  structure:    F.dropdown('Structure', STRUCTURE_OPTIONS),
  config:       F.config(),
  furnishing:   F.dropdown('Furnishing', FURNISHING_OPTIONS, true),
  furnOffice:   F.dropdown('Furnishing', FURNISHING_OFFICE_OPTIONS),
  furnRetail:   F.dropdown('Furnishing', FURNISHING_RETAIL_OPTIONS),
  furnShop:     F.dropdown('Furnishing', FURNISHING_SHOP_OPTIONS),
  sbua:         F.number('SBUA', 'sq.ft', true),
  plotArea:     F.number('Plot Area', 'sq.ft', true),
  uds:          F.number('UDS (Undivided Spaces)', 'sq.ft'),
  priceSqft:    F.number('Price per Sqft', '₹'),
  askPrice:     F.price('Ask Price'),
  rent:         F.price('Rent per Month'),
  deposit:      F.price('Deposit', false),
  parking:      F.dropdown('Parking', PARKING_OPTIONS),
  bKhata:       F.dropdown('Building Khata', YES_NO_OPTIONS),
  lKhata:       F.dropdown('Land Khata', YES_NO_OPTIONS),
  eKhata:       F.yesno('E-Khata'),
  cornerUnit:   F.yesno('Corner Unit'),
  biappa:       F.yesno('Bioppa Approved Khata'),
  exclusive:    F.yesno('Exclusive'),
  extraRooms:   F.multiselect('Extra Rooms', EXTRA_ROOM_OPTIONS),
  balconyFacing:F.dropdown('Balcony Facing', BALCONY_FACING_OPTIONS),
  seats:        F.number('Workstations', '', false),
  cabins:       F.number('Cabins', '', false),
  meetingRooms: F.number('Meeting Rooms', '', false),
  boardRoom:    F.number('Board Room', '', false),
  totalRooms:   F.number('Total Rooms'),
  waterSupply:  F.text('Water Supply'),
  prefTenants:  F.dropdown('Preferred Tenants', PREFERRED_TENANT_OPTIONS, true),
  maintenance:  F.dropdown('Maintenance', MAINTENANCE_OPTIONS),
  commission:   F.dropdown('Commission Type', COMMISSION_TYPE_OPTIONS, true),
  petAllowed:   F.yesno('Pet Allowed'),
  nonVeg:       F.yesno('Non-Veg Allowed'),
  amenities:    F.amenities(),

  // Commercial — Office
  buildingGrade:F.dropdown('Building Grade', BUILDING_GRADE_OPTIONS),

  // Commercial — Tech Park
  tower:        F.text('Tower / Block'),
  parkType:     F.dropdown('Park Type', PARK_TYPE_OPTIONS),

  // Commercial — Showroom / Shop
  frontage:     F.number('Frontage', 'ft'),
  idealFor:     F.multiselect('Ideal For', IDEAL_FOR_OPTIONS),

  // Commercial — Warehouse
  warehouseType:F.dropdown('Warehouse Type', WAREHOUSE_TYPE_OPTIONS),
  landArea:     F.number('Land Area', 'acres'),
  floorType:    F.dropdown('Floor Type', FLOOR_TYPE_OPTIONS),
  floorLoading: F.number('Floor Loading', 'tons/sq.m'),
  docks:        F.number('Docks', ''),
  dockLevelers: F.number('Dock Levelers', ''),
  truckAccess:  F.dropdown('Truck Access', TRUCK_ACCESS_OPTIONS),
  powerLoad:    F.number('Power Load', 'kW'),
  officeBlock:  F.number('Office Block', 'sq.ft'),
  zoningWh:     F.dropdown('Zoning', ZONING_WAREHOUSE_OPTIONS),

  // Commercial — Industrial Land
  landType:     F.dropdown('Land Type', LAND_TYPE_OPTIONS),
  depth:        F.number('Depth', 'ft'),
  shape:        F.dropdown('Shape', LAND_SHAPE_OPTIONS),
  topography:   F.dropdown('Topography', TOPOGRAPHY_OPTIONS),
  compoundWall: F.dropdown('Compound Wall', COMPOUND_WALL_OPTIONS),
  gate:         F.dropdown('Gate', GATE_TYPE_OPTIONS),
  zoningLand:   F.dropdown('Zoning', ZONING_LAND_OPTIONS),
  fsiFar:       F.text('FSI / FAR'),
  roadType:     F.dropdown('Road Type', ROAD_TYPE_OPTIONS),
  utilities:    F.multiselect('Utilities Nearby', UTILITIES_NEARBY_OPTIONS),
  pricePerAcre: F.number('Price per Acre', '₹'),
  groundRent:   F.price('Ground Rent / Month'),

  // Rental lease tenures
  leaseTenureOfficeShop:     F.dropdown('Lease Tenure', LEASE_TENURE_OFFICE_SHOP_OPTIONS),
  leaseTenureTechWarehouse:  F.dropdown('Lease Tenure', LEASE_TENURE_TECH_WAREHOUSE_OPTIONS),
  leaseTenureLand:           F.dropdown('Lease Tenure', LEASE_TENURE_LAND_OPTIONS),

  // Parking as number (commercial)
  parkingNum:   F.number('Parking', 'slots'),
}

// ─── RESALE configs ───────────────────────────────────────────────────────────

const RESALE = {
  [AssetType.APARTMENT]: {
    step2: { aptType: S.aptType, facing: S.facing, age: S.age, floorNo: S.floorNo, config: S.config, furnishing: S.furnishing, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { bKhata: S.bKhata, lKhata: S.lKhata, parking: S.parking, eKhata: S.eKhata, extraRooms: S.extraRooms, amenities: S.amenities },
  },
  [AssetType.VILLA]: {
    step2: { facing: S.facing, age: S.age, structure: S.structure, config: S.config, furnishing: S.furnishing, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { parking: S.parking, amenities: S.amenities },
  },
  [AssetType.PLOT]: {
    step2: { facing: S.facing, plotArea: S.plotArea, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: {},
  },
  [AssetType.INDEPENDENT_HOUSE]: {
    step2: { facing: S.facing, age: S.age, structure: S.structure, config: S.config, furnishing: S.furnishing, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { parking: S.parking, amenities: S.amenities },
  },
  [AssetType.ROW_HOUSE]: {
    step2: { aptType: S.aptType, facing: S.facing, age: S.age, balconyFacing: S.balconyFacing, structure: S.structure, floorNo: S.floorNo, config: S.config, furnishing: S.furnishing, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { bKhata: S.bKhata, cornerUnit: S.cornerUnit, eKhata: S.eKhata, biappa: S.biappa, parking: S.parking, amenities: S.amenities },
  },
  [AssetType.VILAMENT]: {
    step2: { facing: S.facing, age: S.age, structure: S.structure, config: S.config, furnishing: S.furnishing, sbua: S.sbua, plotArea: S.plotArea, uds: S.uds, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { parking: S.parking, amenities: S.amenities },
  },
  [AssetType.COMMERCIAL_SPACE]: {
    step2: { facing: S.facing, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { amenities: S.amenities },
  },
  [AssetType.COMMERCIAL_PROPERTY]: {
    step2: { facing: S.facing, structure: S.structure, totalRooms: S.totalRooms, waterSupply: S.waterSupply, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { eKhata: S.eKhata, amenities: S.amenities },
  },
  [AssetType.OFFICE_SPACE]: {
    step2: { seats: S.seats, cabins: S.cabins, meetingRooms: S.meetingRooms, boardRoom: S.boardRoom, facing: S.facing, age: S.age, floorNo: S.floorNo, furnishing: S.furnOffice, buildingGrade: S.buildingGrade, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { extraRooms: S.extraRooms, parkingNum: S.parkingNum, amenities: S.amenities },
  },
  [AssetType.RETAIL_SPACE]: {
    step2: { facing: S.facing, totalFloors: S.totalFloors, floorNo: S.floorNo, age: S.age, furnishing: S.furnRetail, sbua: S.sbua, plotArea: S.plotArea, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { amenities: S.amenities },
  },

  // ── New commercial — Resale ───────────────────────────────────────────────
  [AssetType.SHOWROOM]: {
    step2: { facing: S.facing, floorNo: S.floorNo, frontage: S.frontage, furnishing: S.furnRetail, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { parkingNum: S.parkingNum, idealFor: S.idealFor, amenities: S.amenities },
  },
  [AssetType.SHOP]: {
    step2: { facing: S.facing, floorNo: S.floorNo, frontage: S.frontage, age: S.age, furnishing: S.furnShop, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { parkingNum: S.parkingNum, amenities: S.amenities },
  },
  [AssetType.TECH_PARK]: {
    step2: { facing: S.facing, floorNo: S.floorNo, tower: S.tower, parkType: S.parkType, furnishing: S.furnOffice, age: S.age, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { parkingNum: S.parkingNum, amenities: S.amenities },
  },
  [AssetType.WAREHOUSE]: {
    step2: { warehouseType: S.warehouseType, sbua: S.sbua, landArea: S.landArea, floorType: S.floorType, floorLoading: S.floorLoading, docks: S.docks, dockLevelers: S.dockLevelers, truckAccess: S.truckAccess, powerLoad: S.powerLoad, officeBlock: S.officeBlock, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { zoningWh: S.zoningWh, parkingNum: S.parkingNum, amenities: S.amenities },
  },
  [AssetType.INDUSTRIAL_LAND]: {
    step2: { landType: S.landType, landArea: S.landArea, frontage: S.frontage, depth: S.depth, shape: S.shape, topography: S.topography, compoundWall: S.compoundWall, gate: S.gate, pricePerAcre: S.pricePerAcre, askPrice: S.askPrice },
    step3: { zoningLand: S.zoningLand, fsiFar: S.fsiFar, roadType: S.roadType, utilities: S.utilities, amenities: S.amenities },
  },
}

// ─── RENTAL configs ───────────────────────────────────────────────────────────

const RENTAL = {
  [AssetType.APARTMENT]: {
    step2: { aptType: S.aptType, facing: S.facing, age: S.age, totalFloors: S.totalFloors, floorNo: S.floorNo, furnishing: S.furnishing, sbua: S.sbua, config: S.config, rent: S.rent, deposit: S.deposit, maintenance: S.maintenance, commission: S.commission },
    step3: { prefTenants: S.prefTenants, petAllowed: S.petAllowed, nonVeg: S.nonVeg, amenities: S.amenities },
  },
  [AssetType.VILLA]: {
    step2: { facing: S.facing, age: S.age, structure: S.structure, totalFloors: S.totalFloors, furnishing: S.furnishing, sbua: S.sbua, parking: S.parking, config: S.config, rent: S.rent, maintenance: S.maintenance, commission: S.commission },
    step3: { prefTenants: S.prefTenants, petAllowed: S.petAllowed, nonVeg: S.nonVeg, amenities: S.amenities },
  },

  // ── New commercial — Rental ───────────────────────────────────────────────
  [AssetType.OFFICE_SPACE]: {
    step2: { seats: S.seats, cabins: S.cabins, meetingRooms: S.meetingRooms, boardRoom: S.boardRoom, facing: S.facing, age: S.age, floorNo: S.floorNo, furnishing: S.furnOffice, buildingGrade: S.buildingGrade, sbua: S.sbua, rent: S.rent, deposit: S.deposit, leaseTenure: S.leaseTenureOfficeShop },
    step3: { extraRooms: S.extraRooms, parkingNum: S.parkingNum, maintenance: S.maintenance, amenities: S.amenities },
  },
  [AssetType.RETAIL_SPACE]: {
    step2: { facing: S.facing, totalFloors: S.totalFloors, floorNo: S.floorNo, age: S.age, furnishing: S.furnRetail, sbua: S.sbua, rent: S.rent, deposit: S.deposit },
    step3: { maintenance: S.maintenance, amenities: S.amenities },
  },
  [AssetType.SHOWROOM]: {
    step2: { facing: S.facing, floorNo: S.floorNo, frontage: S.frontage, furnishing: S.furnRetail, sbua: S.sbua, rent: S.rent, deposit: S.deposit },
    step3: { parkingNum: S.parkingNum, idealFor: S.idealFor, maintenance: S.maintenance, amenities: S.amenities },
  },
  [AssetType.SHOP]: {
    step2: { facing: S.facing, floorNo: S.floorNo, frontage: S.frontage, age: S.age, furnishing: S.furnShop, sbua: S.sbua, rent: S.rent, deposit: S.deposit, leaseTenure: S.leaseTenureOfficeShop },
    step3: { parkingNum: S.parkingNum, maintenance: S.maintenance, amenities: S.amenities },
  },
  [AssetType.TECH_PARK]: {
    step2: { facing: S.facing, floorNo: S.floorNo, tower: S.tower, parkType: S.parkType, furnishing: S.furnOffice, age: S.age, sbua: S.sbua, rent: S.rent, deposit: S.deposit, leaseTenure: S.leaseTenureTechWarehouse },
    step3: { parkingNum: S.parkingNum, maintenance: S.maintenance, amenities: S.amenities },
  },
  [AssetType.WAREHOUSE]: {
    step2: { warehouseType: S.warehouseType, sbua: S.sbua, landArea: S.landArea, floorType: S.floorType, floorLoading: S.floorLoading, docks: S.docks, dockLevelers: S.dockLevelers, truckAccess: S.truckAccess, powerLoad: S.powerLoad, officeBlock: S.officeBlock, rent: S.rent, deposit: S.deposit, leaseTenure: S.leaseTenureTechWarehouse },
    step3: { zoningWh: S.zoningWh, parkingNum: S.parkingNum, maintenance: S.maintenance, amenities: S.amenities },
  },
  [AssetType.INDUSTRIAL_LAND]: {
    step2: { landType: S.landType, landArea: S.landArea, frontage: S.frontage, depth: S.depth, shape: S.shape, topography: S.topography, compoundWall: S.compoundWall, gate: S.gate, groundRent: S.groundRent, deposit: S.deposit, leaseTenure: S.leaseTenureLand },
    step3: { zoningLand: S.zoningLand, fsiFar: S.fsiFar, roadType: S.roadType, utilities: S.utilities },
  },
}

// ─── exports ──────────────────────────────────────────────────────────────────

export function getFieldConfig(listingType, assetType) {
  if (!assetType) return null
  if (listingType === ListingType.RESALE) return RESALE[assetType] ?? null
  return RENTAL[assetType] ?? null
}

export const PRICING_KEYS = new Set([
  'rent', 'deposit', 'maintenance', 'commission',
  'askPrice', 'priceSqft', 'pricePerAcre', 'groundRent',
  'leaseTenure',
])

// ─── validation ───────────────────────────────────────────────────────────────

export const step1Schema = Yup.object({
  name:        Yup.string().min(3, 'Min 3 characters').required('Property name is required'),
  assetType:   Yup.string().required('Asset type is required'),
  listingType: Yup.string().required('Listing type is required'),
  address:     Yup.string().required('Address is required'),
  state:       Yup.string().required('State is required'),
  city:        Yup.string().required('City is required'),
  pincode:     Yup.string().matches(/^\d{6}$/, 'Enter valid 6-digit pincode').required('Required'),
  possession:  Yup.string().required('Possession status is required'),
})

export function buildStepSchema(fields = {}) {
  const shape = {}
  Object.entries(fields).forEach(([key, cfg]) => {
    if (!cfg.required) return
    switch (cfg.type) {
      case 'price':
        shape[`${key}Value`] = Yup.number()
          .typeError('Must be a number').positive('Must be positive')
          .required(`${cfg.label} is required`)
        break
      case 'config':
        shape.bedrooms = Yup.string().required('Bedroom configuration is required')
        break
      case 'amenities':
      case 'multiselect':
        break
      default:
        shape[key] = Yup.string().required(`${cfg.label} is required`)
    }
  })
  return Yup.object(shape)
}

export function getStepFieldNames(fields = {}) {
  return Object.entries(fields).flatMap(([key, cfg]) => {
    if (!cfg.required) return []
    if (cfg.type === 'price') return [`${key}Value`]
    if (cfg.type === 'config') return ['bedrooms']
    if (cfg.type === 'amenities') return []
    return [key]
  })
}

// ─── initial values ───────────────────────────────────────────────────────────

export const INITIAL_VALUES = {
  name: '', listingType: ListingType.RESALE, assetType: '',
  address: '', area: '', state: '', city: '', pincode: '', possession: '',

  // Residential
  aptType: '', facing: '', age: '', floorNo: '', totalFloors: '', structure: '',
  bedrooms: '', bathrooms: '', balconies: '', furnishing: '', balconyFacing: '',
  sbua: '', plotArea: '', uds: '', priceSqft: '', seats: '', totalRooms: '', waterSupply: '',
  bKhata: '', lKhata: '', eKhata: '', extraRooms: [],
  cornerUnit: '', biappa: '', exclusive: '',
  askPriceValue: '', askPriceUnit: 'CRORES',
  rentValue: '', rentUnit: 'LAKHS',
  depositValue: '', depositUnit: 'LAKHS',
  parking: '', prefTenants: '', maintenance: '', commission: '',
  petAllowed: '', nonVeg: '',
  amenities: [], description: '',

  // Office Space
  cabins: '', meetingRooms: '', boardRoom: '', buildingGrade: '',

  // Tech Park
  tower: '', parkType: '',

  // Showroom / Shop
  frontage: '', idealFor: [],

  // Warehouse
  warehouseType: '', landArea: '', floorType: '', floorLoading: '',
  docks: '', dockLevelers: '', truckAccess: '', powerLoad: '', officeBlock: '',

  // Industrial Land
  landType: '', depth: '', shape: '', topography: '',
  compoundWall: '', gate: '', zoningWh: '', zoningLand: '',
  fsiFar: '', roadType: '', utilities: [],
  pricePerAcreValue: '', pricePerAcreUnit: 'CRORES',
  groundRentValue: '', groundRentUnit: 'LAKHS',

  // Shared commercial
  parkingNum: '', leaseTenure: '',
}

// ─── submit payload builder ───────────────────────────────────────────────────

export function buildSubmitPayload(values) {
  return {
    name:        values.name,
    listingType: values.listingType,
    assetType:   values.assetType,
    possession:  values.possession,
    address:     values.address,
    area:        values.area || undefined,
    state:       values.state,
    city:        values.city,
    pincode:     values.pincode,

    // Residential config
    bedrooms:  values.bedrooms  !== '' ? Number(values.bedrooms)  : undefined,
    bathrooms: values.bathrooms !== '' ? Number(values.bathrooms) : undefined,
    balconies: values.balconies !== '' ? Number(values.balconies) : undefined,
    seats:     values.seats     !== '' ? Number(values.seats)     : undefined,

    // Property details
    apartmentType:  values.aptType      || undefined,
    doorFacing:     values.facing       || undefined,
    ageOfBuilding:  values.age          || undefined,
    floorNumber:    values.floorNo      || undefined,
    totalFloors:    values.totalFloors  || undefined,
    structure:      values.structure    || undefined,
    furnishing:     values.furnishing   || undefined,
    balconyFacing:  values.balconyFacing|| undefined,
    sbua:           values.sbua         || undefined,
    plotArea:       values.plotArea     || undefined,
    uds:            values.uds          || undefined,
    pricePerSqft:   values.priceSqft    || undefined,
    totalRooms:     values.totalRooms   || undefined,
    waterSupply:    values.waterSupply  || undefined,

    // Pricing
    askPrice:       values.askPriceValue || undefined,
    priceUnit:      values.askPriceUnit  || undefined,
    rentPerMonth:   values.rentValue     || undefined,
    rentUnit:       values.rentUnit      || undefined,
    deposit:        values.depositValue  || undefined,
    depositUnit:    values.depositUnit   || undefined,
    maintenance:    values.maintenance   || undefined,
    commissionType: values.commission    || undefined,

    // Residential more details
    buildingKhata:       values.bKhata    || undefined,
    landKhata:           values.lKhata    || undefined,
    eKhata:              values.eKhata    || undefined,
    extraRooms:          values.extraRooms?.length ? values.extraRooms : undefined,
    cornerUnit:          values.cornerUnit || undefined,
    bioppaApprovedKhata: values.biappa    || undefined,
    exclusive:           values.exclusive || undefined,
    parking:             values.parking   || undefined,
    preferredTenant:     values.prefTenants || undefined,
    petAllowed:          values.petAllowed || undefined,
    nonVegAllowed:       values.nonVeg     || undefined,
    amenities:           values.amenities?.length ? values.amenities : undefined,
    description:         values.description || undefined,

    // Office Space
    cabins:       values.cabins       !== '' ? Number(values.cabins)       : undefined,
    meetingRooms: values.meetingRooms !== '' ? Number(values.meetingRooms) : undefined,
    boardRoom:    values.boardRoom    !== '' ? Number(values.boardRoom)    : undefined,
    buildingGrade:values.buildingGrade || undefined,

    // Tech Park
    tower:    values.tower    || undefined,
    parkType: values.parkType || undefined,

    // Showroom / Shop
    frontage: values.frontage !== '' ? Number(values.frontage) : undefined,
    idealFor: values.idealFor?.length ? values.idealFor : undefined,

    // Warehouse
    warehouseType: values.warehouseType || undefined,
    landArea:      values.landArea      !== '' ? Number(values.landArea)      : undefined,
    floorType:     values.floorType     || undefined,
    floorLoading:  values.floorLoading  !== '' ? Number(values.floorLoading)  : undefined,
    docks:         values.docks         !== '' ? Number(values.docks)         : undefined,
    dockLevelers:  values.dockLevelers  !== '' ? Number(values.dockLevelers)  : undefined,
    truckAccess:   values.truckAccess   || undefined,
    powerLoad:     values.powerLoad     !== '' ? Number(values.powerLoad)     : undefined,
    officeBlock:   values.officeBlock   !== '' ? Number(values.officeBlock)   : undefined,

    // Industrial Land
    landType:     values.landType     || undefined,
    depth:        values.depth        !== '' ? Number(values.depth)        : undefined,
    shape:        values.shape        || undefined,
    topography:   values.topography   || undefined,
    compoundWall: values.compoundWall || undefined,
    gate:         values.gate         || undefined,
    zoning:       values.zoningWh || values.zoningLand || undefined,
    fsiFar:       values.fsiFar       || undefined,
    roadType:     values.roadType     || undefined,
    utilitiesNearby: values.utilities?.length ? values.utilities : undefined,
    pricePerAcre: values.pricePerAcreValue || undefined,
    pricePerAcreUnit: values.pricePerAcreUnit || undefined,
    groundRent:   values.groundRentValue || undefined,
    groundRentUnit: values.groundRentUnit || undefined,

    // Shared commercial
    parkingNum:   values.parkingNum !== '' ? Number(values.parkingNum) : undefined,
    leaseTenure:  values.leaseTenure || undefined,
  }
}

// ─── propertyToFormValues (edit mode) ────────────────────────────────────────

export function propertyToFormValues(property) {
  const b  = property.basicDetails    || {}
  const pd = property.propertyDetails || {}
  const md = property.moreDetails     || {}
  return {
    name:        b.name        || '',
    listingType: b.listingType || ListingType.RESALE,
    assetType:   b.assetType   || '',
    possession:  b.possession  || '',
    address:     b.address     || '',
    area:        b.area        || '',
    state:       b.state       || '',
    city:        b.city        || '',
    pincode:     b.pincode     || '',
    bedrooms:    b.bedrooms    ?? '',
    bathrooms:   b.bathrooms   ?? '',
    balconies:   b.balconies   ?? '',
    seats:       b.seats       ?? '',

    aptType:      pd.apartmentType  || '',
    facing:       pd.doorFacing     || '',
    age:          pd.ageOfBuilding  || '',
    floorNo:      pd.floorNumber    || '',
    totalFloors:  String(pd.totalFloors ?? ''),
    structure:    pd.structure      || '',
    furnishing:   pd.furnishing     || '',
    balconyFacing:pd.balconyFacing  || '',
    sbua:         pd.sbua           ?? '',
    plotArea:     pd.plotArea       ?? '',
    uds:          pd.uds            ?? '',
    priceSqft:    pd.pricePerSqft   ?? '',
    totalRooms:   pd.totalRooms     ?? '',
    waterSupply:  pd.waterSupply    || '',

    askPriceValue:  pd.askPrice      ?? '',
    askPriceUnit:   pd.priceUnit     || 'CRORES',
    rentValue:      pd.rentPerMonth  ?? '',
    rentUnit:       pd.rentUnit      || 'LAKHS',
    depositValue:   pd.deposit       ?? '',
    depositUnit:    pd.depositUnit   || 'LAKHS',
    maintenance:    pd.maintenance   || '',
    commission:     pd.commissionType|| '',

    // Office Space
    cabins:        pd.cabins        ?? '',
    meetingRooms:  pd.meetingRooms  ?? '',
    boardRoom:     pd.boardRoom     ?? '',
    buildingGrade: pd.buildingGrade || '',

    // Tech Park
    tower:    pd.tower    || '',
    parkType: pd.parkType || '',

    // Showroom / Shop
    frontage: pd.frontage ?? '',
    idealFor: md.idealFor || [],

    // Warehouse
    warehouseType: pd.warehouseType || '',
    landArea:      pd.landArea      ?? '',
    floorType:     pd.floorType     || '',
    floorLoading:  pd.floorLoading  ?? '',
    docks:         pd.docks         ?? '',
    dockLevelers:  pd.dockLevelers  ?? '',
    truckAccess:   pd.truckAccess   || '',
    powerLoad:     pd.powerLoad     ?? '',
    officeBlock:   pd.officeBlock   ?? '',

    // Industrial Land
    landType:     pd.landType     || '',
    depth:        pd.depth        ?? '',
    shape:        pd.shape        || '',
    topography:   pd.topography   || '',
    compoundWall: pd.compoundWall || '',
    gate:         pd.gate         || '',
    zoningWh:     pd.zoning       || '',
    zoningLand:   pd.zoning       || '',
    fsiFar:       pd.fsiFar       || '',
    roadType:     pd.roadType     || '',
    utilities:    pd.utilitiesNearby || [],
    pricePerAcreValue:  pd.pricePerAcre     ?? '',
    pricePerAcreUnit:   pd.pricePerAcreUnit || 'CRORES',
    groundRentValue:    pd.groundRent       ?? '',
    groundRentUnit:     pd.groundRentUnit   || 'LAKHS',

    // Shared more details
    bKhata:    md.buildingKhata || '',
    lKhata:    md.landKhata     || '',
    eKhata:    md.eKhata    !== undefined && md.eKhata    !== null ? (md.eKhata    ? 'Yes' : 'No') : '',
    extraRooms:md.extraRooms    || [],
    cornerUnit:md.cornerUnit !== undefined && md.cornerUnit !== null ? (md.cornerUnit ? 'Yes' : 'No') : '',
    biappa:    md.bioppaApprovedKhata !== undefined && md.bioppaApprovedKhata !== null ? (md.bioppaApprovedKhata ? 'Yes' : 'No') : '',
    exclusive: md.exclusive !== undefined && md.exclusive !== null ? (md.exclusive ? 'Yes' : 'No') : '',
    parking:   md.parking   || '',
    parkingNum:md.parkingNum ?? '',
    prefTenants:md.preferredTenant || '',
    petAllowed: md.petAllowed !== undefined && md.petAllowed !== null ? (md.petAllowed ? 'Yes' : 'No') : '',
    nonVeg:     md.nonVegAllowed  !== undefined && md.nonVegAllowed  !== null ? (md.nonVegAllowed  ? 'Yes' : 'No') : '',
    leaseTenure:pd.leaseTenure || '',
    amenities:  md.amenities    || [],
    description:md.description  || '',
  }
}