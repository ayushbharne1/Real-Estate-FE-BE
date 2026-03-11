// src/modules/inventory/InventoryFormFields.jsx
// Reusable field primitives + renderField dispatcher used by all 3 steps.

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, AlertCircle, Upload, X } from 'lucide-react'
import { UPLOAD } from 'shared/constants/app.js'

const RED = '#E8431A'

export const inputBase  = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-white transition-all'
export const focusStyle = { borderColor: RED, boxShadow: `0 0 0 3px ${RED}18` }
export const blurStyle  = { borderColor: '#e5e7eb', boxShadow: 'none' }
// Merge shared amenities + custom ones added in this session
  import { AMENITY_OPTIONS } from 'shared/constants/dropdown.js'
  // ─── Config Input (BHK + Bath + Balcony) ─────────────────────────────────────
import { BHK_OPTIONS } from 'shared/constants/dropdown.js'

// ─── Label ────────────────────────────────────────────────────────────────────
export const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
    {children}{required && <span style={{ color: RED }}> *</span>}
  </label>
)

// ─── Error ────────────────────────────────────────────────────────────────────
export const FieldError = ({ name, formik }) =>
  formik.touched[name] && formik.errors[name]
    ? <p className="flex items-center gap-1 text-xs mt-1" style={{ color: RED }}>
        <AlertCircle className="w-3 h-3" />{formik.errors[name]}
      </p>
    : null

// ─── Text Input ───────────────────────────────────────────────────────────────
export const TextInput = ({ name, placeholder, formik }) => (
  <>
    <input type="text" name={name} placeholder={placeholder}
      value={formik.values[name] ?? ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
      className={inputBase}
      style={formik.touched[name] && formik.errors[name] ? { borderColor: RED } : {}}
      onFocus={e => Object.assign(e.target.style, focusStyle)}
      onBlurCapture={e => Object.assign(e.target.style, blurStyle)} />
    <FieldError name={name} formik={formik} />
  </>
)

// ─── Number Input ─────────────────────────────────────────────────────────────
export const NumberInput = ({ name, placeholder, suffix, formik }) => {
  const err = formik.touched[name] && formik.errors[name]
  return (
    <>
      <div className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden bg-white"
        style={err ? { borderColor: RED } : {}}
        onFocusCapture={e => Object.assign(e.currentTarget.style, focusStyle)}
        onBlurCapture={e => Object.assign(e.currentTarget.style, blurStyle)}>
        <input type="number" name={name} placeholder={placeholder}
          value={formik.values[name] ?? ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="flex-1 px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-transparent" />
        {suffix && <span className="px-3 py-2.5 text-xs text-gray-400 bg-gray-50 border-l border-gray-200 whitespace-nowrap">{suffix}</span>}
      </div>
      <FieldError name={name} formik={formik} />
    </>
  )
}

// ─── Dropdown ─────────────────────────────────────────────────────────────────
// options: { value, label }[]
export const Dropdown = ({ name, placeholder, options = [], formik, onSelect }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const val = formik.values[name]
  const err = formik.touched[name] && formik.errors[name]
  const selectedLabel = options.find(o => o.value === val)?.label ?? val

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const select = o => {
    formik.setFieldValue(name, o.value)
    formik.setFieldTouched(name, true)
    onSelect?.(o.value)
    setOpen(false)
  }

  return (
    <>
      <div className="relative" ref={ref}>
        <button type="button" onClick={() => setOpen(o => !o)}
          onBlur={() => formik.setFieldTouched(name, true)}
          className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white text-left"
          style={open ? focusStyle : err ? { borderColor: RED } : {}}>
          <span className={selectedLabel ? 'text-gray-800' : 'text-gray-300'}>{selectedLabel || placeholder}</span>
          <ChevronDown className="w-4 h-4 text-gray-300 flex-shrink-0" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </button>
        {open && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 mt-1 max-h-52 overflow-y-auto">
            {options.map(o => (
              <button key={o.value} type="button" onClick={() => select(o)}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between transition-colors"
                style={{ color: val === o.value ? RED : '#374151' }}>
                {o.label}
                {val === o.value && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: RED }} />}
              </button>
            ))}
          </div>
        )}
      </div>
      <FieldError name={name} formik={formik} />
    </>
  )
}

// ─── Price Input ──────────────────────────────────────────────────────────────
// fieldKey: 'askPrice' | 'rent' | 'deposit'
export const PriceInput = ({ fieldKey, formik }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const vn = `${fieldKey}Value`
  const un = `${fieldKey}Unit`
  // Map fieldKey aliases
  const valueKey = fieldKey === 'askPrice' ? 'askPriceValue' : fieldKey === 'rent' ? 'rentValue' : 'depositValue'
  const unitKey  = fieldKey === 'askPrice' ? 'askPriceUnit'  : fieldKey === 'rent' ? 'rentUnit'  : 'depositUnit'
  const err = formik.touched[valueKey] && formik.errors[valueKey]

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const unitLabel = { LAKHS: 'Lakhs', CRORES: 'Crores', THOUSAND: 'Thousand' }

  return (
    <>
      <div className="flex items-stretch border border-gray-200 rounded-lg overflow-visible relative bg-white"
        style={err ? { borderColor: RED } : {}}
        onFocusCapture={e => Object.assign(e.currentTarget.style, focusStyle)}
        onBlurCapture={e => Object.assign(e.currentTarget.style, blurStyle)}>
        <input type="number" name={valueKey} placeholder="Enter amount"
          value={formik.values[valueKey] ?? ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className="flex-1 px-3 py-2.5 text-sm placeholder-gray-300 outline-none bg-transparent min-w-0" />
        <div className="relative flex-shrink-0" ref={ref}>
          <button type="button" onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1 px-3 py-2.5 text-xs font-semibold text-gray-600 bg-gray-50 border-l border-gray-200 rounded-r-lg h-full hover:bg-gray-100 transition-colors whitespace-nowrap">
            {unitLabel[formik.values[unitKey]] ?? formik.values[unitKey]}
            <ChevronDown className="w-3 h-3" />
          </button>
          {open && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 w-28">
              {['LAKHS', 'CRORES'].map(u => (
                <button key={u} type="button"
                  onClick={() => { formik.setFieldValue(unitKey, u); setOpen(false) }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 transition-colors"
                  style={{ color: formik.values[unitKey] === u ? RED : '#374151' }}>
                  {unitLabel[u]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <FieldError name={valueKey} formik={formik} />
    </>
  )
}

// ─── Yes/No Input ─────────────────────────────────────────────────────────────
export const YesNoInput = ({ name, formik }) => (
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



export const ConfigInput = ({ formik }) => (
  <div className="flex gap-2">
    <div className="flex-1">
      <Dropdown name="bedrooms" placeholder="BHK" options={BHK_OPTIONS} formik={formik} />
    </div>
    {[{ name: 'bathrooms', ph: 'Bathrooms' }, { name: 'balconies', ph: 'Balconies' }].map(({ name, ph }) => (
      <div key={name} className="flex-1">
        <input type="number" name={name} placeholder={ph}
          value={formik.values[name] ?? ''} onChange={formik.handleChange} onBlur={formik.handleBlur}
          className={inputBase}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlurCapture={e => Object.assign(e.target.style, blurStyle)} />
      </div>
    ))}
  </div>
)

// ─── Multi-select (Extra Rooms) ───────────────────────────────────────────────
export const MultiSelect = ({ name, options = [], formik }) => {
  const selected = formik.values[name] || []
  const toggle = v => {
    const next = selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]
    formik.setFieldValue(name, next)
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const on = selected.includes(o.value)
        return (
          <button key={o.value} type="button" onClick={() => toggle(o.value)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all"
            style={on ? { borderColor: RED, background: `${RED}0d`, color: RED } : { borderColor: '#e5e7eb', color: '#374151', background: '#fafafa' }}>
            {on && <Check className="w-3 h-3" />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Pricing Section Divider ──────────────────────────────────────────────────
export const PricingDivider = () => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 border-t border-gray-200" />
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing Details</span>
    <div className="flex-1 border-t border-gray-200" />
  </div>
)

// ─── Amenities Multi-select ───────────────────────────────────────────────────
export const AmenitiesInput = ({ formik }) => {
  const [customInput, setCustomInput] = useState('')
  const [extras, setExtras] = useState([])

  const toggle = v => {
    const cur = formik.values.amenities || []
    formik.setFieldValue('amenities', cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v])
  }
  const addCustom = () => {
    const v = customInput.trim()
    if (!v) return
    if (!extras.includes(v)) setExtras(p => [...p, v])
    const cur = formik.values.amenities || []
    if (!cur.includes(v)) formik.setFieldValue('amenities', [...cur, v])
    setCustomInput('')
  }

  
  const all = [...AMENITY_OPTIONS, ...extras.map(v => ({ value: v, label: v }))]

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {all.map(a => {
          const on = (formik.values.amenities || []).includes(a.value)
          return (
            <button key={a.value} type="button" onClick={() => toggle(a.value)}
              className="flex items-center gap-2.5 border rounded-xl px-3 py-2.5 text-left font-medium transition-all"
              style={on ? { borderColor: RED, background: `${RED}0d` } : { borderColor: '#f0f0f0', background: '#fafafa', color: '#374151' }}>
              <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                style={on ? { background: RED, borderColor: RED } : { borderColor: '#d1d5db' }}>
                {on && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </span>
              <span className="text-xs">{a.icon ? `${a.icon} ` : ''}{a.label}</span>
            </button>
          )
        })}
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="+ Add custom amenity…" value={customInput}
          onChange={e => setCustomInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          className={inputBase}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlurCapture={e => Object.assign(e.target.style, blurStyle)} />
        <button type="button" onClick={addCustom}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0"
          style={{ background: RED }}>+</button>
      </div>
    </div>
  )
}

// ─── renderField ──────────────────────────────────────────────────────────────
export function renderField(key, cfg, formik) {
  switch (cfg.type) {
    case 'text':        return <TextInput    name={key} placeholder={`Enter ${cfg.label}`} formik={formik} />
    case 'number':      return <NumberInput  name={key} placeholder={`Enter ${cfg.label}`} suffix={cfg.suffix} formik={formik} />
    case 'dropdown':    return <Dropdown     name={key} placeholder={`Select ${cfg.label}`} options={cfg.options} formik={formik} />
    case 'yesno':       return <YesNoInput   name={key} formik={formik} />
    case 'price':       return <PriceInput   fieldKey={key} formik={formik} />
    case 'config':      return <ConfigInput  formik={formik} />
    case 'multiselect': return <MultiSelect  name={key} options={cfg.options} formik={formik} />
    case 'amenities':   return null   // rendered separately by Step3
    default:            return <TextInput    name={key} placeholder={`Enter ${cfg.label}`} formik={formik} />
  }
}

// ─── Media Uploads ────────────────────────────────────────────────────────────

/**
 * PhotoUpload — manages local preview + exposes File[] via onChange
 * For Edit mode pass existingUrls (string[]) for current images
 */
export const PhotoUpload = ({ onChange, existingUrls = [], maxCount = UPLOAD.IMAGE_MAX_COUNT }) => {
  const ref = useRef()
  const [previews, setPreviews] = useState(
    existingUrls.map(url => ({ url, file: null, existing: true }))
  )

  const add = e => {
    const files = Array.from(e.target.files)
    const newPreviews = files.map(f => ({ url: URL.createObjectURL(f), file: f, existing: false }))
    const next = [...previews, ...newPreviews].slice(0, maxCount)
    setPreviews(next)
    _notify(next)
    e.target.value = ''
  }

  const remove = i => {
    const item = previews[i]
    if (!item.existing) URL.revokeObjectURL(item.url)
    const next = previews.filter((_, j) => j !== i)
    setPreviews(next)
    _notify(next)
  }

  const _notify = items => {
    onChange?.({
      newFiles:       items.filter(x => !x.existing).map(x => x.file),
      existingUrls:   items.filter(x => x.existing).map(x => x.url),
    })
  }

  const canAdd = previews.length < maxCount

  return (
    <div>
      {canAdd && (
        <div onClick={() => ref.current?.click()}
          className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300 transition-colors">
          <Upload className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">Add Photos</span>
          <span className="ml-auto text-xs text-gray-300">{previews.length}/{maxCount}</span>
        </div>
      )}
      <input ref={ref} type="file" multiple accept="image/jpeg,image/png,image/webp" className="hidden" onChange={add} />
      {previews.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((p, i) => (
            <div key={i} className="relative">
              <img src={p.url} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
              <button type="button" onClick={() => remove(i)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow">
                <X className="w-2.5 h-2.5" />
              </button>
              {p.existing && <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center bg-black/40 text-white rounded-b-lg">saved</span>}
            </div>
          ))}
        </div>
      )}
      {previews.length >= maxCount && (
        <p className="text-xs text-gray-400 mt-1">Maximum {maxCount} photos reached</p>
      )}
    </div>
  )
}

/**
 * VideoUpload — manages single video preview + exposes File via onChange
 * For Edit mode pass existingUrl (string) for current video
 */
export const VideoUpload = ({ onChange, existingUrl = null }) => {
  const ref = useRef()
  const [video, setVideo] = useState(existingUrl ? { url: existingUrl, file: null, existing: true } : null)
  const [removeFlag, setRemoveFlag] = useState(false)

  const add = e => {
    const f = e.target.files[0]
    if (!f) return
    if (video && !video.existing) URL.revokeObjectURL(video.url)
    const next = { url: URL.createObjectURL(f), file: f, existing: false }
    setVideo(next)
    setRemoveFlag(false)
    onChange?.({ file: f, removeVideo: false })
    e.target.value = ''
  }

  const remove = () => {
    if (video && !video.existing) URL.revokeObjectURL(video.url)
    setVideo(null)
    setRemoveFlag(true)
    onChange?.({ file: null, removeVideo: true })
  }

  return (
    <div>
      {!video
        ? <div onClick={() => ref.current?.click()}
            className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-3 cursor-pointer hover:border-orange-300 transition-colors">
            <Upload className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Add Video</span>
            <span className="ml-auto text-xs text-gray-300">max 100MB</span>
          </div>
        : <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <video src={video.url} className="w-full h-24 object-cover" controls />
            <button type="button" onClick={remove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
              <X className="w-3 h-3" />
            </button>
            {video.existing && <p className="text-[10px] text-gray-400 px-2 py-1">Existing video</p>}
          </div>
      }
      <input ref={ref} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={add} />
    </div>
  )
}