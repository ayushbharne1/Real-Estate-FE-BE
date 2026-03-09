/**
 * ACN Property Management — Add Inventory
 * Dynamic fields driven by (tab: resale|rental) × (assetType)
 * Forms powered by Formik + Yup
 *
 * Install deps:  npm install formik yup
 */

import { useState, useRef, useEffect, useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ChevronDown, MapPin, Check, Calendar, Upload, X, AlertCircle } from 'lucide-react'

const RED = '#E8431A'

// ─────────────────────────────────────────────────────────────────────────────
// 1.  FIELD CONFIGURATION  (the single source of truth)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * For every (tab, assetType) pair we declare which STEP-2 and STEP-3 fields
 * should appear and whether they are required.
 *
 * shape:  { fieldName: { required: bool, label: string, options?: string[] } }
 *
 * Fields not in the map simply will not render / validate.
 */

const FACING_OPTIONS   = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']
const AGE_OPTIONS      = ['Less than 1 Year', '1-5 Years', '5-10 Years', '6-10 Years', '10-15 Years', '15+ Years']
const FLOOR_OPTIONS    = ['Ground Floor', 'Lower Floor (1-5)', 'Middle Floor (6-10)', 'Higher Floor (10+)']
const FURNISHING_RES   = ['Furnished', 'Semi-Furnished', 'Unfurnished']
const STRUCTURE_OPTIONS= ['G', 'G+1', 'G+2', 'G+3', 'G+4', 'G+G+6.5']
const PARKING_OPTIONS  = ['0','1','2','3','4','5','6','7','8','9']
const BEDROOM_OPTIONS  = ['1 BHK','2 BHK','3 BHK','4 BHK','5 BHK','6 BHK']
const KHATA_OPTIONS    = ['A','B','E-Khata']
const TOTAL_FLOORS_OPT = ['1','2','3','4','5','6','7','8','9','10','11','12']
const EXTRA_ROOMS_OPT  = ['Study Room','Servant Room','Pooja Room','Store Room','None']
const BALCONY_RES      = ['East','West','North','South']
const BALCONY_RENT     = ['Outside Facing','Inside Facing (Courtyard/Amenities)','Utility/Service Balcony']
const TENANT_OPTIONS   = ['Family','Bachelor (Male)','Bachelor (Female)','Corporate','Any']
const MAINTENANCE_OPT  = ['Included','Not Included']
const COMMISSION_OPT   = ['Side by Side','From Owner','From Tenant','Shared']
const NOTICE_OPT       = ['15 Days','1 Month','2 Months','3 Months']
const AMENITIES_LIST   = ['Gym','Lifts','Water Storage','Service Lifts','Pool','Security','CCTV Surveillance',
                           'Visitor Parking','Club-house','Power Backup','Garden/Landscaping','Play Area',
                           'Cafeteria / Food Court','Maintenance Staff','Concierge Service']
const YES_NO           = ['Yes','No']

/** Returns the field-config object for the current (tab, assetType) selection. */
function getFieldConfig(tab, assetType) {
  const isResale = tab === 'resale'

  // ── SHARED helpers ─────────────────────────────────────────────────────────
  const sbua      = { label: 'SBUA', required: true, type: 'number', suffix: 'sq.ft' }
  const plotArea  = { label: 'Plot Area', required: true, type: 'number', suffix: 'sq.ft' }
  const facing    = { label: 'Door Facing', required: false, type: 'dropdown', options: FACING_OPTIONS }
  const age       = { label: 'Age of Building', required: true, type: 'dropdown', options: AGE_OPTIONS }
  const parking   = { label: 'Parking', required: true, type: 'dropdown', options: PARKING_OPTIONS }
  const floorNo   = { label: 'Floor Number', required: false, type: 'dropdown', options: FLOOR_OPTIONS }
  const structure = { label: 'Structure', required: false, type: 'dropdown', options: STRUCTURE_OPTIONS }
  const config    = { label: 'Configuration', required: true, type: 'config' }   // composite BHK+Bath+Balc
  const furnishing= (opts) => ({ label: 'Furnishing', required: true, type: 'dropdown', options: opts || FURNISHING_RES })
  const askPrice  = { label: 'Ask Price', required: true, type: 'price' }
  const priceSqft = { label: 'Price per Sqft', required: false, type: 'number' }
  const bKhata    = { label: 'Building Khata', required: false, type: 'dropdown', options: KHATA_OPTIONS }
  const lKhata    = { label: 'Land Khata', required: false, type: 'dropdown', options: KHATA_OPTIONS }
  const eKhata    = { label: 'E-Khata', required: false, type: 'yesno' }
  const cornerUnit= { label: 'Corner Unit', required: false, type: 'yesno' }
  const amenities = { label: 'Amenities', required: false, type: 'amenities' }
  const uds       = { label: 'UDS (Undivided Spaces)', required: false, type: 'number', suffix: 'sq.ft' }
  const totalRooms= { label: 'Total Rooms', required: false, type: 'number' }
  const totalFloors={ label: 'Total Floors', required: false, type: 'dropdown', options: TOTAL_FLOORS_OPT }
  const waterSupply={ label: 'Water Supply', required: false, type: 'text' }
  const seats     = { label: 'No. of Seats', required: true, type: 'number' }
  const aptType   = { label: 'Apartment Type', required: true, type: 'dropdown', options: ['Simplex','Duplex','Triplex','Penthouse'] }
  const extraRooms= { label: 'Extra Rooms', required: false, type: 'dropdown', options: EXTRA_ROOMS_OPT }
  const balconyFacing = (opts) => ({ label: 'Balcony Facing', required: false, type: 'dropdown', options: opts })

  // Rental-only fields
  const rent        = { label: 'Rent Per Month', required: true, type: 'price' }
  const deposit     = { label: 'Deposit', required: false, type: 'price' }
  const maintenance = { label: 'Maintenance', required: false, type: 'dropdown', options: MAINTENANCE_OPT }
  const commission  = { label: 'Commission Type', required: true, type: 'dropdown', options: COMMISSION_OPT }
  const noticePeriod= { label: 'Notice Period', required: false, type: 'dropdown', options: NOTICE_OPT }
  const prefTenants = { label: 'Preferred Tenants', required: true, type: 'dropdown', options: TENANT_OPTIONS }
  const petAllowed  = { label: 'Pet Allowed', required: false, type: 'yesno' }
  const nonVeg      = { label: 'Non-Veg Allowed', required: false, type: 'yesno' }

  // ── RESALE CONFIGS ─────────────────────────────────────────────────────────
  const resaleMap = {
    'Apartment': {
      step2: { aptType, sbua, facing, age, parking, floorNo, config, furnishing: furnishing(), priceSqft, askPrice },
      step3: { bKhata, lKhata, eKhata, extraRooms, amenities }
    },
    'Villa': {
      step2: { sbua, facing, structure, age, parking, config, furnishing: furnishing(), priceSqft, askPrice },
      step3: { amenities }
    },
    'Plot': {
      step2: { plotArea, facing, priceSqft, askPrice },
      step3: {}  // no amenities for Plot
    },
    'Independent House': {
      step2: { sbua, config, facing, structure, furnishing: furnishing(), age, priceSqft, askPrice },
      step3: { amenities }
    },
    'Row House': {
      step2: { sbua, config, facing, structure, furnishing: furnishing(), balconyFacing: balconyFacing(BALCONY_RES), extraRooms, priceSqft, askPrice },
      step3: { bKhata, eKhata, cornerUnit, amenities }
    },
    'Villament': {
      step2: { sbua, plotArea, facing, structure, furnishing: furnishing(), age, uds, priceSqft, askPrice },
      step3: { amenities }
    },
    'Commercial Space': {
      step2: { sbua, facing, priceSqft, askPrice },
      step3: { amenities }
    },
    'Commercial Property': {
      step2: { sbua, facing, structure, totalRooms, waterSupply, priceSqft, askPrice },
      step3: { eKhata, amenities }
    },
    'Office Space': {
      step2: { sbua, seats, facing, furnishing: furnishing(['Furnished','Plug & Play','Unfurnished']), age, floorNo, parking, priceSqft, askPrice },
      step3: { bKhata, lKhata, parking, cornerUnit, amenities }
    },
    'Retail Space': {
      step2: { sbua, plotArea, facing, totalFloors, furnishing: furnishing(['Furnished','Warm Shell','Unfurnished']), age, floorNo, priceSqft, askPrice },
      step3: { amenities }
    },
  }

  // ── RENTAL CONFIGS ─────────────────────────────────────────────────────────
  const rentalMap = {
    'Apartment': {
      step2: { aptType, sbua, facing, age, balconyFacing: balconyFacing(BALCONY_RENT), totalFloors, floorNo, config, furnishing: furnishing(), parking, rent, deposit },
      step3: { prefTenants, maintenance, commission, noticePeriod, petAllowed, nonVeg, amenities }
    },
    'Villa': {
      step2: { sbua, facing, structure, age, config, furnishing: furnishing(), rent, deposit },
      step3: { prefTenants, maintenance, commission, noticePeriod, petAllowed, nonVeg, amenities }
    },
    'Independent House': {
      // No rental observed — show minimal fields with note
      step2: { sbua, facing, config, furnishing: furnishing(), rent, deposit },
      step3: { prefTenants, commission, amenities }
    },
    'Row House': {
      step2: { sbua, facing, config, furnishing: furnishing(), rent, deposit },
      step3: { prefTenants, commission, amenities }
    },
    // Plots, Villaments — not available for rental (handled at UI level)
  }

  if (isResale) return resaleMap[assetType] || null
  return rentalMap[assetType] || null
}

// ─────────────────────────────────────────────────────────────────────────────
// 2.  YUP SCHEMA BUILDER  (derived dynamically from field config)
// ─────────────────────────────────────────────────────────────────────────────
function buildValidationSchema(step, fieldConfig) {
  if (!fieldConfig) return Yup.object({})

  const stepKey = `step${step + 1}`  // 'step1', 'step2', 'step3'

  // Step 1 is always the same
  if (step === 0) {
    return Yup.object({
      propertyName: Yup.string().required('Property name is required'),
      assetType:    Yup.string().required('Asset type is required'),
      address:      Yup.string().required('Address is required'),
      state:        Yup.string().required('State is required'),
      city:         Yup.string().required('City is required'),
      pincode:      Yup.string().matches(/^\d{6}$/, 'Enter a valid 6-digit pincode').required('Pincode is required'),
      possession:   Yup.string().required('Possession status is required'),
    })
  }

  const fields = fieldConfig[stepKey === 'step2' ? 'step2' : 'step3'] || {}
  const shape = {}

  Object.entries(fields).forEach(([key, cfg]) => {
    if (!cfg.required) return
    switch (cfg.type) {
      case 'number':
        shape[key] = Yup.number().typeError(`${cfg.label} must be a number`).positive(`${cfg.label} must be positive`).required(`${cfg.label} is required`)
        break
      case 'price':
        shape[`${key}Value`] = Yup.number().typeError(`${cfg.label} must be a number`).positive().required(`${cfg.label} is required`)
        break
      case 'config':
        shape['bedroom'] = Yup.string().required('Bedroom configuration is required')
        break
      default:
        shape[key] = Yup.string().required(`${cfg.label} is required`)
    }
  })

  return Yup.object(shape)
}

// ─────────────────────────────────────────────────────────────────────────────
// 3.  INITIAL VALUES
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_VALUES = {
  // Step 1
  propertyName: '', assetType: '', address: '', state: '', city: '', pincode: '', possession: '',
  dateRangeStart: '', dateRangeEnd: '',
  // Step 2 — all possible fields (unused ones stay empty, won't validate)
  aptType: '', sbua: '', plotArea: '', facing: '', age: '', parking: '', floorNo: '',
  bedroom: '', bathroom: '', balconies: '', furnishing: '', balconyFacing: '',
  totalFloors: '', structure: '', extraRooms: '', uds: '', totalRooms: '', waterSupply: '',
  seats: '', priceSqft: '',
  askPriceValue: '', askPriceUnit: 'Crores',
  rentValue: '', rentUnit: 'Lakhs',
  depositValue: '', depositUnit: 'Lakhs',
  // Step 3
  bKhata: '', lKhata: '', eKhata: '', cornerUnit: '',
  prefTenants: '', maintenance: '', commission: '', noticePeriod: '',
  petAllowed: '', nonVeg: '',
  amenities: [],
  description: '',
}

// ─────────────────────────────────────────────────────────────────────────────
// 4.  SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}{required && <span style={{ color: RED }}> *</span>}
  </label>
)

const FieldError = ({ msg }) =>
  msg ? (
    <p className="flex items-center gap-1 text-xs mt-1" style={{ color: RED }}>
      <AlertCircle className="w-3 h-3 flex-shrink-0" />{msg}
    </p>
  ) : null

const inputBase = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-white transition-all"
const focusStyle = { borderColor: RED, boxShadow: `0 0 0 3px ${RED}18` }
const blurStyle  = { borderColor: '#e5e7eb', boxShadow: 'none' }

const TextInput = ({ name, placeholder, formik, type = 'text' }) => {
  const hasError = formik.touched[name] && formik.errors[name]
  return (
    <>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={inputBase}
        style={hasError ? { borderColor: RED } : {}}
        onFocus={e => Object.assign(e.target.style, focusStyle)}
      />
      <FieldError msg={formik.touched[name] && formik.errors[name]} />
    </>
  )
}

const NumberInput = ({ name, placeholder, suffix, formik }) => {
  const hasError = formik.touched[name] && formik.errors[name]
  return (
    <>
      <div
        className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden bg-white"
        style={hasError ? { borderColor: RED } : {}}
        onFocusCapture={e => Object.assign(e.currentTarget.style, focusStyle)}
        onBlurCapture={e => Object.assign(e.currentTarget.style, blurStyle)}
      >
        <input
          type="number"
          name={name}
          placeholder={placeholder}
          value={formik.values[name]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="flex-1 px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-transparent"
        />
        {suffix && <span className="px-3 py-2.5 text-xs font-medium text-gray-400 bg-gray-50 border-l border-gray-200">{suffix}</span>}
      </div>
      <FieldError msg={formik.touched[name] && formik.errors[name]} />
    </>
  )
}

const Dropdown = ({ name, placeholder, options = [], formik }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const hasError = formik.touched[name] && formik.errors[name]
  const value = formik.values[name]
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          onBlur={() => formik.setFieldTouched(name, true)}
          className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-left transition-all"
          style={open ? focusStyle : hasError ? { borderColor: RED } : {}}
        >
          <span className={value ? 'text-gray-800' : 'text-gray-300'}>{value || placeholder}</span>
          <ChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 mt-1 max-h-52 overflow-y-auto">
            {options.map(o => (
              <button key={o} type="button"
                onClick={() => { formik.setFieldValue(name, o); formik.setFieldTouched(name, true); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between transition-colors"
                style={{ color: value === o ? RED : '#374151' }}>
                {o}{value === o && <Check className="w-3.5 h-3.5" style={{ color: RED }} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <FieldError msg={formik.touched[name] && formik.errors[name]} />
    </>
  )
}

const PriceInput = ({ valueName, unitName, placeholder, formik }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const hasError = formik.touched[valueName] && formik.errors[valueName]
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <>
      <div
        className="flex items-stretch border border-gray-200 rounded-lg bg-white overflow-visible relative"
        style={hasError ? { borderColor: RED } : {}}
        onFocusCapture={e => Object.assign(e.currentTarget.style, focusStyle)}
        onBlurCapture={e => Object.assign(e.currentTarget.style, blurStyle)}
      >
        <input
          type="number"
          name={valueName}
          placeholder={placeholder}
          value={formik.values[valueName]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="flex-1 px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-transparent min-w-0"
        />
        <div className="relative flex-shrink-0" ref={ref}>
          <button type="button" onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1 px-3 py-2.5 text-xs font-semibold text-gray-600 bg-gray-50 border-l border-gray-200 rounded-r-lg h-full hover:bg-gray-100 transition-colors">
            {formik.values[unitName] || 'Crores'} <ChevronDown className="w-3 h-3" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 w-28">
              {['Thousand', 'Lakhs', 'Crores'].map(u => (
                <button key={u} type="button"
                  onClick={() => { formik.setFieldValue(unitName, u); setOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition-colors"
                  style={{ color: formik.values[unitName] === u ? RED : '#374151' }}>{u}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <FieldError msg={formik.touched[valueName] && formik.errors[valueName]} />
    </>
  )
}

const YesNoInput = ({ name, formik }) => (
  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
    {['Yes', 'No'].map(v => (
      <button key={v} type="button" onClick={() => formik.setFieldValue(name, v)}
        className="flex-1 py-2 text-sm font-semibold transition-colors"
        style={formik.values[name] === v ? { background: RED, color: '#fff' } : { background: '#fff', color: '#374151' }}>
        {v}
      </button>
    ))}
  </div>
)

const ConfigInput = ({ formik }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1">
      <Dropdown name="bedroom" placeholder="BHK" options={BEDROOM_OPTIONS} formik={formik} />
    </div>
    <div className="flex-1">
      <input type="number" name="bathroom" placeholder="Bathrooms"
        value={formik.values.bathroom} onChange={formik.handleChange} onBlur={formik.handleBlur}
        className={inputBase}
        onFocus={e => Object.assign(e.target.style, focusStyle)}
        onBlur2={e => Object.assign(e.target.style, blurStyle)}
      />
    </div>
    <div className="flex-1">
      <input type="number" name="balconies" placeholder="Balconies"
        value={formik.values.balconies} onChange={formik.handleChange} onBlur={formik.handleBlur}
        className={inputBase}
        onFocus={e => Object.assign(e.target.style, focusStyle)}
      />
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// 5.  FIELD RENDERER  (renders any field from the config map)
// ─────────────────────────────────────────────────────────────────────────────
function renderField(key, cfg, formik) {
  switch (cfg.type) {
    case 'text':
      return <TextInput name={key} placeholder={`Enter ${cfg.label}`} formik={formik} />
    case 'number':
      return <NumberInput name={key} placeholder={`Enter ${cfg.label}`} suffix={cfg.suffix} formik={formik} />
    case 'dropdown':
      return <Dropdown name={key} placeholder={`Select ${cfg.label}`} options={cfg.options} formik={formik} />
    case 'yesno':
      return <YesNoInput name={key} formik={formik} />
    case 'price': {
      const unitName = key === 'askPrice' ? 'askPriceUnit' : key === 'rent' ? 'rentUnit' : 'depositUnit'
      const valName  = key === 'askPrice' ? 'askPriceValue' : key === 'rent' ? 'rentValue' : 'depositValue'
      return <PriceInput valueName={valName} unitName={unitName} placeholder="Enter amount" formik={formik} />
    }
    case 'config':
      return <ConfigInput formik={formik} />
    case 'amenities':
      return null  // handled separately in Step3
    default:
      return <TextInput name={key} placeholder={`Enter ${cfg.label}`} formik={formik} />
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6.  PHOTO / VIDEO UPLOAD
// ─────────────────────────────────────────────────────────────────────────────
const PhotoUpload = () => {
  const ref = useRef()
  const [photos, setPhotos] = useState([])  // each item: { name, url }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files)
    const newPhotos = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
    setPhotos(prev => [...prev, ...newPhotos])
    // reset input so same file can be re-added if removed
    e.target.value = ''
  }

  const removePhoto = (idx) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[idx].url)
      return prev.filter((_, i) => i !== idx)
    })
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300 transition-colors"
        onClick={() => ref.current?.click()}
      >
        <Upload className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Add Photos</span>
        <span className="ml-auto text-xs text-gray-300">Browse</span>
      </div>
      <input ref={ref} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />

      {photos.length > 0 && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {photos.map((photo, i) => (
            <div key={i} className="relative group">
              <img src={photo.url} alt={photo.name} className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow"
              >
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
  const [video, setVideo] = useState(null)  // { name, url }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (video) URL.revokeObjectURL(video.url)
    setVideo({ name: file.name, url: URL.createObjectURL(file) })
    e.target.value = ''
  }

  const removeVideo = () => {
    URL.revokeObjectURL(video.url)
    setVideo(null)
  }

  return (
    <div>
      {!video ? (
        <div
          className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300 transition-colors"
          onClick={() => ref.current?.click()}
        >
          <Upload className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Add Video</span>
          <span className="ml-auto text-xs text-gray-300">Browse</span>
        </div>
      ) : (
        <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          <video
            src={video.url}
            className="w-full h-24 object-cover"
            controls
          />
          <button
            type="button"
            onClick={removeVideo}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="text-[10px] text-gray-400 px-2 py-1 truncate">{video.name}</p>
        </div>
      )}
      <input ref={ref} type="file" accept="video/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7.  STEPS
// ─────────────────────────────────────────────────────────────────────────────
// country-state-city  →  npm install country-state-city
import { State, City } from 'country-state-city'

const ASSET_TYPES       = ['Apartment', 'Plot', 'Villa', 'Independent House', 'Commercial Space', 'Row House', 'Commercial Property', 'Villament', 'Office Space', 'Retail Space']
const POSSESSION_OPTIONS= ['Ready to Move', 'Under Construction', 'Available From']
const RENTAL_NOT_AVAILABLE = ['Plot', 'Villament']

// Derive all Indian states once
const IN_STATES = State.getStatesOfCountry('IN')  // [{ name, isoCode, ... }]

// ── Step 1 — Basic Details ────────────────────────────────────────────────────
const Step1 = ({ formik, tab, setTab }) => {
  const [pincodeStatus, setPincodeStatus] = useState('idle') // 'idle' | 'loading' | 'found' | 'error'
  const isRentalLocked = tab === 'rental' && RENTAL_NOT_AVAILABLE.includes(formik.values.assetType)

  // Derive cities whenever selected state isoCode changes
  const selectedStateObj = IN_STATES.find(s => s.name === formik.values.state)
  const cities = selectedStateObj
    ? City.getCitiesOfState('IN', selectedStateObj.isoCode).map(c => c.name)
    : []

  // Pincode autofill — India Post API (free, no key needed)
  const handlePincodeChange = async (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    formik.setFieldValue('pincode', val)

    if (val.length !== 6) {
      setPincodeStatus('idle')
      return
    }

    setPincodeStatus('loading')
    try {
      const res  = await fetch(`https://api.postalpincode.in/pincode/${val}`)
      const json = await res.json()
      const post = json?.[0]

      if (post?.Status === 'Success' && post.PostOffice?.length > 0) {
        const po       = post.PostOffice[0]
        const stateName= po.State   // e.g. "Karnataka"
        const district = po.District // e.g. "Bengaluru Urban"

        // Match state name to country-state-city library
        const matchedState = IN_STATES.find(
          s => s.name.toLowerCase() === stateName.toLowerCase()
        )

        if (matchedState) {
          formik.setFieldValue('state', matchedState.name)

          // Try to find the district/city in that state's city list
          const stateCities = City.getCitiesOfState('IN', matchedState.isoCode).map(c => c.name)
          const matchedCity = stateCities.find(
            c => c.toLowerCase() === district.toLowerCase()
          ) || stateCities.find(
            c => district.toLowerCase().includes(c.toLowerCase())
          ) || district  // fall back to raw district name

          formik.setFieldValue('city', matchedCity)
          setPincodeStatus('found')
        } else {
          // State didn't match library — still set raw values
          formik.setFieldValue('state', stateName)
          formik.setFieldValue('city', district)
          setPincodeStatus('found')
        }
      } else {
        setPincodeStatus('error')
      }
    } catch {
      setPincodeStatus('error')
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label required>Property Name</Label>
          <TextInput name="propertyName" placeholder="Eg. Prestige Camden Gardens" formik={formik} />
        </div>
        <div>
          <Label required>Asset Type</Label>
          <Dropdown name="assetType" placeholder="Select Asset Type" options={ASSET_TYPES} formik={formik} />
        </div>
      </div>

      {/* Rental not available notice */}
      {isRentalLocked && (
        <div className="flex items-center gap-2 p-3 rounded-xl border text-sm" style={{ borderColor: RED, background: `${RED}0d`, color: RED }}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span><strong>{formik.values.assetType}</strong> properties are not available for rental on this platform.</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div>
          <Label>Add Photos</Label>
          <PhotoUpload />
        </div>
        <div>
          <Label>Add Video</Label>
          <VideoUpload />
        </div>
      </div>

      <div>
        <Label required>Address</Label>
        <TextInput name="address" placeholder="Full property address" formik={formik} />
      </div>

      {/* Pincode row — pincode first, state + city auto-filled */}
      <div className="grid grid-cols-4 gap-3 items-start">

        {/* Pincode with autofill indicator */}
        <div>
          <Label required>Pincode</Label>
          <div className="relative">
            <input
              type="text"
              name="pincode"
              placeholder="6-digit pincode"
              value={formik.values.pincode}
              onChange={handlePincodeChange}
              onBlur={formik.handleBlur}
              maxLength={6}
              className={inputBase}
              style={formik.touched.pincode && formik.errors.pincode ? { borderColor: RED } : {}}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
            />
            {/* status icon inside input */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none">
              {pincodeStatus === 'loading' && (
                <span className="inline-block w-3.5 h-3.5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
              )}
              {pincodeStatus === 'found' && (
                <Check className="w-3.5 h-3.5 text-green-500" />
              )}
              {pincodeStatus === 'error' && (
                <AlertCircle className="w-3.5 h-3.5" style={{ color: RED }} />
              )}
            </span>
          </div>
          {pincodeStatus === 'error' && (
            <p className="text-xs mt-1" style={{ color: RED }}>Pincode not found</p>
          )}
          {pincodeStatus === 'found' && (
            <p className="text-xs mt-1 text-green-600">State & city auto-filled ✓</p>
          )}
          <FieldError msg={formik.touched.pincode && formik.errors.pincode} />
        </div>

        {/* State — populated from country-state-city; also auto-filled by pincode */}
        <div>
          <Label required>State</Label>
          <Dropdown
            name="state"
            placeholder="State"
            options={IN_STATES.map(s => s.name)}
            formik={{
              ...formik,
              setFieldValue: (n, v) => {
                formik.setFieldValue(n, v)
                formik.setFieldValue('city', '')   // reset city on manual state change
                setPincodeStatus('idle')
              }
            }}
          />
          <FieldError msg={formik.touched.state && formik.errors.state} />
        </div>

        {/* City — populated from country-state-city based on selected state */}
        <div>
          <Label required>City</Label>
          <Dropdown
            name="city"
            placeholder={cities.length ? 'City' : 'Select state first'}
            options={cities}
            formik={formik}
          />
          <FieldError msg={formik.touched.city && formik.errors.city} />
        </div>

        <button
          type="button"
          className="border-2 rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap transition-colors hover:opacity-80 mt-5"
          style={{ borderColor: RED, color: RED }}
        >
          <MapPin className="w-3.5 h-3.5" /> Open Map
        </button>
      </div>

      <div>
        <Label required>Possession Status</Label>
        <div className="grid grid-cols-2 gap-4">
          <Dropdown name="possession" placeholder="Select Possession" options={POSSESSION_OPTIONS} formik={formik} />
          {formik.values.possession === 'Available From' && (
            <input
              type="date"
              name="dateRangeStart"
              value={formik.values.dateRangeStart}
              onChange={formik.handleChange}
              className={inputBase}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

// Step 2 — Property Details (dynamic by asset type + tab)
const Step2 = ({ formik, fieldConfig }) => {
  if (!fieldConfig) return (
    <div className="text-center py-12 text-gray-400">
      <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Please select an asset type in Step 1 to continue.</p>
    </div>
  )

  const fields = fieldConfig.step2
  const entries = Object.entries(fields)
  // pair them into rows of 2
  const rows = []
  for (let i = 0; i < entries.length; i += 2) rows.push(entries.slice(i, i + 2))

  return (
    <div className="space-y-5">
      {rows.map((row, ri) => (
        <div key={ri} className={`grid gap-5 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {row.map(([key, cfg]) => (
            <div key={key}>
              <Label required={cfg.required}>{cfg.label}</Label>
              {renderField(key, cfg, formik)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// Step 3 — More Details (dynamic)
const Step3 = ({ formik, fieldConfig }) => {
  const [customInput, setCustomInput] = useState('')

  if (!fieldConfig) return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-sm">Please complete previous steps first.</p>
    </div>
  )

  const fields = fieldConfig.step3
  const hasAmenities = 'amenities' in fields
  const otherFields = Object.entries(fields).filter(([k]) => k !== 'amenities')

  const toggleAmenity = (a) => {
    const cur = formik.values.amenities
    formik.setFieldValue('amenities', cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a])
  }
  const addCustom = () => {
    const v = customInput.trim()
    if (!v) return
    if (!AMENITIES_LIST.includes(v)) AMENITIES_LIST.push(v)
    toggleAmenity(v)
    setCustomInput('')
  }

  // pair other fields
  const rows = []
  for (let i = 0; i < otherFields.length; i += 2) rows.push(otherFields.slice(i, i + 2))

  return (
    <div className="space-y-6">
      {/* Non-amenity fields */}
      {rows.map((row, ri) => (
        <div key={ri} className={`grid gap-5 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {row.map(([key, cfg]) => (
            <div key={key}>
              <Label required={cfg.required}>{cfg.label}</Label>
              {renderField(key, cfg, formik)}
            </div>
          ))}
        </div>
      ))}

      {/* Amenities */}
      {hasAmenities && (
        <div>
          <Label>Amenities</Label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {AMENITIES_LIST.map(a => {
              const checked = formik.values.amenities.includes(a)
              return (
                <button key={a} type="button" onClick={() => toggleAmenity(a)}
                  className="flex items-center gap-2.5 border rounded-xl px-3 py-2.5 text-sm text-left font-medium transition-all"
                  style={checked ? { borderColor: RED, background: `${RED}0d` } : { borderColor: '#f0f0f0', background: '#fafafa', color: '#374151' }}>
                  <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                    style={checked ? { background: RED, borderColor: RED } : { borderColor: '#d1d5db' }}>
                    {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <span className="text-xs">{a}</span>
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Add custom amenity…" value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              className={inputBase}
              onFocus={e => Object.assign(e.target.style, focusStyle)}
              onBlur={e => Object.assign(e.target.style, blurStyle)}
            />
            <button type="button" onClick={addCustom}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl"
              style={{ background: RED }}>+</button>
          </div>
        </div>
      )}

      {/* Description — always in Step 3 */}
      <div>
        <Label>Description</Label>
        <textarea name="description" placeholder="Describe the property…" rows={5}
          value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-300 outline-none resize-y transition-all"
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur2={e => Object.assign(e.target.style, blurStyle)}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8.  SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
const STEPS_LABELS = ['Basic Details', 'Property Details', 'More Details']

const Sidebar = ({ step, setStep, completedSteps }) => (
  <aside className="w-52 flex-shrink-0 self-start sticky top-8">
    <div className="bg-gray-50 rounded-2xl p-3 space-y-1">
      {STEPS_LABELS.map((s, i) => {
        const active = step === i
        const done   = completedSteps.includes(i)
        return (
          <button key={i} type="button" onClick={() => setStep(i)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left w-full ${active ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all"
              style={active ? { background: RED, color: '#fff' } : done ? { background: '#22c55e', color: '#fff' } : { border: '2px solid #e5e7eb', color: '#9ca3af' }}>
              {done && !active ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </span>
            <span className="text-sm font-semibold" style={active ? { color: RED } : { color: '#6b7280' }}>{s}</span>
          </button>
        )
      })}
    </div>

    {/* Legend
    <div className="mt-4 px-3 space-y-1.5">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Field markers</p>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span style={{ color: RED }}>*</span> Required field
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span className="text-gray-300">—</span> Optional field
      </div>
    </div> */}
  </aside>
)

// ─────────────────────────────────────────────────────────────────────────────
// 9.  SUCCESS MODAL
// ─────────────────────────────────────────────────────────────────────────────
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#22c55e' }}>
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
// 10.  ROOT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function AddInventory() {
  const [tab, setTab]             = useState('resale')
  const [step, setStep]           = useState(0)
  const [success, setSuccess]     = useState(false)
  const [completedSteps, setCompleted] = useState([])

  const assetTypeValue = useRef('')  // track outside formik for tab-lock check

  // Derive field config from current tab + assetType
  const [selectedAsset, setSelectedAsset] = useState('')
  const fieldConfig = useMemo(() => getFieldConfig(tab, selectedAsset), [tab, selectedAsset])

  const validationSchema = useMemo(
    () => buildValidationSchema(step, fieldConfig),
    [step, fieldConfig]
  )

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log('Submitted:', { tab, values })
      setSuccess(true)
    }
  })

  // Sync selectedAsset with formik value
  useEffect(() => {
    setSelectedAsset(formik.values.assetType)
  }, [formik.values.assetType])

  const isRentalLocked = tab === 'rental' && RENTAL_NOT_AVAILABLE.includes(formik.values.assetType)

  const handleNext = async () => {
    const errors = await formik.validateForm()
    // Mark all fields touched to show errors
    const currentStepFields = step === 0
      ? ['propertyName', 'assetType', 'address', 'state', 'city', 'pincode', 'possession']
      : Object.keys(fieldConfig?.[step === 1 ? 'step2' : 'step3'] || {})
    currentStepFields.forEach(f => formik.setFieldTouched(f, true, false))

    const hasErrors = Object.keys(errors).some(k => currentStepFields.some(f => {
      if (f === 'askPrice') return k === 'askPriceValue'
      if (f === 'rent') return k === 'rentValue'
      if (f === 'deposit') return k === 'depositValue'
      if (f === 'config') return k === 'bedroom'
      return k === f
    }))

    if (!hasErrors) {
      setCompleted(p => [...new Set([...p, step])])
      setStep(s => s + 1)
    }
  }

  const handleTabChange = (newTab) => {
    if (newTab === 'rental' && RENTAL_NOT_AVAILABLE.includes(formik.values.assetType)) {
      formik.setFieldValue('assetType', '')
      setSelectedAsset('')
    }
    setTab(newTab)
  }

  const TITLES = ['Add Inventory', 'Property Details', 'More Details']

  return (
    <div className="min-h-screen bg-white p-8" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mx-auto flex gap-8">
          <Sidebar step={step} setStep={setStep} completedSteps={completedSteps} />

          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-4 mb-7">
              <h1 className="text-2xl font-black text-gray-900">{TITLES[step]}</h1>

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

              {step > 0 && (
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: RED }}>
                  {tab === 'resale' ? 'Resale' : 'Rental'}
                </span>
              )}

              {step > 0 && selectedAsset && (
                <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ borderColor: RED, color: RED }}>
                  {selectedAsset}
                </span>
              )}
            </div>

            {/* Content */}
            {step === 0 && <Step1 formik={formik} tab={tab} setTab={handleTabChange} />}
            {step === 1 && <Step2 formik={formik} fieldConfig={fieldConfig} />}
            {step === 2 && <Step3 formik={formik} fieldConfig={fieldConfig} />}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="text-sm font-semibold px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  ← Back
                </button>
              ) : <div />}

              {step < 2 ? (
                <button type="button" onClick={handleNext}
                  disabled={isRentalLocked}
                  className="text-white font-semibold px-8 py-2.5 rounded-xl text-sm transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: RED }}>
                  Next →
                </button>
              ) : (
                <button type="submit"
                  className="text-white font-semibold px-8 py-2.5 rounded-xl text-sm transition-all active:scale-95"
                  style={{ background: RED }}>
                  Add Inventory ✓
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {success && <SuccessModal onClose={() => { setSuccess(false); setStep(0); setCompleted([]); formik.resetForm() }} />}
    </div>
  )
}