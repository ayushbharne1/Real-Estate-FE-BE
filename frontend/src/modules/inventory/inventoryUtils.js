// src/modules/inventory/inventoryUtils.js
// ─────────────────────────────────────────────────────────────────────────────
// Central utility for the Add / Edit Inventory form.
//   • getFieldConfig(listingType, assetType) → { step2, step3 }
//   • buildValidationSchema(step, fieldConfig, isRentalLocked)
//   • buildSubmitPayload(values)  → flat object for FormData
//   • INITIAL_VALUES
//   • RENTAL_NOT_AVAILABLE  set
// ─────────────────────────────────────────────────────────────────────────────

import * as Yup from 'yup'
import {
  ASSET_TYPE_OPTIONS,
  DOOR_FACING_OPTIONS,
  AGE_OF_BUILDING_OPTIONS,
  FLOOR_RANGE_OPTIONS,
  FURNISHING_OPTIONS,
  FURNISHING_OFFICE_OPTIONS,
  FURNISHING_RETAIL_OPTIONS,
  PARKING_OPTIONS,
  POSSESSION_OPTIONS,
  BHK_OPTIONS,
  AMENITY_OPTIONS,
  PRICE_UNIT_OPTIONS,
  COMMISSION_TYPE_OPTIONS,
  MAINTENANCE_OPTIONS,
  PREFERRED_TENANT_OPTIONS,
  KHATA_OPTIONS,
  EXTRA_ROOM_OPTIONS,
  STRUCTURE_OPTIONS,
} from 'shared/constants/dropdown.js'
import { AssetType, ListingType } from 'shared/enums/index.js'

// ─── constants ────────────────────────────────────────────────────────────────

export const AMENITIES_LIST = AMENITY_OPTIONS   // { value, label, icon }[]

// Rental is only available for Apartment + Villa
export const RENTAL_AVAILABLE = new Set([AssetType.APARTMENT, AssetType.VILLA])

export const isRentalLocked = (listingType, assetType) =>
  listingType === ListingType.RENTAL && !RENTAL_AVAILABLE.has(assetType)

// Apartment-type options for dropdown (shared: Apartment & Row House)
const APT_TYPE_OPTIONS = [
  { value: 'SIMPLEX',    label: 'Simplex' },
  { value: 'DUPLEX',     label: 'Duplex' },
  { value: 'TRIPLEX',    label: 'Triplex' },
  { value: 'PENTHOUSE',  label: 'Penthouse' },
]

const TOTAL_FLOORS_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: String(i + 1), label: String(i + 1),
}))

const BALCONY_FACING_OPTIONS = DOOR_FACING_OPTIONS   // same values

// ─── field descriptor factories ───────────────────────────────────────────────

const F = {
  text:      (label, required = false)            => ({ label, required, type: 'text' }),
  number:    (label, suffix = '', required = false) => ({ label, required, type: 'number', suffix }),
  dropdown:  (label, options, required = false)   => ({ label, required, type: 'dropdown', options }),
  yesno:     (label)                              => ({ label, required: false, type: 'yesno' }),
  price:     (label, required = true)             => ({ label, required, type: 'price' }),
  config:    ()                                   => ({ label: 'Configuration (BHK + Bath + Balcony)', required: true, type: 'config' }),
  amenities: ()                                   => ({ label: 'Amenities', required: false, type: 'amenities' }),
  multiselect: (label, options, required = false) => ({ label, required, type: 'multiselect', options }),
}

// ─── shared field atoms ───────────────────────────────────────────────────────

const S = {
  aptType:      F.dropdown('Apartment Type', APT_TYPE_OPTIONS, true),
  facing:       F.dropdown('Door Facing', DOOR_FACING_OPTIONS),
  age:          F.dropdown('Age of Building', AGE_OF_BUILDING_OPTIONS, true),
  floorNo:      F.dropdown('Floor Number', FLOOR_RANGE_OPTIONS),
  totalFloors:  F.dropdown('Total Floors', TOTAL_FLOORS_OPTIONS),
  structure:    F.dropdown('Structure', STRUCTURE_OPTIONS),
  config:       F.config(),
  furnishing:   F.dropdown('Furnishing', FURNISHING_OPTIONS, true),
  furnOffice:   F.dropdown('Furnishing', [...FURNISHING_OFFICE_OPTIONS, ...FURNISHING_OPTIONS], true),
  furnRetail:   F.dropdown('Furnishing', [...FURNISHING_RETAIL_OPTIONS, ...FURNISHING_OPTIONS], true),
  sbua:         F.number('SBUA', 'sq.ft', true),
  plotArea:     F.number('Plot Area', 'sq.ft', true),
  uds:          F.number('UDS (Undivided Spaces)', 'sq.ft'),
  priceSqft:    F.number('Price per Sqft', '₹'),
  askPrice:     F.price('Ask Price'),
  rent:         F.price('Rent per Month'),
  deposit:      F.price('Deposit', false),
  parking:      F.dropdown('Parking', PARKING_OPTIONS, true),
  bKhata:       F.dropdown('Building Khata', KHATA_OPTIONS),
  lKhata:       F.dropdown('Land Khata', KHATA_OPTIONS),
  eKhata:       F.yesno('E-Khata'),
  cornerUnit:   F.yesno('Corner Unit'),
  biappa:       F.yesno('Bioppa Approved Khata'),
  exclusive:    F.yesno('Exclusive'),
  extraRooms:   F.multiselect('Extra Rooms', EXTRA_ROOM_OPTIONS),
  balconyFacing:F.dropdown('Balcony Facing', BALCONY_FACING_OPTIONS),
  seats:        F.number('No. of Seats', '', true),
  totalRooms:   F.number('Total Rooms'),
  waterSupply:  F.text('Water Supply'),
  prefTenants:  F.dropdown('Preferred Tenants', PREFERRED_TENANT_OPTIONS, true),
  maintenance:  F.dropdown('Maintenance', MAINTENANCE_OPTIONS),
  commission:   F.dropdown('Commission Type', COMMISSION_TYPE_OPTIONS, true),
  petAllowed:   F.yesno('Pet Allowed'),
  nonVeg:       F.yesno('Non-Veg Allowed'),
  amenities:    F.amenities(),
}

// ─── RESALE field configs ─────────────────────────────────────────────────────

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
    step2: { facing: S.facing, structure: S.structure, totalRooms: S.totalRooms, waterSupply: S.waterSupply, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice, eKhata: S.eKhata },
    step3: { amenities: S.amenities },
  },
  [AssetType.OFFICE_SPACE]: {
    step2: { seats: S.seats, facing: S.facing, age: S.age, floorNo: S.floorNo, furnishing: S.furnOffice, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice, bKhata: S.bKhata },
    step3: { lKhata: S.lKhata, cornerUnit: S.cornerUnit, exclusive: S.exclusive, parking: S.parking, amenities: S.amenities },
  },
  [AssetType.RETAIL_SPACE]: {
    step2: { facing: S.facing, totalFloors: S.totalFloors, floorNo: S.floorNo, age: S.age, furnishing: S.furnRetail, sbua: S.sbua, plotArea: S.plotArea, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { amenities: S.amenities },
  },
}

// ─── RENTAL field configs ─────────────────────────────────────────────────────

const RENTAL = {
  [AssetType.APARTMENT]: {
    step2: { aptType: S.aptType, facing: S.facing, age: S.age, totalFloors: S.totalFloors, floorNo: S.floorNo, furnishing: S.furnishing, sbua: S.sbua, config: S.config, rent: S.rent, deposit: S.deposit, maintenance: S.maintenance, commission: S.commission },
    step3: { prefTenants: S.prefTenants, petAllowed: S.petAllowed, nonVeg: S.nonVeg, amenities: S.amenities },
  },
  [AssetType.VILLA]: {
    step2: { facing: S.facing, age: S.age, structure: S.structure, totalFloors: S.totalFloors, furnishing: S.furnishing, sbua: S.sbua, parking: S.parking, config: S.config, rent: S.rent, maintenance: S.maintenance, commission: S.commission },
    step3: { prefTenants: S.prefTenants, petAllowed: S.petAllowed, nonVeg: S.nonVeg, amenities: S.amenities },
  },
}

// ─── main export ──────────────────────────────────────────────────────────────

/**
 * Returns { step2: { [fieldKey]: FieldDef }, step3: { [fieldKey]: FieldDef } }
 * or null if no config found (e.g. locked rental type)
 */
export function getFieldConfig(listingType, assetType) {
  if (!assetType) return null
  if (listingType === ListingType.RESALE) return RESALE[assetType] ?? null
  return RENTAL[assetType] ?? null
}

// ─── pricing field keys (shown with divider in step 2) ───────────────────────
export const PRICING_KEYS = new Set(['rent', 'deposit', 'maintenance', 'commission'])

// ─── validation ───────────────────────────────────────────────────────────────

export const step1Schema = Yup.object({
  name:       Yup.string().min(3, 'Min 3 characters').required('Property name is required'),
  assetType:  Yup.string().required('Asset type is required'),
  listingType:Yup.string().required('Listing type is required'),
  address:    Yup.string().required('Address is required'),
  state:      Yup.string().required('State is required'),
  city:       Yup.string().required('City is required'),
  pincode:    Yup.string().matches(/^\d{6}$/, 'Enter valid 6-digit pincode').required('Required'),
  possession: Yup.string().required('Possession status is required'),
})

/** Build a Yup schema from a step2 or step3 field config map */
export function buildStepSchema(fields = {}) {
  const shape = {}
  Object.entries(fields).forEach(([key, cfg]) => {
    if (!cfg.required) return
    switch (cfg.type) {
      case 'price':
        // price inputs split into value + unit fields
        shape[`${key}Value`] = Yup.number()
          .typeError('Must be a number')
          .positive('Must be positive')
          .required(`${cfg.label} is required`)
        break
      case 'config':
        shape.bedrooms = Yup.string().required('Bedroom configuration is required')
        break
      case 'amenities':
      case 'multiselect':
        // not required validation
        break
      default:
        shape[key] = Yup.string().required(`${cfg.label} is required`)
    }
  })
  return Yup.object(shape)
}

/** Returns flat list of field names for a given step's field config (for touch-all-on-next) */
export function getStepFieldNames(fields = {}) {
  return Object.entries(fields).flatMap(([key, cfg]) => {
    if (!cfg.required) return []
    if (cfg.type === 'price')     return [`${key}Value`]
    if (cfg.type === 'config')    return ['bedrooms']
    if (cfg.type === 'amenities') return []
    return [key]
  })
}

// ─── initial values ───────────────────────────────────────────────────────────

export const INITIAL_VALUES = {
  // Step 1 — Basic Details
  name: '', listingType: ListingType.RESALE, assetType: '',
  address: '', area: '', state: '', city: '', pincode: '', possession: '',

  // Step 2 — all possible fields
  aptType: '', facing: '', age: '', floorNo: '', totalFloors: '', structure: '',
  bedrooms: '', bathrooms: '', balconies: '', furnishing: '', balconyFacing: '',
  sbua: '', plotArea: '', uds: '', priceSqft: '', seats: '', totalRooms: '', waterSupply: '',
  bKhata: '', lKhata: '', eKhata: '', extraRooms: [],
  cornerUnit: '', biappa: '', exclusive: '',

  // Pricing
  askPriceValue: '', askPriceUnit: 'CRORES',
  rentValue: '',     rentUnit: 'LAKHS',
  depositValue: '',  depositUnit: 'LAKHS',

  // Step 3 — More Details
  parking: '', prefTenants: '', maintenance: '', commission: '',
  petAllowed: '', nonVeg: '',
  amenities: [], description: '',
}

// ─── submit payload builder ───────────────────────────────────────────────────

/**
 * Converts Formik values into the flat payload shape the backend expects.
 * Returns a plain object — caller wraps in FormData via buildFormData().
 */
export function buildSubmitPayload(values) {
  return {
    // Step 1
    name:        values.name,
    listingType: values.listingType,
    assetType:   values.assetType,
    possession:  values.possession,
    address:     values.address,
    area:        values.area || undefined,
    state:       values.state,
    city:        values.city,
    pincode:     values.pincode,

    // Config
    bedrooms:  values.bedrooms  || undefined,
    bathrooms: values.bathrooms || undefined,
    balconies: values.balconies || undefined,

    // Step 2 — property details
    seats:        values.seats        || undefined,
    aptType:      values.aptType      || undefined,
    facing:       values.facing       || undefined,
    age:          values.age          || undefined,
    floorNo:      values.floorNo      || undefined,
    totalFloors:  values.totalFloors  || undefined,
    structure:    values.structure    || undefined,
    furnishing:   values.furnishing   || undefined,
    balconyFacing:values.balconyFacing|| undefined,
    sbua:         values.sbua         || undefined,
    plotArea:     values.plotArea     || undefined,
    uds:          values.uds          || undefined,
    priceSqft:    values.priceSqft    || undefined,
    totalRooms:   values.totalRooms   || undefined,
    waterSupply:  values.waterSupply  || undefined,

    // Resale pricing
    askPrice:  values.askPriceValue || undefined,
    priceUnit: values.askPriceUnit  || undefined,

    // Rental pricing
    rentPerMonth:   values.rentValue    || undefined,
    rentUnit:       values.rentUnit     || undefined,
    deposit:        values.depositValue || undefined,
    depositUnit:    values.depositUnit  || undefined,
    maintenance:    values.maintenance  || undefined,
    commissionType: values.commission   || undefined,

    // Step 3 — more details
    bKhata:              values.bKhata      || undefined,   // → buildingKhata
    lKhata:              values.lKhata      || undefined,   // → landKhata
    eKhata:              values.eKhata      || undefined,
    extraRooms:          values.extraRooms?.length ? values.extraRooms : undefined,
    cornerUnit:          values.cornerUnit  || undefined,
    bioppaApprovedKhata: values.biappa      || undefined,
    exclusive:           values.exclusive   || undefined,
    parking:             values.parking     || undefined,
    preferredTenant:     values.prefTenants || undefined,
    petAllowed:          values.petAllowed  || undefined,
    nonVegAllowed:       values.nonVeg      || undefined,
    amenities:           values.amenities?.length ? values.amenities : undefined,
    description:         values.description || undefined,
  }
}

/**
 * Populate Formik initial values from an existing property document (for Edit).
 * Maps backend nested structure → flat form values.
 */
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

    bedrooms:  b.bedrooms  ?? '',
    bathrooms: b.bathrooms ?? '',
    balconies: b.balconies ?? '',
    seats:     b.seats     ?? '',

    aptType:       pd.apartmentType  || '',
    facing:        pd.doorFacing     || '',
    age:           pd.ageOfBuilding  || '',
    floorNo:       pd.floorNumber    || '',
    totalFloors:   String(pd.totalFloors ?? ''),
    structure:     pd.structure      || '',
    furnishing:    pd.furnishing     || '',
    balconyFacing: pd.balconyFacing  || '',
    sbua:          pd.sbua           ?? '',
    plotArea:      pd.plotArea       ?? '',
    uds:           pd.uds            ?? '',
    priceSqft:     pd.pricePerSqft   ?? '',
    totalRooms:    pd.totalRooms     ?? '',
    waterSupply:   pd.waterSupply    || '',

    askPriceValue: pd.askPrice     ?? '',
    askPriceUnit:  pd.priceUnit    || 'CRORES',
    rentValue:     pd.rentPerMonth ?? '',
    rentUnit:      pd.rentUnit     || 'LAKHS',
    depositValue:  pd.deposit      ?? '',
    depositUnit:   pd.depositUnit  || 'LAKHS',
    maintenance:   pd.maintenance  || '',
    commission:    pd.commissionType || '',

    bKhata:      md.buildingKhata       || '',
    lKhata:      md.landKhata           || '',
    eKhata:      md.eKhata !== undefined ? (md.eKhata ? 'Yes' : 'No') : '',
    extraRooms:  md.extraRooms          || [],
    cornerUnit:  md.cornerUnit !== undefined ? (md.cornerUnit ? 'Yes' : 'No') : '',
    biappa:      md.bioppaApprovedKhata !== undefined ? (md.bioppaApprovedKhata ? 'Yes' : 'No') : '',
    exclusive:   md.exclusive !== undefined ? (md.exclusive ? 'Yes' : 'No') : '',
    parking:     md.parking     || '',
    prefTenants: md.preferredTenant || '',
    petAllowed:  md.petAllowed !== undefined ? (md.petAllowed ? 'Yes' : 'No') : '',
    nonVeg:      md.nonVegAllowed !== undefined ? (md.nonVegAllowed ? 'Yes' : 'No') : '',
    amenities:   md.amenities   || [],
    description: md.description || '',
  }
}