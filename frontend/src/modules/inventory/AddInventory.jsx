/**
 * AddInventory.jsx — Rebuilt exactly per ACN_Inventory_Flow diagram
 *
 * RESALE types: Apartment, Villa, Plot, Independent House, Row House,
 *               Villament, Commercial Space, Commercial Property,
 *               Office Space, Retail Space
 *
 * RENTAL types: Apartment, Villa only
 *               (Plot & Villament explicitly show "Not Available")
 *
 * Step structure per flow:
 *   Step 1 → Basic Details (same for all)
 *   Step 2 → Property Details (asset-type specific)
 *   Step 3 → More Details / Pricing (asset-type specific)
 */

import { useState, useRef, useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ChevronDown, MapPin, Check, Upload, X, AlertCircle } from 'lucide-react'
import { State, City } from 'country-state-city'

const RED = '#E8431A'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & OPTIONS
// ─────────────────────────────────────────────────────────────────────────────
const ASSET_TYPES = [
  'Apartment', 'Villa', 'Plot', 'Independent House', 'Row House',
  'Villament', 'Commercial Space', 'Commercial Property',
  'Office Space', 'Retail Space',
]

// Per flow: only Plot & Villament are explicitly "N/A" for rental
// All other commercial types simply have no rental config (shows notice too)
const RENTAL_NOT_AVAILABLE = [
  'Plot', 'Villament',
  'Commercial Space', 'Commercial Property',
  'Office Space', 'Retail Space',
  'Independent House', 'Row House',
]

const POSSESSION_OPTIONS  = ['Ready to Move', 'Under Construction', 'Available From']
const AREA_OPTIONS        = ['North Bangalore', 'South Bangalore', 'East Bangalore', 'West Bangalore', 'Central Bangalore']
const FACING_OPTIONS      = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']
const AGE_OPTIONS         = ['Less than 1 Year', '1-5 Years', '5-10 Years', '6-10 Years', '10-15 Years', '15+ Years']
const FLOOR_OPTIONS       = ['Ground Floor', 'Lower Floor (1-5)', 'Middle Floor (6-10)', 'Higher Floor (10+)']
const STRUCTURE_OPTIONS   = ['G', 'G+1', 'G+2', 'G+3', 'G+4', 'G+G+6.5']
const PARKING_OPTIONS     = ['0', '1', '2', '3', '4', '5']
const BEDROOM_OPTIONS     = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK']
const KHATA_OPTIONS       = ['A', 'B', 'E-Khata']
const LAND_KHATA_OPTIONS  = ['A', 'B']
const TOTAL_FLOORS_OPT    = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const EXTRA_ROOMS_OPT     = ['Study Room', 'Servant Room', 'Pooja Room', 'Store Room', 'None']
const BALCONY_FACING_OPT  = ['East', 'West', 'North', 'South']
const TENANT_OPTIONS      = ['Family', 'Bachelor (Male)', 'Bachelor (Female)', 'Corporate', 'Any']
const MAINTENANCE_OPT     = ['Included', 'Not Included (Per Month)']
const COMMISSION_OPT      = ['Commission Sharing', 'Side by Side', 'From Owner', 'From Tenant']
const NOTICE_OPT          = ['15 Days', '1 Month', '2 Months', '3 Months']
const FURNISHING_RES      = ['Furnished', 'Semi-Furnished', 'Unfurnished']
const APT_TYPE_OPT        = ['Simplex', 'Duplex', 'Triplex', 'Penthouse']

export const AMENITIES_LIST = [
  'Swimming Pool', 'Lifts / Elevators', 'CCTV Surveillance', 'Security',
  'Power Backup', 'Water Storage / Tank', 'Gym', 'Garden / Landscaping',
  'Community Center', 'Concierge Service', 'Play Area',
  'Visitor Parking', 'Service Lifts', 'Cafeteria / Food Court', 'Maintenance Staff',
]

const IN_STATES = State.getStatesOfCountry('IN')

// ─────────────────────────────────────────────────────────────────────────────
// FIELD CONFIG — exact per flow diagram
// ─────────────────────────────────────────────────────────────────────────────
function getFieldConfig(tab, assetType) {
  if (!assetType) return null

  // ── descriptor helpers ────────────────────────────────────────────────────
  const F = {
    text:      (l, r = false)      => ({ label: l, required: r, type: 'text' }),
    num:       (l, s, r = false)   => ({ label: l, required: r, type: 'number', suffix: s }),
    dd:        (l, o, r = false)   => ({ label: l, required: r, type: 'dropdown', options: o }),
    yesno:     (l)                 => ({ label: l, required: false, type: 'yesno' }),
    price:     (l, r = true)       => ({ label: l, required: r, type: 'price' }),
    config:    ()                  => ({ label: 'Configuration (BHK + Bath + Balcony)', required: true, type: 'config' }),
    amenities: ()                  => ({ label: 'Amenities', required: false, type: 'amenities' }),
  }

  // ── shared field atoms ────────────────────────────────────────────────────
  const S = {
    aptType:     F.dd('Apartment Type', APT_TYPE_OPT, true),
    facing:      F.dd('Door Facing', FACING_OPTIONS),
    age:         F.dd('Age of Building', AGE_OPTIONS, true),
    floorNo:     F.dd('Floor Number', FLOOR_OPTIONS),
    totalFloors: F.dd('Total Floors', TOTAL_FLOORS_OPT),
    structure:   F.dd('Structure', STRUCTURE_OPTIONS),
    config:      F.config(),
    furnishing:  F.dd('Furnishing', FURNISHING_RES, true),
    furnOffice:  F.dd('Furnishing', ['Furnished', 'Plug & Play', 'Unfurnished'], true),
    furnRetail:  F.dd('Furnishing', ['Furnished', 'Warm Shell', 'Unfurnished'], true),
    sbua:        F.num('SBUA', 'sq.ft', true),
    plotArea:    F.num('Plot Area', 'sq.ft', true),
    uds:         F.num('UDS (Undivided Spaces)', 'sq.ft'),
    priceSqft:   F.num('Price per Sqft', '₹'),
    askPrice:    F.price('Ask Price'),
    rent:        F.price('Rent per Month'),
    deposit:     F.price('Deposit', false),
    parking:     F.dd('Parking', PARKING_OPTIONS, true),
    bKhata:      F.dd('Building Khata', KHATA_OPTIONS),
    lKhata:      F.dd('Land Khata', LAND_KHATA_OPTIONS),
    eKhata:      F.yesno('E-Khata'),
    cornerUnit:  F.yesno('Corner Unit'),
    biappa:      F.yesno('Biappa Approved Khata'),
    exclusive:   F.yesno('Exclusive'),
    extraRooms:  F.dd('Extra Rooms', EXTRA_ROOMS_OPT),
    balconyFacing:F.dd('Balcony Facing', BALCONY_FACING_OPT),
    seats:       F.num('No. of Seats', '', true),
    totalRooms:  F.num('Total Rooms'),
    waterSupply: F.text('Water Supply'),
    prefTenants: F.dd('Preferred Tenants', TENANT_OPTIONS, true),
    maintenance: F.dd('Maintenance', MAINTENANCE_OPT),
    commission:  F.dd('Commission Type', COMMISSION_OPT, true),
    noticePeriod:F.dd('Notice Period', NOTICE_OPT),
    petAllowed:  F.yesno('Pet Allowed'),
    nonVeg:      F.yesno('Non-Veg Allowed'),
    amenities:   F.amenities(),
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESALE
  // ══════════════════════════════════════════════════════════════════════════
  const RESALE = {

    // ── Apartment ──────────────────────────────────────────────────────────
    // Flow: step2 → aptType, facing, age, floorNo, config, furnishing, priceSqft, askPrice, sbua
    //       step3 → bKhata(A), lKhata(A), parking, eKhata(Yes), extraRooms, amenities, description
    'Apartment': {
      step2: {
        aptType:   S.aptType,
        facing:    S.facing,
        age:       S.age,
        floorNo:   S.floorNo,
        config:    S.config,
        furnishing:S.furnishing,
        sbua:      S.sbua,
        priceSqft: S.priceSqft,
        askPrice:  S.askPrice,
      },
      step3: {
        bKhata:    S.bKhata,
        lKhata:    S.lKhata,
        parking:   S.parking,
        eKhata:    S.eKhata,
        extraRooms:S.extraRooms,
        amenities: S.amenities,
      },
    },

    // ── Villa ──────────────────────────────────────────────────────────────
    // Flow: step2 → facing, age, structure, config, furnishing, priceSqft, askPrice, sbua
    //       step3 → parking, amenities, description
    'Villa': {
      step2: {
        facing:    S.facing,
        age:       S.age,
        structure: S.structure,
        config:    S.config,
        furnishing:S.furnishing,
        sbua:      S.sbua,
        priceSqft: S.priceSqft,
        askPrice:  S.askPrice,
      },
      step3: {
        parking:   S.parking,
        amenities: S.amenities,
      },
    },

    // ── Plot ──────────────────────────────────────────────────────────────
    // Flow: step2 → facing, plotArea, askPrice, priceSqft
    //              ⚠ No SBUA, No Furnishing, No Floor, No Age
    //       step3 → description ONLY, ⚠ No Amenities
    'Plot': {
      step2: {
        facing:   S.facing,
        plotArea: S.plotArea,
        priceSqft:S.priceSqft,
        askPrice: S.askPrice,
      },
      step3: {}, // description only (handled in Step3 always)
    },

    // ── Independent House ─────────────────────────────────────────────────
    // Flow: step2 → facing, age, structure, config, furnishing, priceSqft, askPrice, sbua
    //       step3 → parking, amenities, description
    'Independent House': {
      step2: {
        facing:    S.facing,
        age:       S.age,
        structure: S.structure,
        config:    S.config,
        furnishing:S.furnishing,
        sbua:      S.sbua,
        priceSqft: S.priceSqft,
        askPrice:  S.askPrice,
      },
      step3: {
        parking:   S.parking,
        amenities: S.amenities,
      },
    },

    // ── Row House ─────────────────────────────────────────────────────────
    // Flow: step2 → aptType, facing, age, balconyFacing⭐, structure, floorNo, config,
    //                        furnishing, priceSqft, askPrice, sbua
    //       step3 → bKhata, cornerUnit, eKhata, biappa⭐, parking, amenities, description
    'Row House': {
      step2: {
        aptType:      S.aptType,
        facing:       S.facing,
        age:          S.age,
        balconyFacing:S.balconyFacing,
        structure:    S.structure,
        floorNo:      S.floorNo,
        config:       S.config,
        furnishing:   S.furnishing,
        sbua:         S.sbua,
        priceSqft:    S.priceSqft,
        askPrice:     S.askPrice,
      },
      step3: {
        bKhata:    S.bKhata,
        cornerUnit:S.cornerUnit,
        eKhata:    S.eKhata,
        biappa:    S.biappa,
        parking:   S.parking,
        amenities: S.amenities,
      },
    },

    // ── Villament ─────────────────────────────────────────────────────────
    // Flow: step2 → facing, age, structure, config, furnishing, priceSqft, askPrice,
    //                        sbua, plotArea⭐, uds⭐
    //       step3 → parking, amenities, description
    'Villament': {
      step2: {
        facing:    S.facing,
        age:       S.age,
        structure: S.structure,
        config:    S.config,
        furnishing:S.furnishing,
        sbua:      S.sbua,
        plotArea:  S.plotArea,
        uds:       S.uds,
        priceSqft: S.priceSqft,
        askPrice:  S.askPrice,
      },
      step3: {
        parking:   S.parking,
        amenities: S.amenities,
      },
    },

    // ── Commercial Space ──────────────────────────────────────────────────
    // Flow: step2 → facing, sbua, askPrice, priceSqft  (minimal fields only)
    //       step3 → amenities, description
    'Commercial Space': {
      step2: {
        facing:   S.facing,
        sbua:     S.sbua,
        priceSqft:S.priceSqft,
        askPrice: S.askPrice,
      },
      step3: {
        amenities: S.amenities,
      },
    },

    // ── Commercial Property ───────────────────────────────────────────────
    // Flow: step2 → facing, structure, totalRooms⭐, waterSupply⭐, sbua, askPrice, priceSqft, eKhata
    //       step3 → amenities, description
    'Commercial Property': {
      step2: {
        facing:      S.facing,
        structure:   S.structure,
        totalRooms:  S.totalRooms,
        waterSupply: S.waterSupply,
        sbua:        S.sbua,
        priceSqft:   S.priceSqft,
        askPrice:    S.askPrice,
        eKhata:      S.eKhata,
      },
      step3: {
        amenities: S.amenities,
      },
    },

    // ── Office Space ──────────────────────────────────────────────────────
    // Flow: step2 → seats⭐, facing, age, floorNo, furnishing(Plug&Play)⭐,
    //                        priceSqft, askPrice, sbua, bKhata(A/B)
    //       step3 → lKhata, cornerUnit, exclusive⭐, parking, amenities, description
    'Office Space': {
      step2: {
        seats:     S.seats,
        facing:    S.facing,
        age:       S.age,
        floorNo:   S.floorNo,
        furnishing:S.furnOffice,
        sbua:      S.sbua,
        priceSqft: S.priceSqft,
        askPrice:  S.askPrice,
        bKhata:    S.bKhata,
      },
      step3: {
        lKhata:    S.lKhata,
        cornerUnit:S.cornerUnit,
        exclusive: S.exclusive,
        parking:   S.parking,
        amenities: S.amenities,
      },
    },

    // ── Retail Space ──────────────────────────────────────────────────────
    // Flow: step2 → facing, totalFloors⭐, floorNo, age, furnishing(WarmShell)⭐,
    //                        priceSqft, askPrice, sbua, plotArea⭐
    //       step3 → amenities, description
    'Retail Space': {
      step2: {
        facing:     S.facing,
        totalFloors:S.totalFloors,
        floorNo:    S.floorNo,
        age:        S.age,
        furnishing: S.furnRetail,
        sbua:       S.sbua,
        plotArea:   S.plotArea,
        priceSqft:  S.priceSqft,
        askPrice:   S.askPrice,
      },
      step3: {
        amenities: S.amenities,
      },
    },
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENTAL — only Apartment & Villa per flow
  // ══════════════════════════════════════════════════════════════════════════
  const RENTAL = {

    // ── Apartment Rental ───────────────────────────────────────────────────
    // Flow: step2 → aptType, facing, age, totalFloors, floorNo, furnishing, sbua, config
    //       pricing section → rent, deposit, maintenance, commissionType
    //       step3 → prefTenants(Family), petAllowed⭐, nonVeg⭐, amenities, description
    'Apartment': {
      step2: {
        aptType:    S.aptType,
        facing:     S.facing,
        age:        S.age,
        totalFloors:S.totalFloors,
        floorNo:    S.floorNo,
        furnishing: S.furnishing,
        sbua:       S.sbua,
        config:     S.config,
        parking:    S.parking,
        // Pricing
        rent:       S.rent,
        deposit:    S.deposit,
        maintenance:S.maintenance,
        commission: S.commission,
      },
      step3: {
        prefTenants: S.prefTenants,
        noticePeriod:S.noticePeriod,
        petAllowed:  S.petAllowed,
        nonVeg:      S.nonVeg,
        amenities:   S.amenities,
      },
    },

    // ── Villa Rental ───────────────────────────────────────────────────────
    // Flow: step2 → facing, age, structure, totalFloors, furnishing, sbua, parking, config
    //              ⚠ No Deposit field
    //       pricing → rent, maintenance, commissionType (NO deposit)
    //       step3 → prefTenants, petAllowed⭐, nonVeg⭐, amenities, description
    'Villa': {
      step2: {
        facing:     S.facing,
        age:        S.age,
        structure:  S.structure,
        totalFloors:S.totalFloors,
        furnishing: S.furnishing,
        sbua:       S.sbua,
        parking:    S.parking,
        config:     S.config,
        // Pricing — NO deposit for Villa rental
        rent:       S.rent,
        maintenance:S.maintenance,
        commission: S.commission,
      },
      step3: {
        prefTenants: S.prefTenants,
        noticePeriod:S.noticePeriod,
        petAllowed:  S.petAllowed,
        nonVeg:      S.nonVeg,
        amenities:   S.amenities,
      },
    },
  }

  if (tab === 'resale') return RESALE[assetType] || null
  return RENTAL[assetType] || null
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
const step1Schema = Yup.object({
  propertyName: Yup.string().required('Property name is required'),
  assetType:    Yup.string().required('Asset type is required'),
  address:      Yup.string().required('Address is required'),
  state:        Yup.string().required('State is required'),
  city:         Yup.string().required('City is required'),
  pincode:      Yup.string().matches(/^\d{6}$/, 'Enter valid 6-digit pincode').required('Required'),
  possession:   Yup.string().required('Possession status is required'),
})

function buildSchema(fields = {}) {
  const shape = {}
  Object.entries(fields).forEach(([key, cfg]) => {
    if (!cfg.required) return
    if (cfg.type === 'price') {
      const vk = key === 'askPrice' ? 'askPriceValue' : key === 'rent' ? 'rentValue' : 'depositValue'
      shape[vk] = Yup.number().typeError('Must be a number').positive().required(`${cfg.label} required`)
    } else if (cfg.type === 'config') {
      shape['bedroom'] = Yup.string().required('Bedroom configuration is required')
    } else if (cfg.type !== 'amenities') {
      shape[key] = Yup.string().required(`${cfg.label} is required`)
    }
  })
  return Yup.object(shape)
}

function getFieldNames(fields = {}) {
  return Object.entries(fields).flatMap(([key, cfg]) => {
    if (!cfg.required) return []
    if (cfg.type === 'price')     return [key === 'askPrice' ? 'askPriceValue' : key === 'rent' ? 'rentValue' : 'depositValue']
    if (cfg.type === 'config')    return ['bedroom']
    if (cfg.type === 'amenities') return []
    return [key]
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL VALUES
// ─────────────────────────────────────────────────────────────────────────────
const INIT = {
  // Step 1
  propertyName: '', assetType: '', address: '', area: '', state: '', city: '',
  pincode: '', possession: '', dateRangeStart: '',
  // Step 2 — all possible
  aptType: '', facing: '', age: '', floorNo: '', totalFloors: '', structure: '',
  bedroom: '', bathroom: '', balconies: '', furnishing: '', balconyFacing: '',
  sbua: '', plotArea: '', uds: '', priceSqft: '', seats: '', totalRooms: '', waterSupply: '',
  parking: '', bKhata: '', lKhata: '', eKhata: '', extraRooms: '', cornerUnit: '',
  biappa: '', exclusive: '',
  config: '',
  // Pricing
  askPriceValue: '', askPriceUnit: 'Crores',
  rentValue: '',    rentUnit: 'Lakhs',
  depositValue: '', depositUnit: 'Lakhs',
  // Step 3
  prefTenants: '', maintenance: '', commission: '', noticePeriod: '',
  petAllowed: '', nonVeg: '',
  amenities: [], description: '',
}

// ─────────────────────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const inputBase  = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-white transition-all'
const focusStyle = { borderColor: RED, boxShadow: `0 0 0 3px ${RED}18` }
const blurStyle  = { borderColor: '#e5e7eb', boxShadow: 'none' }

const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}{required && <span style={{ color: RED }}> *</span>}
  </label>
)

const Err = ({ name, formik }) =>
  formik.touched[name] && formik.errors[name]
    ? <p className="flex items-center gap-1 text-xs mt-1" style={{ color: RED }}>
        <AlertCircle className="w-3 h-3" />{formik.errors[name]}
      </p>
    : null

const TextInput = ({ name, placeholder, formik }) => (
  <>
    <input type="text" name={name} placeholder={placeholder}
      value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
      className={inputBase}
      style={formik.touched[name] && formik.errors[name] ? { borderColor: RED } : {}}
      onFocus={e => Object.assign(e.target.style, focusStyle)} />
    <Err name={name} formik={formik} />
  </>
)

const NumberInput = ({ name, placeholder, suffix, formik }) => {
  const err = formik.touched[name] && formik.errors[name]
  return (
    <>
      <div className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden bg-white"
        style={err ? { borderColor: RED } : {}}
        onFocusCapture={e => Object.assign(e.currentTarget.style, focusStyle)}
        onBlurCapture={e => Object.assign(e.currentTarget.style, blurStyle)}>
        <input type="number" name={name} placeholder={placeholder}
          value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="flex-1 px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-transparent" />
        {suffix && <span className="px-3 py-2.5 text-xs text-gray-400 bg-gray-50 border-l border-gray-200 whitespace-nowrap">{suffix}</span>}
      </div>
      <Err name={name} formik={formik} />
    </>
  )
}

const Dropdown = ({ name, placeholder, options = [], formik, onSelect }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const val = formik.values[name]
  const err = formik.touched[name] && formik.errors[name]
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const select = o => { formik.setFieldValue(name, o); formik.setFieldTouched(name, true); onSelect?.(o); setOpen(false) }
  return (
    <>
      <div className="relative" ref={ref}>
        <button type="button" onClick={() => setOpen(o => !o)}
          onBlur={() => formik.setFieldTouched(name, true)}
          className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-left"
          style={open ? focusStyle : err ? { borderColor: RED } : {}}>
          <span className={val ? 'text-gray-800' : 'text-gray-300'}>{val || placeholder}</span>
          <ChevronDown className="w-4 h-4 text-gray-300" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 mt-1 max-h-52 overflow-y-auto">
            {options.map(o => (
              <button key={o} type="button" onClick={() => select(o)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between transition-colors"
                style={{ color: val === o ? RED : '#374151' }}>
                {o}{val === o && <Check className="w-3.5 h-3.5" style={{ color: RED }} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <Err name={name} formik={formik} />
    </>
  )
}

const PriceInput = ({ fieldKey, formik }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const vn  = fieldKey === 'askPrice' ? 'askPriceValue' : fieldKey === 'rent' ? 'rentValue' : 'depositValue'
  const un  = fieldKey === 'askPrice' ? 'askPriceUnit'  : fieldKey === 'rent' ? 'rentUnit'  : 'depositUnit'
  const err = formik.touched[vn] && formik.errors[vn]
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <>
      <div className="flex items-stretch border border-gray-200 rounded-lg overflow-visible relative bg-white"
        style={err ? { borderColor: RED } : {}}
        onFocusCapture={e => Object.assign(e.currentTarget.style, focusStyle)}
        onBlurCapture={e => Object.assign(e.currentTarget.style, blurStyle)}>
        <input type="number" name={vn} placeholder="Enter amount"
          value={formik.values[vn]} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="flex-1 px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-transparent min-w-0" />
        <div className="relative flex-shrink-0" ref={ref}>
          <button type="button" onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1 px-3 py-2.5 text-xs font-semibold text-gray-600 bg-gray-50 border-l border-gray-200 rounded-r-lg h-full hover:bg-gray-100 transition-colors whitespace-nowrap">
            {formik.values[un]}<ChevronDown className="w-3 h-3" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 w-28">
              {['Thousand', 'Lakhs', 'Crores'].map(u => (
                <button key={u} type="button"
                  onClick={() => { formik.setFieldValue(un, u); setOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition-colors"
                  style={{ color: formik.values[un] === u ? RED : '#374151' }}>{u}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Err name={vn} formik={formik} />
    </>
  )
}

const YesNoInput = ({ name, formik }) => (
  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
    {['Yes', 'No'].map(v => (
      <button key={v} type="button" onClick={() => formik.setFieldValue(name, v)}
        className="flex-1 py-2.5 text-sm font-semibold transition-colors"
        style={formik.values[name] === v ? { background: RED, color: '#fff' } : { background: '#fff', color: '#374151' }}>
        {v}
      </button>
    ))}
  </div>
)

const ConfigInput = ({ formik }) => (
  <div className="flex gap-2">
    <div className="flex-1">
      <Dropdown name="bedroom" placeholder="BHK" options={BEDROOM_OPTIONS} formik={formik} />
    </div>
    {[{ name: 'bathroom', ph: 'Bathrooms' }, { name: 'balconies', ph: 'Balconies' }].map(({ name, ph }) => (
      <div key={name} className="flex-1">
        <input type="number" name={name} placeholder={ph}
          value={formik.values[name]} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputBase}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e => Object.assign(e.target.style, blurStyle)} />
      </div>
    ))}
  </div>
)

// Renders a pricing divider label for rental forms
const PricingDivider = () => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 border-t border-gray-200" />
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing Details</span>
    <div className="flex-1 border-t border-gray-200" />
  </div>
)

function renderField(key, cfg, formik) {
  // Rental pricing fields get a special divider before rent
  switch (cfg.type) {
    case 'text':      return <TextInput   name={key} placeholder={`Enter ${cfg.label}`} formik={formik} />
    case 'number':    return <NumberInput name={key} placeholder={`Enter ${cfg.label}`} suffix={cfg.suffix} formik={formik} />
    case 'dropdown':  return <Dropdown    name={key} placeholder={`Select ${cfg.label}`} options={cfg.options} formik={formik} />
    case 'yesno':     return <YesNoInput  name={key} formik={formik} />
    case 'price':     return <PriceInput  fieldKey={key} formik={formik} />
    case 'config':    return <ConfigInput formik={formik} />
    case 'amenities': return null
    default:          return <TextInput   name={key} placeholder={`Enter ${cfg.label}`} formik={formik} />
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MEDIA UPLOADS
// ─────────────────────────────────────────────────────────────────────────────
const PhotoUpload = () => {
  const ref = useRef()
  const [photos, setPhotos] = useState([])
  const add = e => { setPhotos(p => [...p, ...Array.from(e.target.files).map(f => ({ name: f.name, url: URL.createObjectURL(f) }))]); e.target.value = '' }
  const rm  = i => setPhotos(p => { URL.revokeObjectURL(p[i].url); return p.filter((_, j) => j !== i) })
  return (
    <div>
      <div onClick={() => ref.current?.click()}
        className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300 transition-colors">
        <Upload className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Add Photos</span>
        <span className="ml-auto text-xs text-gray-300">Browse</span>
      </div>
      <input ref={ref} type="file" multiple accept="image/*" className="hidden" onChange={add} />
      {photos.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              <img src={p.url} className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
              <button type="button" onClick={() => rm(i)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow">
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const VideoUpload = () => {
  const ref = useRef()
  const [video, setVideo] = useState(null)
  const add = e => { const f = e.target.files[0]; if (!f) return; if (video) URL.revokeObjectURL(video.url); setVideo({ name: f.name, url: URL.createObjectURL(f) }); e.target.value = '' }
  return (
    <div>
      {!video
        ? <div onClick={() => ref.current?.click()}
            className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300 transition-colors">
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Add Video</span>
            <span className="ml-auto text-xs text-gray-300">Browse</span>
          </div>
        : <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <video src={video.url} className="w-full h-24 object-cover" controls />
            <button type="button" onClick={() => { URL.revokeObjectURL(video.url); setVideo(null) }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
              <X className="w-3 h-3" />
            </button>
            <p className="text-[10px] text-gray-400 px-2 py-1 truncate">{video.name}</p>
          </div>
      }
      <input ref={ref} type="file" accept="video/*" className="hidden" onChange={add} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Basic Details (same for all types)
// Fields per flow: Name, Asset Type, Photos, Video, Address, State, City,
//                  Pincode, Open Map, Area, Possession
// ─────────────────────────────────────────────────────────────────────────────
const Step1 = ({ formik, tab, setTab }) => {
  const [ps, setPs] = useState('idle')

  const selState = IN_STATES.find(s => s.name === formik.values.state)
  const cities   = selState ? City.getCitiesOfState('IN', selState.isoCode).map(c => c.name) : []

  const handlePin = async e => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    formik.setFieldValue('pincode', val)
    if (val.length !== 6) { setPs('idle'); return }
    setPs('loading')
    try {
      const json = await fetch(`https://api.postalpincode.in/pincode/${val}`).then(r => r.json())
      const post = json?.[0]
      if (post?.Status === 'Success' && post.PostOffice?.length > 0) {
        const po = post.PostOffice[0]
        const st = IN_STATES.find(s => s.name.toLowerCase() === po.State.toLowerCase())
        if (st) {
          formik.setFieldValue('state', st.name)
          const cs = City.getCitiesOfState('IN', st.isoCode).map(c => c.name)
          const city = cs.find(c => c.toLowerCase() === po.District.toLowerCase())
            || cs.find(c => po.District.toLowerCase().includes(c.toLowerCase()))
            || po.District
          formik.setFieldValue('city', city)
        } else {
          formik.setFieldValue('state', po.State)
          formik.setFieldValue('city', po.District)
        }
        setPs('found')
      } else { setPs('error') }
    } catch { setPs('error') }
  }

  return (
    <div className="space-y-5">
      {/* Row 1 — Name + Asset Type */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label required>Name of Property</Label>
          <TextInput name="propertyName" placeholder="Eg. Prestige Camden Gardens" formik={formik} />
        </div>
        <div>
          <Label required>Select Asset Type</Label>
          <Dropdown name="assetType" placeholder="Select Asset Type" options={ASSET_TYPES} formik={formik} />
        </div>
      </div>

      {/* Row 2 — Photos + Video */}
      <div className="grid grid-cols-2 gap-5">
        <div><Label>Add Photos</Label><PhotoUpload /></div>
        <div><Label>Add Video</Label><VideoUpload /></div>
      </div>

      {/* Row 3 — Address */}
      <div>
        <Label required>Address</Label>
        <TextInput name="address" placeholder="Full property address" formik={formik} />
      </div>

      {/* Row 4 — Pincode, State, City, Map button */}
      <div className="grid grid-cols-4 gap-3 items-start">
        <div>
          <Label required>Pincode</Label>
          <div className="relative">
            <input type="text" name="pincode" placeholder="6-digit" maxLength={6}
              value={formik.values.pincode} onChange={handlePin} onBlur={formik.handleBlur}
              className={inputBase}
              style={formik.touched.pincode && formik.errors.pincode ? { borderColor: RED } : {}}
              onFocus={e => Object.assign(e.target.style, focusStyle)} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {ps === 'loading' && <span className="inline-block w-3.5 h-3.5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />}
              {ps === 'found'   && <Check className="w-3.5 h-3.5 text-green-500" />}
              {ps === 'error'   && <AlertCircle className="w-3.5 h-3.5" style={{ color: RED }} />}
            </span>
          </div>
          {ps === 'found' && <p className="text-xs mt-1 text-green-600">Auto-filled ✓</p>}
          {ps === 'error' && <p className="text-xs mt-1" style={{ color: RED }}>Not found</p>}
          <Err name="pincode" formik={formik} />
        </div>
        <div>
          <Label required>State</Label>
          <Dropdown name="state" placeholder="State" options={IN_STATES.map(s => s.name)} formik={formik}
            onSelect={() => { formik.setFieldValue('city', ''); setPs('idle') }} />
          <Err name="state" formik={formik} />
        </div>
        <div>
          <Label required>City</Label>
          <Dropdown name="city" placeholder={cities.length ? 'City' : 'Select state first'} options={cities} formik={formik} />
          <Err name="city" formik={formik} />
        </div>
        <button type="button"
          className="border-2 rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 mt-5 hover:opacity-80 whitespace-nowrap transition-colors"
          style={{ borderColor: RED, color: RED }}>
          <MapPin className="w-3.5 h-3.5" /> Open Map
        </button>
      </div>

      {/* Row 5 — Area + Possession */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Area</Label>
          <Dropdown name="area" placeholder="Select Area" options={AREA_OPTIONS} formik={formik} />
        </div>
        <div>
          <Label required>Select Possession</Label>
          <Dropdown name="possession" placeholder="Select Possession" options={POSSESSION_OPTIONS} formik={formik} />
        </div>
      </div>

      {/* Available From date picker */}
      {formik.values.possession === 'Available From' && (
        <div>
          <Label>Available From Date</Label>
          <input type="date" name="dateRangeStart" value={formik.values.dateRangeStart}
            onChange={formik.handleChange}
            className={inputBase}
            onFocus={e => Object.assign(e.target.style, focusStyle)}
            onBlur={e => Object.assign(e.target.style, blurStyle)} />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Property Details (dynamic, asset-specific)
// For rental types: includes pricing section inline with a divider
// ─────────────────────────────────────────────────────────────────────────────
const PRICING_FIELD_KEYS = ['rent', 'deposit', 'maintenance', 'commission']

const Step2 = ({ formik, fieldConfig, tab }) => {
  if (!fieldConfig) return (
    <div className="text-center py-12 text-gray-400">
      <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Please select an asset type in Step 1 to continue.</p>
    </div>
  )

  const allEntries = Object.entries(fieldConfig.step2)

  // Split entries into property fields and pricing fields
  const propertyEntries = allEntries.filter(([k]) => !PRICING_FIELD_KEYS.includes(k))
  const pricingEntries  = allEntries.filter(([k]) => PRICING_FIELD_KEYS.includes(k))

  const makeRows = (entries) => {
    const rows = []
    for (let i = 0; i < entries.length; i += 2) rows.push(entries.slice(i, i + 2))
    return rows
  }

  return (
    <div className="space-y-5">
      {/* Property fields */}
      {makeRows(propertyEntries).map((row, i) => (
        <div key={i} className={`grid gap-5 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {row.map(([key, cfg]) => (
            <div key={key}>
              <Label required={cfg.required}>{cfg.label}</Label>
              {renderField(key, cfg, formik)}
            </div>
          ))}
        </div>
      ))}

      {/* Pricing section for rental */}
      {pricingEntries.length > 0 && (
        <>
          <PricingDivider />
          {makeRows(pricingEntries).map((row, i) => (
            <div key={i} className={`grid gap-5 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {row.map(([key, cfg]) => (
                <div key={key}>
                  <Label required={cfg.required}>{cfg.label}</Label>
                  {renderField(key, cfg, formik)}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — More Details (dynamic)
// Includes: non-amenity fields, amenities multi-select, description (always)
// ─────────────────────────────────────────────────────────────────────────────
const Step3 = ({ formik, fieldConfig }) => {
  const [customInput, setCustomInput] = useState('')
  const [extraAmenities, setExtra]    = useState([])

  if (!fieldConfig) return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-sm">Please complete previous steps first.</p>
    </div>
  )

  const allAmenities = [...AMENITIES_LIST, ...extraAmenities]
  const fields       = fieldConfig.step3
  const hasAmenities = 'amenities' in fields
  const others       = Object.entries(fields).filter(([k]) => k !== 'amenities')
  const rows = []; for (let i = 0; i < others.length; i += 2) rows.push(others.slice(i, i + 2))

  const toggle = a => {
    const cur = formik.values.amenities
    formik.setFieldValue('amenities', cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a])
  }
  const addCustom = () => {
    const v = customInput.trim(); if (!v) return
    if (!allAmenities.includes(v)) setExtra(p => [...p, v])
    if (!formik.values.amenities.includes(v)) toggle(v)
    setCustomInput('')
  }

  return (
    <div className="space-y-6">
      {/* Non-amenity fields (khata, parking, corner unit, etc.) */}
      {rows.length > 0 && (
        <div className="space-y-5">
          {rows.map((row, i) => (
            <div key={i} className={`grid gap-5 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {row.map(([key, cfg]) => (
                <div key={key}>
                  <Label required={cfg.required}>{cfg.label}</Label>
                  {renderField(key, cfg, formik)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Amenities multi-select */}
      {hasAmenities && (
        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {allAmenities.map(a => {
              const on = formik.values.amenities.includes(a)
              return (
                <button key={a} type="button" onClick={() => toggle(a)}
                  className="flex items-center gap-2.5 border rounded-xl px-3 py-2.5 text-left font-medium transition-all"
                  style={on ? { borderColor: RED, background: `${RED}0d` } : { borderColor: '#f0f0f0', background: '#fafafa', color: '#374151' }}>
                  <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                    style={on ? { background: RED, borderColor: RED } : { borderColor: '#d1d5db' }}>
                    {on && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className="text-xs">{a}</span>
                </button>
              )
            })}
          </div>
          {/* + Add Other */}
          <div className="flex gap-2">
            <input type="text" placeholder="+ Add other amenity…" value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
              className={inputBase}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)} />
            <button type="button" onClick={addCustom}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 transition-colors"
              style={{ background: RED }}>+</button>
          </div>
        </div>
      )}

      {/* Description — always shown */}
      <div>
        <Label>Description</Label>
        <textarea name="description" placeholder="Describe the property…" rows={5}
          value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-300 outline-none resize-y transition-all"
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e => Object.assign(e.target.style, blurStyle)} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NOT AVAILABLE NOTICE
// ─────────────────────────────────────────────────────────────────────────────
const NotAvailableNotice = ({ assetType }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${RED}15` }}>
      <AlertCircle className="w-8 h-8" style={{ color: RED }} />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">Not Available for Rental</h3>
    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
      <strong>{assetType}</strong> properties cannot be listed for rental on this platform.
      Please switch to <strong>Resale</strong> or choose a different asset type.
    </p>
    <p className="mt-3 text-xs text-gray-400">
      Rental available for: <span className="font-semibold text-gray-600">Apartment · Villa</span>
    </p>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const Sidebar = ({ step, setStep, completedSteps }) => (
  <aside className="w-52 flex-shrink-0 self-start sticky top-8">
    <div className="bg-gray-50 rounded-2xl p-3 space-y-1">
      {['Basic Details', 'Property Details', 'More Details'].map((label, i) => {
        const active = step === i
        const done   = completedSteps.includes(i) && !active
        return (
          <button key={i} type="button" onClick={() => setStep(i)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left transition-all ${active ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={active ? { background: RED, color: '#fff' } : done ? { background: '#22c55e', color: '#fff' } : { border: '2px solid #e5e7eb', color: '#9ca3af' }}>
              {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </span>
            <span className="text-sm font-semibold" style={{ color: active ? RED : '#6b7280' }}>{label}</span>
          </button>
        )
      })}
    </div>
  </aside>
)

// ─────────────────────────────────────────────────────────────────────────────
// SUCCESS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-500">
        <Check className="w-8 h-8 text-white" strokeWidth={3} />
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-gray-900 mb-1">Inventory Added!</p>
        <p className="text-sm text-gray-400">Your property has been listed successfully.</p>
      </div>
      <button type="button" onClick={onClose}
        className="mt-2 text-white px-8 py-2.5 rounded-xl text-sm font-semibold"
        style={{ background: RED }}>Done</button>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AddInventory() {
  const [tab, setTab]         = useState('resale')
  const [step, setStep]       = useState(0)
  const [success, setSuccess] = useState(false)
  const [done, setDone]       = useState([])
  const [asset, setAsset]     = useState('')

  const fieldConfig    = useMemo(() => getFieldConfig(tab, asset), [tab, asset])
  const isRentalLocked = tab === 'rental' && RENTAL_NOT_AVAILABLE.includes(asset)

  const validationSchema = useMemo(() => {
    if (step === 0) return step1Schema
    if (isRentalLocked) return Yup.object({})
    const fields = step === 1 ? fieldConfig?.step2 : fieldConfig?.step3
    return buildSchema(fields || {})
  }, [step, fieldConfig, isRentalLocked])

  const formik = useFormik({
    initialValues: INIT,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: values => { console.log('Submit:', { tab, values }); setSuccess(true) },
  })

  useEffect(() => { setAsset(formik.values.assetType) }, [formik.values.assetType])

  const handleNext = async () => {
    if (isRentalLocked) { setDone(p => [...new Set([...p, step])]); setStep(s => s + 1); return }
    let names
    if (step === 0) {
      names = ['propertyName', 'assetType', 'address', 'state', 'city', 'pincode', 'possession']
    } else {
      const fields = step === 1 ? fieldConfig?.step2 : fieldConfig?.step3
      names = getFieldNames(fields || {})
    }
    names.forEach(n => formik.setFieldTouched(n, true, false))
    const errors = await formik.validateForm()
    if (!names.some(n => errors[n])) {
      setDone(p => [...new Set([...p, step])])
      setStep(s => s + 1)
    }
  }

  const handleTabChange = t => setTab(t)
  const handleReset     = () => { setSuccess(false); setStep(0); setDone([]); setAsset(''); formik.resetForm() }

  const TITLES = ['Add Inventory', 'Property Details', 'More Details']

  return (
    <div className="min-h-screen bg-white p-8" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mx-auto flex gap-8">
          <Sidebar step={step} setStep={setStep} completedSteps={done} />

          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-3 mb-7 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900">{TITLES[step]}</h1>

              {/* Resale / Rental toggle — Step 1 only */}
              {step === 0 && (
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  {['resale', 'rental'].map(t => (
                    <button key={t} type="button" onClick={() => handleTabChange(t)}
                      className="px-5 py-2 text-sm font-semibold capitalize transition-colors"
                      style={tab === t ? { background: RED, color: '#fff' } : { background: '#fff', color: '#374151' }}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Breadcrumb badges — Steps 2 & 3 */}
              {step > 0 && (
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: RED }}>
                  {tab === 'resale' ? 'Resale' : 'Rental'}
                </span>
              )}
              {step > 0 && asset && (
                <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ borderColor: RED, color: RED }}>
                  {asset}
                </span>
              )}
            </div>

            {/* Step content */}
            {step === 0 && <Step1 formik={formik} tab={tab} setTab={handleTabChange} />}
            {step === 1 && (isRentalLocked ? <NotAvailableNotice assetType={asset} /> : <Step2 formik={formik} fieldConfig={fieldConfig} tab={tab} />)}
            {step === 2 && (isRentalLocked ? <NotAvailableNotice assetType={asset} /> : <Step3 formik={formik} fieldConfig={fieldConfig} />)}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0
                ? <button type="button" onClick={() => setStep(s => s - 1)}
                    className="text-sm font-semibold px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    ← Back
                  </button>
                : <div />
              }
              {step < 2
                ? <button type="button" onClick={handleNext}
                    className="text-white font-semibold px-8 py-2.5 rounded-xl text-sm active:scale-95 transition-all"
                    style={{ background: RED }}>
                    Next →
                  </button>
                : <button type="submit"
                    className="text-white font-semibold px-8 py-2.5 rounded-xl text-sm active:scale-95 transition-all"
                    style={{ background: RED }}>
                    Add Inventory ✓
                  </button>
              }
            </div>
          </div>
        </div>
      </form>

      {success && <SuccessModal onClose={handleReset} />}
    </div>
  )
}