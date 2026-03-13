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
} from 'shared/constants/dropdown.js'
import { AssetType, ListingType } from 'shared/enums/index.js'

// ─── Asset type options filtered by listing type ──────────────────────────────

const RENTAL_ASSET_VALUES = new Set([AssetType.APARTMENT, AssetType.VILLA])

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
  { value: 'SIMPLEX', label: 'Simplex' },
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'TRIPLEX', label: 'Triplex' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
]

const TOTAL_FLOORS_OPTIONS = Array.from({ length: 30 }, (_, i) => ({
  value: String(i + 1), label: String(i + 1),
}))

const BALCONY_FACING_OPTIONS = DOOR_FACING_OPTIONS

// FIX: Building Khata and Land Khata use Yes/No like e-Khata
const YES_NO_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No',  label: 'No' },
]

const F = {
  text: (label, required = false) => ({ label, required, type: 'text' }),
  number: (label, suffix = '', required = false) => ({ label, required, type: 'number', suffix }),
  dropdown: (label, options, required = false) => ({ label, required, type: 'dropdown', options }),
  yesno: (label) => ({ label, required: false, type: 'yesno' }),
  price: (label, required = true) => ({ label, required, type: 'price' }),
  config: () => ({ label: 'Configuration (BHK + Bath + Balcony)', required: true, type: 'config' }),
  amenities: () => ({ label: 'Amenities', required: false, type: 'amenities' }),
  multiselect: (label, options, required = false) => ({ label, required, type: 'multiselect', options }),
}

const S = {
  aptType: F.dropdown('Apartment Type', APT_TYPE_OPTIONS, true),
  facing: F.dropdown('Door Facing', DOOR_FACING_OPTIONS),
  age: F.dropdown('Age of Building', AGE_OF_BUILDING_OPTIONS, true),
  floorNo: F.dropdown('Floor Number', FLOOR_RANGE_OPTIONS),
  totalFloors: F.dropdown('Total Floors', TOTAL_FLOORS_OPTIONS),
  structure: F.dropdown('Structure', STRUCTURE_OPTIONS),
  config: F.config(),
  furnishing: F.dropdown('Furnishing', FURNISHING_OPTIONS, true),
  furnOffice: F.dropdown('Furnishing', [...FURNISHING_OFFICE_OPTIONS, ...FURNISHING_OPTIONS], true),
  furnRetail: F.dropdown('Furnishing', [...FURNISHING_RETAIL_OPTIONS, ...FURNISHING_OPTIONS], true),
  sbua: F.number('SBUA', 'sq.ft', true),
  plotArea: F.number('Plot Area', 'sq.ft', true),
  uds: F.number('UDS (Undivided Spaces)', 'sq.ft'),
  priceSqft: F.number('Price per Sqft', '₹'),
  askPrice: F.price('Ask Price'),
  rent: F.price('Rent per Month'),
  deposit: F.price('Deposit', false),
  parking: F.dropdown('Parking', PARKING_OPTIONS, true),
  // FIX: Building Khata & Land Khata now use Yes/No (consistent with e-Khata)
  bKhata: F.dropdown('Building Khata', YES_NO_OPTIONS),
  lKhata: F.dropdown('Land Khata', YES_NO_OPTIONS),
  eKhata: F.yesno('E-Khata'),
  cornerUnit: F.yesno('Corner Unit'),
  biappa: F.yesno('Bioppa Approved Khata'),
  exclusive: F.yesno('Exclusive'),
  extraRooms: F.multiselect('Extra Rooms', EXTRA_ROOM_OPTIONS),
  balconyFacing: F.dropdown('Balcony Facing', BALCONY_FACING_OPTIONS),
  seats: F.number('No. of Seats', '', true),
  totalRooms: F.number('Total Rooms'),
  waterSupply: F.text('Water Supply'),
  prefTenants: F.dropdown('Preferred Tenants', PREFERRED_TENANT_OPTIONS, true),
  maintenance: F.dropdown('Maintenance', MAINTENANCE_OPTIONS),
  commission: F.dropdown('Commission Type', COMMISSION_TYPE_OPTIONS, true),
  petAllowed: F.yesno('Pet Allowed'),
  nonVeg: F.yesno('Non-Veg Allowed'),
  amenities: F.amenities(),
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
  // FIX: Move eKhata from step2 to step3 for COMMERCIAL_PROPERTY
  [AssetType.COMMERCIAL_PROPERTY]: {
    step2: { facing: S.facing, structure: S.structure, totalRooms: S.totalRooms, waterSupply: S.waterSupply, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { eKhata: S.eKhata, amenities: S.amenities },
  },
  // FIX: Move bKhata from step2 to step3 for OFFICE_SPACE
  [AssetType.OFFICE_SPACE]: {
    step2: { seats: S.seats, facing: S.facing, age: S.age, floorNo: S.floorNo, furnishing: S.furnOffice, sbua: S.sbua, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { bKhata: S.bKhata, lKhata: S.lKhata, cornerUnit: S.cornerUnit, exclusive: S.exclusive, parking: S.parking, amenities: S.amenities },
  },
  [AssetType.RETAIL_SPACE]: {
    step2: { facing: S.facing, totalFloors: S.totalFloors, floorNo: S.floorNo, age: S.age, furnishing: S.furnRetail, sbua: S.sbua, plotArea: S.plotArea, priceSqft: S.priceSqft, askPrice: S.askPrice },
    step3: { amenities: S.amenities },
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
}

// ─── exports ──────────────────────────────────────────────────────────────────

export function getFieldConfig(listingType, assetType) {
  if (!assetType) return null
  if (listingType === ListingType.RESALE) return RESALE[assetType] ?? null
  return RENTAL[assetType] ?? null
}

export const PRICING_KEYS = new Set(['rent', 'deposit', 'maintenance', 'commission'])

// ─── validation ───────────────────────────────────────────────────────────────

export const step1Schema = Yup.object({
  name: Yup.string().min(3, 'Min 3 characters').required('Property name is required'),
  assetType: Yup.string().required('Asset type is required'),
  listingType: Yup.string().required('Listing type is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  city: Yup.string().required('City is required'),
  pincode: Yup.string().matches(/^\d{6}$/, 'Enter valid 6-digit pincode').required('Required'),
  possession: Yup.string().required('Possession status is required'),
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
}

// ─── submit payload builder ───────────────────────────────────────────────────

export function buildSubmitPayload(values) {
  return {
    name: values.name,
    listingType: values.listingType,
    assetType: values.assetType,
    possession: values.possession,
    address: values.address,
    area: values.area || undefined,
    state: values.state,
    city: values.city,
    pincode: values.pincode,
    bedrooms: values.bedrooms !== '' ? Number(values.bedrooms) : undefined,
    bathrooms: values.bathrooms !== '' ? Number(values.bathrooms) : undefined,
    balconies: values.balconies !== '' ? Number(values.balconies) : undefined,
    seats: values.seats !== '' ? Number(values.seats) : undefined,
    apartmentType: values.aptType || undefined,
    doorFacing: values.facing || undefined,
    ageOfBuilding: values.age || undefined,
    floorNumber: values.floorNo || undefined,
    totalFloors: values.totalFloors || undefined,
    structure: values.structure || undefined,
    furnishing: values.furnishing || undefined,
    balconyFacing: values.balconyFacing || undefined,
    sbua: values.sbua || undefined,
    plotArea: values.plotArea || undefined,
    uds: values.uds || undefined,
    pricePerSqft: values.priceSqft || undefined,
    totalRooms: values.totalRooms || undefined,
    waterSupply: values.waterSupply || undefined,
    askPrice: values.askPriceValue || undefined,
    priceUnit: values.askPriceUnit || undefined,
    rentPerMonth: values.rentValue || undefined,
    rentUnit: values.rentUnit || undefined,
    deposit: values.depositValue || undefined,
    depositUnit: values.depositUnit || undefined,
    maintenance: values.maintenance || undefined,
    commissionType: values.commission || undefined,
    // FIX: bKhata and lKhata are now Yes/No strings — pass directly
    buildingKhata: values.bKhata || undefined,
    landKhata: values.lKhata || undefined,
    // FIX: eKhata, cornerUnit, petAllowed, nonVeg — pass the string directly,
    // the backend _parseBool handles 'Yes'/'No' → true/false
    eKhata: values.eKhata || undefined,
    extraRooms: values.extraRooms?.length ? values.extraRooms : undefined,
    cornerUnit: values.cornerUnit || undefined,
    bioppaApprovedKhata: values.biappa || undefined,
    exclusive: values.exclusive || undefined,
    parking: values.parking || undefined,
    preferredTenant: values.prefTenants || undefined,
    petAllowed: values.petAllowed || undefined,
    nonVegAllowed: values.nonVeg || undefined,
    amenities: values.amenities?.length ? values.amenities : undefined,
    description: values.description || undefined,
  }
}

export function propertyToFormValues(property) {
  const b = property.basicDetails || {}
  const pd = property.propertyDetails || {}
  const md = property.moreDetails || {}
  return {
    name: b.name || '',
    listingType: b.listingType || ListingType.RESALE,
    assetType: b.assetType || '',
    possession: b.possession || '',
    address: b.address || '',
    area: b.area || '',
    state: b.state || '',
    city: b.city || '',
    pincode: b.pincode || '',
    bedrooms: b.bedrooms ?? '',
    bathrooms: b.bathrooms ?? '',
    balconies: b.balconies ?? '',
    seats: b.seats ?? '',
    aptType: pd.apartmentType || '',
    facing: pd.doorFacing || '',
    age: pd.ageOfBuilding || '',
    floorNo: pd.floorNumber || '',
    totalFloors: String(pd.totalFloors ?? ''),
    structure: pd.structure || '',
    furnishing: pd.furnishing || '',
    balconyFacing: pd.balconyFacing || '',
    sbua: pd.sbua ?? '',
    plotArea: pd.plotArea ?? '',
    uds: pd.uds ?? '',
    priceSqft: pd.pricePerSqft ?? '',
    totalRooms: pd.totalRooms ?? '',
    waterSupply: pd.waterSupply || '',
    askPriceValue: pd.askPrice ?? '',
    askPriceUnit: pd.priceUnit || 'CRORES',
    rentValue: pd.rentPerMonth ?? '',
    rentUnit: pd.rentUnit || 'LAKHS',
    depositValue: pd.deposit ?? '',
    depositUnit: pd.depositUnit || 'LAKHS',
    maintenance: pd.maintenance || '',
    commission: pd.commissionType || '',
    // FIX: bKhata/lKhata are stored as Yes/No strings in DB now
    bKhata: md.buildingKhata || '',
    lKhata: md.landKhata || '',
    eKhata: md.eKhata !== undefined && md.eKhata !== null ? (md.eKhata ? 'Yes' : 'No') : '',
    extraRooms: md.extraRooms || [],
    cornerUnit: md.cornerUnit !== undefined && md.cornerUnit !== null ? (md.cornerUnit ? 'Yes' : 'No') : '',
    biappa: md.bioppaApprovedKhata !== undefined && md.bioppaApprovedKhata !== null ? (md.bioppaApprovedKhata ? 'Yes' : 'No') : '',
    exclusive: md.exclusive !== undefined && md.exclusive !== null ? (md.exclusive ? 'Yes' : 'No') : '',
    parking: md.parking || '',
    prefTenants: md.preferredTenant || '',
    petAllowed: md.petAllowed !== undefined && md.petAllowed !== null ? (md.petAllowed ? 'Yes' : 'No') : '',
    nonVeg: md.nonVegAllowed !== undefined && md.nonVegAllowed !== null ? (md.nonVegAllowed ? 'Yes' : 'No') : '',
    amenities: md.amenities || [],
    description: md.description || '',
  }
}