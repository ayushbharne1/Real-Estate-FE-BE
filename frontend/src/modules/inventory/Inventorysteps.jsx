// src/modules/inventory/InventorySteps.jsx

import { useState } from 'react'
import { State, City } from 'country-state-city'
import { MapPin, AlertCircle, Check } from 'lucide-react'
import {
  Label, FieldError, TextInput, Dropdown, PricingDivider,
  PhotoUpload, VideoUpload, AmenitiesInput, renderField,
  MapPickerModal,
  inputBase, focusStyle, blurStyle,
} from './InventoryFormFields'
import { POSSESSION_OPTIONS } from 'shared/constants/dropdown.js'
import { getAssetTypeOptions, PRICING_KEYS } from './inventoryUtils'

const RED = '#E8431A'
const IN_STATES = State.getStatesOfCountry('IN')

function makeRows(entries) {
  const rows = []
  for (let i = 0; i < entries.length; i += 2) rows.push(entries.slice(i, i + 2))
  return rows
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 — Basic Details
// ─────────────────────────────────────────────────────────────────────────────
export const Step1 = ({ formik, onPhotosChange, onVideoChange, existingImages = [], existingVideoUrl = null }) => {
  const [pincodeStatus, setPincodeStatus] = useState('idle')
  const [showMap,       setShowMap]       = useState(false)

  const listingType  = formik.values.listingType
  const assetOptions = getAssetTypeOptions(listingType)

  const selState    = IN_STATES.find(s => s.name === formik.values.state)
  const cities      = selState ? City.getCitiesOfState('IN', selState.isoCode).map(c => c.name) : []
  const cityOptions = cities.map(c => ({ value: c, label: c }))

  // ── Pincode auto-fill via postal API ─────────────────────────────────────
  const handlePin = async e => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
    formik.setFieldValue('pincode', val)
    if (val.length !== 6) { setPincodeStatus('idle'); return }
    setPincodeStatus('loading')
    try {
      const json = await fetch(`https://api.postalpincode.in/pincode/${val}`).then(r => r.json())
      const post = json?.[0]
      if (post?.Status === 'Success' && post.PostOffice?.length > 0) {
        const po = post.PostOffice[0]
        const st = IN_STATES.find(s => s.name.toLowerCase() === po.State.toLowerCase())
        if (st) {
          formik.setFieldValue('state', st.name)
          const cs   = City.getCitiesOfState('IN', st.isoCode).map(c => c.name)
          const city = cs.find(c => c.toLowerCase() === po.District.toLowerCase())
            || cs.find(c => po.District.toLowerCase().includes(c.toLowerCase()))
            || po.District
          formik.setFieldValue('city', city)
        } else {
          formik.setFieldValue('state', po.State)
          formik.setFieldValue('city',  po.District)
        }
        formik.setFieldError('pincode', undefined)
        formik.setFieldTouched('pincode', false, false)
        setPincodeStatus('found')
      } else {
        setPincodeStatus('error')
      }
    } catch {
      setPincodeStatus('error')
    }
  }

  // ── Map confirm — fills address, pincode, state, city ────────────────────
  // Nominatim state names may differ slightly from country-state-city library
  // (e.g. "Odisha" vs "Orissa") so we do a fuzzy normalised match.
  const handleMapConfirm = ({ address, pincode, city, state }) => {
    if (address) formik.setFieldValue('address', address)

    if (pincode) {
      formik.setFieldValue('pincode', pincode)
      formik.setFieldError('pincode', undefined)
      formik.setFieldTouched('pincode', false, false)
      setPincodeStatus('found')
    }

    if (state) {
      const norm    = s => s.toLowerCase().replace(/\s+/g, '')
      const matched = IN_STATES.find(s =>
        norm(s.name) === norm(state) ||
        norm(s.name).includes(norm(state)) ||
        norm(state).includes(norm(s.name))
      )
      const stateName = matched?.name || state
      formik.setFieldValue('state', stateName)

      if (city) {
        if (matched) {
          const stateCities = City.getCitiesOfState('IN', matched.isoCode).map(c => c.name)
          const matchedCity = stateCities.find(c =>
            norm(c) === norm(city) ||
            norm(city).includes(norm(c)) ||
            norm(c).includes(norm(city))
          )
          formik.setFieldValue('city', matchedCity || city)
        } else {
          formik.setFieldValue('city', city)
        }
      }
    } else if (city) {
      formik.setFieldValue('city', city)
    }

    setShowMap(false)
  }

  return (
    <>
      <div className="space-y-5">
        {/* Name + Asset Type */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label required>Name of Property</Label>
            <TextInput name="name" placeholder="Eg. Prestige Camden Gardens" formik={formik} />
          </div>
          <div>
            <Label required>Select Asset Type</Label>
            <Dropdown
              name="assetType"
              placeholder="Select Asset Type"
              options={assetOptions}
              formik={formik}
            />
          </div>
        </div>

        {/* Photos + Video */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label>Add Photos <span className="text-gray-400 font-normal normal-case">(max 10)</span></Label>
            <PhotoUpload onChange={onPhotosChange} existingUrls={existingImages} />
          </div>
          <div>
            <Label>Add Video <span className="text-gray-400 font-normal normal-case">(max 1, 100MB)</span></Label>
            <VideoUpload onChange={onVideoChange} existingUrl={existingVideoUrl} />
          </div>
        </div>

        {/* Address */}
        <div>
          <Label required>Address</Label>
          <TextInput name="address" placeholder="Full property address" formik={formik} />
        </div>

        {/* Pincode / State / City / Open Map */}
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
                {pincodeStatus === 'loading' && <span className="inline-block w-3.5 h-3.5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />}
                {pincodeStatus === 'found'   && <Check className="w-3.5 h-3.5 text-green-500" />}
                {pincodeStatus === 'error'   && <AlertCircle className="w-3.5 h-3.5" style={{ color: RED }} />}
              </span>
            </div>
            {pincodeStatus === 'found' && <p className="text-xs mt-1 text-green-600">Auto-filled ✓</p>}
            {pincodeStatus === 'error' && <p className="text-xs mt-1" style={{ color: RED }}>Not found</p>}
            <FieldError name="pincode" formik={formik} />
          </div>

          <div>
            <Label required>State</Label>
            <Dropdown name="state" placeholder="State"
              options={IN_STATES.map(s => ({ value: s.name, label: s.name }))}
              formik={formik}
              onSelect={() => formik.setFieldValue('city', '')} />
          </div>

          <div>
            <Label required>City</Label>
            <Dropdown name="city"
              placeholder={cityOptions.length ? 'City' : 'Select state first'}
              options={cityOptions}
              formik={formik} />
          </div>

          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="border-2 rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 mt-5 hover:opacity-80 whitespace-nowrap transition-all active:scale-95"
            style={{ borderColor: RED, color: RED }}
          >
            <MapPin className="w-3.5 h-3.5" /> Open Map
          </button>
        </div>

        {/* Area + Possession */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <Label>Area / Locality</Label>
            <TextInput name="area" placeholder="Eg. Whitefield, Koramangala" formik={formik} />
          </div>
          <div>
            <Label required>Select Possession</Label>
            <Dropdown name="possession" placeholder="Select Possession" options={POSSESSION_OPTIONS} formik={formik} />
          </div>
        </div>
      </div>

      {/* Map modal — outside the form grid to avoid z-index clipping */}
      {showMap && (
        <MapPickerModal
          initialAddress={formik.values.address || ''}
          onClose={() => setShowMap(false)}
          onConfirm={handleMapConfirm}
        />
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — Property Details
// ─────────────────────────────────────────────────────────────────────────────
export const Step2 = ({ formik, fieldConfig }) => {
  if (!fieldConfig) return (
    <div className="text-center py-12 text-gray-400">
      <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">Please select an asset type in Step 1 to continue.</p>
    </div>
  )

  const allEntries      = Object.entries(fieldConfig.step2)
  const propertyEntries = allEntries.filter(([k]) => !PRICING_KEYS.has(k))
  const pricingEntries  = allEntries.filter(([k]) =>  PRICING_KEYS.has(k))

  return (
    <div className="space-y-5">
      {makeRows(propertyEntries).map((row, i) => (
        <div key={i} className={`grid gap-5 ${row.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {row.map(([key, cfg]) => (
            <div key={key} className={cfg.type === 'config' ? 'col-span-2' : ''}>
              <Label required={cfg.required}>{cfg.label}</Label>
              {renderField(key, cfg, formik)}
            </div>
          ))}
        </div>
      ))}

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
// STEP 3 — More Details
// ─────────────────────────────────────────────────────────────────────────────
export const Step3 = ({ formik, fieldConfig }) => {
  if (!fieldConfig) return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-sm">Please complete previous steps first.</p>
    </div>
  )

  const fields       = fieldConfig.step3
  const hasAmenities = 'amenities' in fields
  const others       = Object.entries(fields).filter(([k]) => k !== 'amenities')

  return (
    <div className="space-y-6">
      {others.length > 0 && (
        <div className="space-y-5">
          {makeRows(others).map((row, i) => (
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

      {hasAmenities && (
        <div>
          <Label>Amenities</Label>
          <AmenitiesInput formik={formik} />
        </div>
      )}

      <div>
        <Label>Description</Label>
        <textarea name="description" placeholder="Describe the property…" rows={5}
          value={formik.values.description ?? ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm placeholder-gray-300 outline-none resize-y transition-all"
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlurCapture={e => Object.assign(e.target.style, blurStyle)} />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NOT AVAILABLE NOTICE
// ─────────────────────────────────────────────────────────────────────────────
export const NotAvailableNotice = ({ assetType }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${RED}15` }}>
      <AlertCircle className="w-8 h-8" style={{ color: RED }} />
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">Not Available for Rental</h3>
    <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
      <strong>{assetType}</strong> cannot be listed for rental.
      Please switch to <strong>Resale</strong> or select Apartment / Villa.
    </p>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
export const FormSidebar = ({ step, setStep, completedSteps }) => (
  <aside className="w-52 flex-shrink-0 self-start sticky top-8">
    <div className="bg-gray-50 rounded-2xl p-3 space-y-1">
      {['Basic Details', 'Property Details', 'More Details'].map((label, i) => {
        const active = step === i
        const done   = completedSteps.includes(i) && !active
        return (
          <button key={i} type="button" onClick={() => setStep(i)}
            className="flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left transition-all"
            style={active ? { background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.08)' } : {}}>
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
export const SuccessModal = ({ mode = 'add', onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-500">
        <Check className="w-8 h-8 text-white" strokeWidth={3} />
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-gray-900 mb-1">
          {mode === 'edit' ? 'Property Updated!' : 'Inventory Added!'}
        </p>
        <p className="text-sm text-gray-400">
          {mode === 'edit' ? 'Changes saved successfully.' : 'Your property has been listed successfully.'}
        </p>
      </div>
      <button type="button" onClick={onClose}
        className="mt-2 text-white px-8 py-2.5 rounded-xl text-sm font-semibold"
        style={{ background: RED }}>Done</button>
    </div>
  </div>
)