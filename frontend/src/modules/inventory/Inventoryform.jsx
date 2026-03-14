// src/modules/inventory/InventoryForm.jsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import {
  createProperty, updateProperty,
  clearSaveState,
  selectSaving, selectSaveError, selectSaveSuccess,
} from '../../redux/slices/inventoryslice'
import { buildFormData } from '../../api/inventoryApi'
import {
  getFieldConfig, buildStepSchema, getStepFieldNames,
  step1Schema, buildSubmitPayload, isRentalLocked, INITIAL_VALUES,
} from './inventoryUtils'
import {
  Step1, Step2, Step3,
  NotAvailableNotice, FormSidebar, SuccessModal,
} from './Inventorysteps'
import { LISTING_TYPE_OPTIONS } from 'shared/constants/dropdown.js'
import { ListingType } from 'shared/enums/index.js'
import { getAssetTypeOptions } from './inventoryUtils'

const RED = '#E8431A'
const STEP_TITLES = ['Add Inventory', 'Property Details', 'More Details']
const EDIT_TITLES = ['Edit Property', 'Property Details', 'More Details']

export default function InventoryForm({
  mode = 'add',
  initialValues,
  propertyId,
  existingImages   = [],
  existingVideoUrl = null,
  onSuccess,
}) {
  const dispatch    = useDispatch()
  const saving      = useSelector(selectSaving)
  const saveError   = useSelector(selectSaveError)
  const saveSuccess = useSelector(selectSaveSuccess)

  const [step, setStep]               = useState(0)
  const [done, setDone]               = useState([])
  const [showSuccess, setShowSuccess] = useState(false)

  const [listingType, setListingType] = useState(
    initialValues?.listingType ?? ListingType.RESALE
  )
  const [assetType, setAssetType] = useState(initialValues?.assetType ?? '')

  const locked      = isRentalLocked(listingType, assetType)
  const fieldConfig = useMemo(() => getFieldConfig(listingType, assetType), [listingType, assetType])

  const currentStepSchema = useMemo(() => {
    if (step === 0) return step1Schema
    if (locked) return null
    const fields = step === 1 ? fieldConfig?.step2 : fieldConfig?.step3
    return buildStepSchema(fields || {})
  }, [step, fieldConfig, locked])

  const mediaRef = useRef({
    newImageFiles:  [],
    existingImages: existingImages,
    videoFile:      null,
    removeVideo:    false,
  })

  const formik = useFormik({
    initialValues:      initialValues ?? INITIAL_VALUES,
    validateOnChange:   true,
    validateOnBlur:     true,
    enableReinitialize: true,
    onSubmit: async values => {
      // This only runs when the submit button (type="submit") is clicked on step 2
      const payload = buildSubmitPayload(values)
      const media   = mediaRef.current

      const fd = buildFormData(
        payload,
        media.newImageFiles,
        media.videoFile,
        mode === 'edit' ? media.existingImages : null,
      )

      if (mode === 'edit' && media.removeVideo) {
        fd.append('removeVideo', 'true')
      }

      if (mode === 'edit') {
        dispatch(updateProperty({ id: propertyId, formData: fd }))
      } else {
        dispatch(createProperty(fd))
      }
    },
  })

  // Sync local state from formik values
  useEffect(() => { setListingType(formik.values.listingType) }, [formik.values.listingType])
  useEffect(() => { setAssetType(formik.values.assetType)     }, [formik.values.assetType])

  useEffect(() => { if (saveSuccess) setShowSuccess(true) }, [saveSuccess])
  useEffect(() => () => { dispatch(clearSaveState()) }, [dispatch])

  // ── Step navigation — NEVER triggers formik.submitForm() ────────────────────
  const handleNext = async (e) => {
    // Prevent any bubbling that could reach the form's submit handler
    if (e && e.preventDefault) e.preventDefault()
    if (e && e.stopPropagation) e.stopPropagation()

    if (locked) { markDone(step); setStep(s => s + 1); return }

    let fieldNames
    if (step === 0) {
      fieldNames = ['name', 'assetType', 'listingType', 'address', 'state', 'city', 'pincode', 'possession']
    } else {
      const fields = step === 1 ? fieldConfig?.step2 : fieldConfig?.step3
      fieldNames = getStepFieldNames(fields || {})
    }

    const touchObj = {}
    fieldNames.forEach(n => { touchObj[n] = true })
    await formik.setTouched({ ...formik.touched, ...touchObj }, false)

    if (!currentStepSchema) {
      markDone(step); setStep(s => s + 1); return
    }

    try {
      const stepValues = {}
      fieldNames.forEach(n => { stepValues[n] = formik.values[n] })
      await currentStepSchema.validate(stepValues, { abortEarly: false })
      markDone(step)
      setStep(s => s + 1)
    } catch (validationError) {
      const errors = {}
      validationError.inner?.forEach(e => { if (e.path) errors[e.path] = e.message })
      formik.setErrors({ ...formik.errors, ...errors })
    }
  }

  const markDone = s => setDone(p => [...new Set([...p, s])])

  const handleReset = () => {
    setShowSuccess(false)
    dispatch(clearSaveState())
    setStep(0)
    setDone([])
    formik.resetForm()
    mediaRef.current = { newImageFiles: [], existingImages, videoFile: null, removeVideo: false }
    onSuccess?.()
  }

  const titles = mode === 'edit' ? EDIT_TITLES : STEP_TITLES

  return (
    <div className="min-h-screen bg-white p-8" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <form onSubmit={formik.handleSubmit}>
        <div className="w-full mx-auto flex gap-8">
          <FormSidebar step={step} setStep={setStep} completedSteps={done} />

          <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex items-center gap-3 mb-7 flex-wrap">
              <h1 className="text-2xl font-black text-gray-900">{titles[step]}</h1>

              {step === 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    {LISTING_TYPE_OPTIONS.map(opt => (
                      <button key={opt.value} type="button"
                        onClick={() => {
                          formik.setFieldValue('listingType', opt.value)
                          const valid = getAssetTypeOptions(opt.value).map(o => o.value)
                          if (!valid.includes(formik.values.assetType)) {
                            formik.setFieldValue('assetType', '')
                            formik.setFieldError('assetType', undefined)
                            formik.setFieldTouched('assetType', false, false)
                          }
                        }}
                        className="px-5 py-2 text-sm font-semibold transition-colors"
                        style={formik.values.listingType === opt.value
                          ? { background: RED, color: '#fff' }
                          : { background: '#fff', color: '#374151' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {listingType === ListingType.RENTAL && (
                    <span className="text-xs text-gray-400">Apartment & Villa only</span>
                  )}
                </div>
              )}

              {step > 0 && (
                <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: RED }}>
                  {listingType === ListingType.RESALE ? 'Resale' : 'Rental'}
                </span>
              )}
              {step > 0 && assetType && (
                <span className="text-xs font-bold px-3 py-1 rounded-full border" style={{ borderColor: RED, color: RED }}>
                  {assetType}
                </span>
              )}
            </div>

            {/* API error from slice */}
            {saveError && (
              <div className="mb-5 p-3 rounded-xl border text-sm"
                style={{ borderColor: RED, background: `${RED}08`, color: RED }}>
                {saveError}
              </div>
            )}

            {/* Step content */}
            {step === 0 && (
              <Step1
                formik={formik}
                existingImages={existingImages}
                existingVideoUrl={existingVideoUrl}
                onPhotosChange={({ newFiles, existingUrls }) => {
                  mediaRef.current.newImageFiles  = newFiles
                  mediaRef.current.existingImages = existingUrls
                }}
                onVideoChange={({ file, removeVideo }) => {
                  mediaRef.current.videoFile   = file
                  mediaRef.current.removeVideo = removeVideo
                }}
              />
            )}
            {step === 1 && (locked
              ? <NotAvailableNotice assetType={assetType} />
              : <Step2 formik={formik} fieldConfig={fieldConfig} />
            )}
            {step === 2 && (locked
              ? <NotAvailableNotice assetType={assetType} />
              : <Step3 formik={formik} fieldConfig={fieldConfig} />
            )}

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
                : <button type="submit" disabled={saving}
                    className="text-white font-semibold px-8 py-2.5 rounded-xl text-sm active:scale-95 transition-all disabled:opacity-60"
                    style={{ background: RED }}>
                    {saving ? 'Saving…' : mode === 'edit' ? 'Save Changes ✓' : 'Add Inventory ✓'}
                  </button>
              }
            </div>
          </div>
        </div>
      </form>

      {showSuccess && <SuccessModal mode={mode} onClose={handleReset} />}
    </div>
  )
}