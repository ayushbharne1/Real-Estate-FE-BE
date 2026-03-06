import { useState, useRef, useEffect } from 'react'
import { ChevronDown, MapPin, Check, Calendar } from 'lucide-react'

const RED = '#E8431A'

// ── Shared UI ──────────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-sm text-gray-600 mb-1.5 font-medium">
    {children}{required && <span style={{ color: RED }}> *</span>}
  </label>
)

const TextInput = ({ placeholder, value, onChange, type = 'text' }) => (
  <input type={type} placeholder={placeholder} value={value} onChange={onChange}
    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 outline-none bg-white"
    onFocus={e => { e.target.style.borderColor = RED; e.target.style.boxShadow = `0 0 0 3px ${RED}18` }}
    onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }} />
)

const Dropdown = ({ placeholder, options = [], value, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white text-left"
        style={open ? { borderColor: RED, boxShadow: `0 0 0 3px ${RED}18` } : {}}>
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>{value || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-30 mt-1 max-h-52 overflow-y-auto">
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false) }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 flex items-center justify-between"
              style={{ color: value === o ? RED : '#374151' }}>
              {o}{value === o && <Check className="w-3.5 h-3.5" style={{ color: RED }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const PriceInput = ({ placeholder, value, onChange, unit, onUnitChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div className="flex items-stretch border border-gray-300 rounded-lg bg-white relative overflow-visible"
      onFocusCapture={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}18` }}
      onBlurCapture={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none' }}>
      <input type="number" placeholder={placeholder} value={value} onChange={onChange}
        className="flex-1 px-3 py-2.5 text-sm placeholder-gray-400 outline-none bg-transparent min-w-0" />
      <div className="relative flex-shrink-0" ref={ref}>
        <button type="button" onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1 px-3 py-2.5 text-sm text-gray-700 bg-gray-100 border-l border-gray-300 rounded-r-lg h-full">
          {unit || 'Lakhs'} <ChevronDown className="w-3 h-3" />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-30 w-28">
            {['Thousand', 'Lakhs', 'Crores'].map(u => (
              <button key={u} type="button" onClick={() => { onUnitChange(u); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50"
                style={{ color: unit === u ? RED : '#374151' }}>{u}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const NumberInput = ({ placeholder, value, onChange, suffix }) => (
  <div className="flex items-stretch border border-gray-300 rounded-lg overflow-hidden bg-white"
    onFocusCapture={e => { e.currentTarget.style.borderColor = RED; e.currentTarget.style.boxShadow = `0 0 0 3px ${RED}18` }}
    onBlurCapture={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none' }}>
    <input type="number" placeholder={placeholder} value={value} onChange={onChange}
      className="flex-1 px-3 py-2.5 text-sm placeholder-gray-400 outline-none bg-transparent" />
    {suffix && <span className="px-3 py-2.5 text-sm text-gray-500 bg-gray-100 border-l border-gray-300">{suffix}</span>}
  </div>
)

const YesNo = ({ value, onChange }) => (
  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
    {['Yes', 'No'].map(v => (
      <button key={v} type="button" onClick={() => onChange(v)}
        className="px-5 py-2 text-sm font-semibold transition-colors"
        style={value === v ? { background: RED, color: '#fff' } : { background: '#fff', color: '#374151' }}>
        {v}
      </button>
    ))}
  </div>
)

// ── Photo / Video Upload ───────────────────────────────────────────────────────
const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=60',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=80&q=60',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=80&q=60',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=80&q=60',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&q=60',
]
const PhotoUpload = () => {
  const ref = useRef()
  return (
    <div>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
        <span className="px-4 py-2.5 text-sm text-gray-600 bg-white">Add Photos</span>
        <button onClick={() => ref.current?.click()} className="px-4 py-2.5 text-sm bg-gray-200 text-gray-700 font-medium hover:bg-gray-300">Browse</button>
      </div>
      <input ref={ref} type="file" multiple accept="image/*" className="hidden" />
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {SAMPLE_PHOTOS.map((src, i) => (
          <div key={i}>
            <img src={src} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
            <p className="text-[9px] text-gray-400 text-center mt-0.5">Photo 0{i + 1}.jpg</p>
          </div>
        ))}
        <div className="w-14 h-14 rounded-lg bg-gray-700 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-gray-800">+4</div>
      </div>
    </div>
  )
}
const VideoUpload = () => {
  const ref = useRef()
  return (
    <div>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
        <span className="px-4 py-2.5 text-sm text-gray-600 bg-white">Add Video</span>
        <button onClick={() => ref.current?.click()} className="px-4 py-2.5 text-sm bg-gray-200 text-gray-700 font-medium hover:bg-gray-300">Browse</button>
      </div>
      <input ref={ref} type="file" accept="video/*" className="hidden" />
      <div className="mt-2">
        <img src={SAMPLE_PHOTOS[0]} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
        <p className="text-[9px] text-gray-400 text-center mt-0.5">Video 10sec</p>
      </div>
    </div>
  )
}

// ── Date Range Picker ──────────────────────────────────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
function getDays(y, m) { return { first: new Date(y, m, 1).getDay(), total: new Date(y, m + 1, 0).getDate() } }
const DateRangePicker = ({ value, onChange }) => {
  const today = new Date()
  const [ly, setLy] = useState(today.getFullYear())
  const [lm, setLm] = useState(today.getMonth())
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(null)
  const ref = useRef()
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  const rm = (lm + 1) % 12, ry = lm === 11 ? ly + 1 : ly
  const prev = () => { lm === 0 ? (setLm(11), setLy(y => y - 1)) : setLm(m => m - 1) }
  const next = () => { lm === 11 ? (setLm(0), setLy(y => y + 1)) : setLm(m => m + 1) }
  const ds = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  const handleDay = (y, m, d) => {
    const s = ds(y, m, d)
    if (!value.start || (value.start && value.end)) onChange({ start: s, end: null })
    else if (s < value.start) onChange({ start: s, end: value.start })
    else onChange({ start: value.start, end: s })
  }
  const inRange = (y, m, d) => { const s = ds(y, m, d), end = value.end || hovered; return value.start && end && s > value.start && s < end }
  const fmt = s => { if (!s) return ''; const [y, mo, d] = s.split('-'); return `${d}/${mo}/${y}` }
  const renderMonth = (year, month) => {
    const { first, total } = getDays(year, month), cells = []
    for (let i = 0; i < first; i++) cells.push(<div key={`e${i}`} />)
    for (let d = 1; d <= total; d++) {
      const s = ds(year, month, d), isS = s === value.start, isE = s === value.end, inR = inRange(year, month, d)
      cells.push(
        <button key={d} type="button" onClick={() => handleDay(year, month, d)} onMouseEnter={() => setHovered(s)}
          className="w-8 h-8 flex items-center justify-center text-xs font-medium"
          style={isS || isE ? { background: RED, color: '#fff', borderRadius: '50%' } : inR ? { background: `${RED}22`, borderRadius: 0 } : { color: '#374151' }}>
          {d}
        </button>
      )
    }
    return (
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2 text-center">{MONTH_NAMES[month]} {year}</p>
        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <div key={d} className="w-8 h-6 flex items-center justify-center text-[10px] text-gray-400 font-semibold">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">{cells}</div>
      </div>
    )
  }
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white text-left"
        style={open ? { borderColor: RED, boxShadow: `0 0 0 3px ${RED}18` } : {}}>
        <span className={value.start ? 'text-gray-800' : 'text-gray-400'}>
          {value.start ? `${fmt(value.start)}${value.end ? ' – ' + fmt(value.end) : ''}` : 'Select Date Range'}
        </span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-white border border-gray-200 rounded-xl shadow-2xl z-40 mt-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"><ChevronDown className="w-4 h-4 rotate-90" /></button>
            <span />
            <button type="button" onClick={next} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100"><ChevronDown className="w-4 h-4 -rotate-90" /></button>
          </div>
          <div className="flex gap-6">{renderMonth(ly, lm)}{renderMonth(ry, rm)}</div>
        </div>
      )}
    </div>
  )
}

// ── DATA ───────────────────────────────────────────────────────────────────────
const ASSET_TYPES = ['Apartment', 'Plot', 'Villa', 'Independent House', 'Commercial Space', 'Row House', 'Commercial Property', 'Villament', 'Office Space', 'Retail Space']
const STATES = ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh']
const CITIES_BY_STATE = {
  'Madhya Pradesh': ['Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Gwalior', 'Indore', 'Jabalpur'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belagavi'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
  default: ['City 1', 'City 2', 'City 3'],
}
const POSSESSION_OPTIONS = ['Handover/Availability Status', 'Ready to Move', 'Under Construction', 'Available From']
const APT_TYPES = ['Simplex', 'Duplex', 'Triplex', 'Penthouse']
const DOOR_FACING = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West']
const AGE_OPTIONS = ['Less than 1 Year', '1-5 Years', '5-10 Years', '10+ Years']
const FLOOR_OPTIONS = ['Ground Floor', 'Lower Floor (1-3)', 'Mid Floor (4-9)', 'Higher Floor (10+)']
const PARKING_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const FURNISHING_OPTIONS = ['Furnished', 'Unfurnished', 'Semi-Furnished']
const BEDROOM_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '6 BHK']
// Resale specific
const BALCONY_FACING_RESALE = ['East', 'West', 'North', 'South']
// Rental specific
const BALCONY_FACING_RENTAL = ['Outside Facing', 'Inside Facing (Courtyard/Amenities)', 'Utility/Service Balcony']
const TOTAL_FLOORS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const TENANT_OPTIONS = ['Family', 'Bachelor (Male)', 'Bachelor (Female)', 'Corporate', 'Any', 'etc']
const MAINTENANCE_OPTIONS = ['Included', 'Not Included']
const COMMISSION_OPTIONS = ['Side by Side', 'From Owner', 'From Tenant', 'Shared']
const NOTICE_PERIOD_OPTIONS = ['15 Days', '1 Month', '2 Months', '3 Months']
const AMENITY_LIST_RESALE = ['Swimming Pool', 'Lifts', 'CCTV Surveillance', 'Security', 'Power Backup', 'Water Storage', 'Gym', 'Garden/Landscaping', 'Community Center', 'Concierge Service', 'Play Area']
const AMENITY_LIST_RENTAL = ['Swimming Pool', 'Lifts/Elevators', 'CCTV Surveillance', 'Security', 'Power Backup', 'Water Storage/Tank', 'Gym', 'Garden/Landscaping', 'Community Center', 'Concierge Service', 'Play Area']

// ── Sidebar ────────────────────────────────────────────────────────────────────
const STEPS = ['Basic Details', 'Property Details', 'More Details']
const Sidebar = ({ step, setStep }) => (
  <aside className="w-56 flex-shrink-0 bg-gray-100 rounded-2xl p-4 flex flex-col gap-1 self-start sticky top-8">
    {STEPS.map((s, i) => {
      const active = step === i, done = step > i
      return (
        <button key={i} type="button" onClick={() => setStep(i)}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left w-full ${active ? 'bg-white shadow-sm' : 'hover:bg-white/60'}`}>
          <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={active ? { background: RED, color: '#fff' } : done ? { background: '#22c55e', color: '#fff' } : { border: '2px solid #9ca3af', color: '#6b7280' }}>
            {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </span>
          <span className="text-sm font-semibold" style={active ? { color: RED } : { color: '#6b7280' }}>{s}</span>
        </button>
      )
    })}
  </aside>
)

// ── Tab Switcher ───────────────────────────────────────────────────────────────
const TabSwitch = ({ tab, setTab }) => (
  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
    {['Resale', 'Rental'].map(t => (
      <button key={t} type="button" onClick={() => setTab(t.toLowerCase())}
        className="px-5 py-2 text-sm font-semibold transition-colors"
        style={tab === t.toLowerCase() ? { background: RED, color: '#fff' } : { background: '#fff', color: '#374151' }}>
        {t}
      </button>
    ))}
  </div>
)

// ── Next Button ────────────────────────────────────────────────────────────────
const NextBtn = ({ onClick, label = 'Next' }) => (
  <div className="flex justify-end mt-8">
    <button type="button" onClick={onClick}
      className="text-white font-semibold px-8 py-3 rounded-lg text-sm active:scale-95 transition-all"
      style={{ background: RED }}>{label}</button>
  </div>
)

// ── STEP 1 – Basic Details (shared) ───────────────────────────────────────────
const Step1 = ({ data, setData, onNext }) => {
  const cities = CITIES_BY_STATE[data.state] || CITIES_BY_STATE.default
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <Label required>Name of the Property</Label>
          <TextInput placeholder="Eg. Property Name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
        </div>
        <div>
          <Label>Select Assets Type</Label>
          <Dropdown placeholder="Select Assets Type" options={ASSET_TYPES} value={data.assetType} onChange={v => setData({ ...data, assetType: v })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-5">
        <PhotoUpload />
        <VideoUpload />
      </div>
      <div className="mb-4">
        <Label>Add Address</Label>
        <TextInput placeholder="Address" value={data.address} onChange={e => setData({ ...data, address: e.target.value })} />
      </div>
      <div className="grid grid-cols-4 gap-3 mb-5 items-center">
        <Dropdown placeholder="State" options={STATES} value={data.state} onChange={v => setData({ ...data, state: v, city: '' })} />
        <Dropdown placeholder="City" options={cities} value={data.city} onChange={v => setData({ ...data, city: v })} />
        <TextInput placeholder="Pincode" value={data.pincode} onChange={e => setData({ ...data, pincode: e.target.value })} />
        <button type="button" className="border-2 rounded-lg px-3 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap"
          style={{ borderColor: RED, color: RED }}>
          <MapPin className="w-3.5 h-3.5" /> Open Google Map
        </button>
      </div>
      <div className="mb-5">
        <Label>Select Possession</Label>
        <div className="grid grid-cols-2 gap-4">
          <Dropdown placeholder="Select Possession" options={POSSESSION_OPTIONS} value={data.possession} onChange={v => setData({ ...data, possession: v })} />
          {data.possession === 'Available From' && (
            <DateRangePicker value={data.dateRange || { start: null, end: null }} onChange={v => setData({ ...data, dateRange: v })} />
          )}
        </div>
      </div>
      <NextBtn onClick={onNext} />
    </div>
  )
}

// ── STEP 2 – Property Details RESALE ──────────────────────────────────────────
const Step2Resale = ({ data, setData, onNext }) => (
  <div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Apartment Type</Label>
        <Dropdown placeholder="Select Type" options={APT_TYPES} value={data.aptType} onChange={v => setData({ ...data, aptType: v })} />
      </div>
      <div>
        <Label>Door Facing</Label>
        <Dropdown placeholder="Select Direction" options={DOOR_FACING} value={data.doorFacing} onChange={v => setData({ ...data, doorFacing: v })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Age of Building</Label>
        <Dropdown placeholder="Select" options={AGE_OPTIONS} value={data.age} onChange={v => setData({ ...data, age: v })} />
      </div>
      <div>
        <Label required>Parking</Label>
        <Dropdown placeholder="Select Parking" options={PARKING_OPTIONS} value={data.parking} onChange={v => setData({ ...data, parking: v })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label>Floor Number</Label>
        <Dropdown placeholder="Select" options={FLOOR_OPTIONS} value={data.floorNo} onChange={v => setData({ ...data, floorNo: v })} />
      </div>
      <div>
        <Label required>Configuration</Label>
        <div className="flex items-center gap-2">
          <div style={{ minWidth: '110px' }}>
            <Dropdown placeholder="Bedroom" options={BEDROOM_OPTIONS} value={data.bedroom} onChange={v => setData({ ...data, bedroom: v })} />
          </div>
          <TextInput placeholder="Bathroom" value={data.bathroom} onChange={e => setData({ ...data, bathroom: e.target.value })} />
          <TextInput placeholder="Balconies" value={data.balconies} onChange={e => setData({ ...data, balconies: e.target.value })} />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Furnishing</Label>
        <Dropdown placeholder="Select Type" options={FURNISHING_OPTIONS} value={data.furnishing} onChange={v => setData({ ...data, furnishing: v })} />
      </div>
      <div>
        <Label>Price per Sqft</Label>
        <NumberInput placeholder="Enter Price" value={data.priceSqft} onChange={e => setData({ ...data, priceSqft: e.target.value })} suffix="Sqft" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Ask Price</Label>
        <PriceInput placeholder="Enter Price" value={data.askPrice} onChange={e => setData({ ...data, askPrice: e.target.value })}
          unit={data.priceUnit || 'Lakhs'} onUnitChange={v => setData({ ...data, priceUnit: v })} />
      </div>
      <div>
        <Label required>SBUA</Label>
        <NumberInput placeholder="Enter Area" value={data.sbua} onChange={e => setData({ ...data, sbua: e.target.value })} suffix="Sqft" />
      </div>
    </div>
    <NextBtn onClick={onNext} />
  </div>
)

// ── STEP 2 – Property Details RENTAL ──────────────────────────────────────────
const Step2Rental = ({ data, setData, onNext }) => (
  <div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Apartment Type</Label>
        <Dropdown placeholder="Select Type" options={APT_TYPES} value={data.aptType} onChange={v => setData({ ...data, aptType: v })} />
      </div>
      <div>
        <Label>Door Facing</Label>
        <Dropdown placeholder="Select Direction" options={DOOR_FACING} value={data.doorFacing} onChange={v => setData({ ...data, doorFacing: v })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Age of Building</Label>
        <Dropdown placeholder="Select" options={AGE_OPTIONS} value={data.age} onChange={v => setData({ ...data, age: v })} />
      </div>
      <div>
        <Label required>Balcony Facing</Label>
        <Dropdown placeholder="Select" options={BALCONY_FACING_RENTAL} value={data.balconyFacing} onChange={v => setData({ ...data, balconyFacing: v })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label>Total Floors</Label>
        <Dropdown placeholder="Select" options={TOTAL_FLOORS} value={data.totalFloors} onChange={v => setData({ ...data, totalFloors: v })} />
      </div>
      <div>
        <Label>Floor Number</Label>
        <Dropdown placeholder="Select" options={FLOOR_OPTIONS} value={data.floorNo} onChange={v => setData({ ...data, floorNo: v })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Furnishing</Label>
        <Dropdown placeholder="Select Type" options={FURNISHING_OPTIONS} value={data.furnishing} onChange={v => setData({ ...data, furnishing: v })} />
      </div>
      <div>
        <Label>Rent Per Month</Label>
        <PriceInput placeholder="Enter Price" value={data.rent} onChange={e => setData({ ...data, rent: e.target.value })}
          unit={data.rentUnit || 'Lakhs'} onUnitChange={v => setData({ ...data, rentUnit: v })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Deposit</Label>
        <PriceInput placeholder="Enter Price" value={data.deposit} onChange={e => setData({ ...data, deposit: e.target.value })}
          unit={data.depositUnit || 'Lakhs'} onUnitChange={v => setData({ ...data, depositUnit: v })} />
      </div>
      <div>
        <Label required>SBUA</Label>
        <NumberInput placeholder="Enter Area" value={data.sbua} onChange={e => setData({ ...data, sbua: e.target.value })} suffix="Sqft" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Parking</Label>
        <Dropdown placeholder="Select Parking" options={PARKING_OPTIONS} value={data.parking} onChange={v => setData({ ...data, parking: v })} />
      </div>
      <div>
        <Label required>Configuration</Label>
        <div className="flex items-center gap-2">
          <div style={{ minWidth: '110px' }}>
            <Dropdown placeholder="Bedroom" options={BEDROOM_OPTIONS} value={data.bedroom} onChange={v => setData({ ...data, bedroom: v })} />
          </div>
          <TextInput placeholder="Bathroom" value={data.bathroom} onChange={e => setData({ ...data, bathroom: e.target.value })} />
          <TextInput placeholder="Balconies" value={data.balconies} onChange={e => setData({ ...data, balconies: e.target.value })} />
        </div>
      </div>
    </div>
    <NextBtn onClick={onNext} />
  </div>
)

// ── STEP 3 – More Details RESALE ──────────────────────────────────────────────
const Step3Resale = ({ data, setData, onSubmit }) => {
  const [customInput, setCustomInput] = useState('')
  const [customList, setCustomList] = useState([])
  const toggle = a => { const cur = data.amenities || []; setData({ ...data, amenities: cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a] }) }
  const addCustom = () => { const v = customInput.trim(); if (!v) return; setCustomList(l => [...l, v]); setData({ ...data, amenities: [...(data.amenities || []), v] }); setCustomInput('') }
  return (
    <div>
      <div className="mb-6">
        <Label required>Amenities</Label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[...AMENITY_LIST_RESALE, ...customList].map(a => {
            const checked = (data.amenities || []).includes(a)
            return (
              <button key={a} type="button" onClick={() => toggle(a)}
                className="flex items-center gap-2.5 border rounded-xl px-4 py-3 text-sm text-left font-medium transition-all"
                style={checked ? { borderColor: RED, background: `${RED}0d` } : { borderColor: '#e5e7eb', background: '#fff', color: '#374151' }}>
                <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                  style={checked ? { background: RED, borderColor: RED } : { borderColor: '#d1d5db' }}>
                  {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </span>
                {a}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Add Other Amenities" value={customInput} onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 outline-none"
            onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
          <button type="button" onClick={addCustom}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl font-light"
            style={{ background: RED }}>+</button>
        </div>
      </div>
      <div className="mb-6">
        <Label required>Description</Label>
        <textarea placeholder="Write Description" value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
          rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 outline-none resize-y"
          onFocus={e => { e.target.style.borderColor = RED; e.target.style.boxShadow = `0 0 0 3px ${RED}18` }}
          onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }} />
      </div>
      <NextBtn onClick={onSubmit} label="Add Inventory" />
    </div>
  )
}

// ── STEP 3 – More Details RENTAL ──────────────────────────────────────────────
const Step3Rental = ({ data, setData, onSubmit }) => {
  const [customInput, setCustomInput] = useState('')
  const [customList, setCustomList] = useState([])
  const toggle = a => { const cur = data.amenities || []; setData({ ...data, amenities: cur.includes(a) ? cur.filter(x => x !== a) : [...cur, a] }) }
  const addCustom = () => { const v = customInput.trim(); if (!v) return; setCustomList(l => [...l, v]); setData({ ...data, amenities: [...(data.amenities || []), v] }); setCustomInput('') }
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <Label required>Preferred Tenants</Label>
          <Dropdown placeholder="Select Type" options={TENANT_OPTIONS} value={data.preferredTenants} onChange={v => setData({ ...data, preferredTenants: v })} />
        </div>
        <div>
          <Label>Maintenance</Label>
          <Dropdown placeholder="Select" options={MAINTENANCE_OPTIONS} value={data.maintenance} onChange={v => setData({ ...data, maintenance: v })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <Label required>Commission</Label>
          <Dropdown placeholder="Select" options={COMMISSION_OPTIONS} value={data.commission} onChange={v => setData({ ...data, commission: v })} />
        </div>
        <div>
          <Label required>Notice Period</Label>
          <Dropdown placeholder="Select" options={NOTICE_PERIOD_OPTIONS} value={data.noticePeriod} onChange={v => setData({ ...data, noticePeriod: v })} />
        </div>
      </div>
      <div className="flex items-center gap-10 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Pet Allowed <span style={{ color: RED }}>*</span></span>
          <YesNo value={data.petAllowed} onChange={v => setData({ ...data, petAllowed: v })} />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Non-Veg Allowed <span style={{ color: RED }}>*</span></span>
          <YesNo value={data.nonVegAllowed} onChange={v => setData({ ...data, nonVegAllowed: v })} />
        </div>
      </div>
      <div className="mb-5">
        <Label required>Amenities</Label>
        <div className="grid grid-cols-3 gap-3 mb-3">
          {[...AMENITY_LIST_RENTAL, ...customList].map(a => {
            const checked = (data.amenities || []).includes(a)
            return (
              <button key={a} type="button" onClick={() => toggle(a)}
                className="flex items-center gap-2.5 border rounded-xl px-4 py-3 text-sm text-left font-medium transition-all"
                style={checked ? { borderColor: RED, background: `${RED}0d` } : { borderColor: '#e5e7eb', background: '#fff', color: '#374151' }}>
                <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                  style={checked ? { background: RED, borderColor: RED } : { borderColor: '#d1d5db' }}>
                  {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                </span>
                {a}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Add Other Amenities" value={customInput} onChange={e => setCustomInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 outline-none"
            onFocus={e => e.target.style.borderColor = RED} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
          <button type="button" onClick={addCustom}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xl font-light"
            style={{ background: RED }}>+</button>
        </div>
      </div>
      <div className="mb-6">
        <Label required>Description</Label>
        <textarea placeholder="Write Description" value={data.description} onChange={e => setData({ ...data, description: e.target.value })}
          rows={5} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 outline-none resize-y"
          onFocus={e => { e.target.style.borderColor = RED; e.target.style.boxShadow = `0 0 0 3px ${RED}18` }}
          onBlur={e => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none' }} />
      </div>
      <NextBtn onClick={onSubmit} label="Add Inventory" />
    </div>
  )
}

// ── Success Modal ──────────────────────────────────────────────────────────────
const SuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-4 shadow-2xl max-w-xs w-full mx-4" onClick={e => e.stopPropagation()}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#22c55e' }}>
        <Check className="w-8 h-8 text-white" strokeWidth={3} />
      </div>
      <div className="text-center">
        <p className="text-xl font-black text-gray-900 mb-1">Congratulations !!!</p>
        <p className="text-sm text-gray-500">Your Inventory has been added successfully</p>
      </div>
      <button type="button" onClick={onClose}
        className="mt-2 text-white px-8 py-2.5 rounded-lg text-sm font-semibold"
        style={{ background: RED }}>Done</button>
    </div>
  </div>
)

// ── Root ───────────────────────────────────────────────────────────────────────
export default function AddInventory() {
  const [tab, setTab] = useState('resale')
  const [step, setStep] = useState(0)
  const [success, setSuccess] = useState(false)

  // Separate state for resale and rental so switching tabs doesn't lose data
  const [basicData, setBasicData] = useState({ name: '', assetType: '', address: '', state: '', city: '', pincode: '', possession: '', dateRange: { start: null, end: null } })
  const [resaleProp, setResaleProp] = useState({ aptType: '', doorFacing: '', age: '', parking: '', floorNo: '', bedroom: '', bathroom: '', balconies: '', furnishing: '', priceSqft: '', askPrice: '', priceUnit: 'Lakhs', sbua: '' })
  const [rentalProp, setRentalProp] = useState({ aptType: '', doorFacing: '', age: '', balconyFacing: '', totalFloors: '', floorNo: '', furnishing: '', rent: '', rentUnit: 'Lakhs', deposit: '', depositUnit: 'Lakhs', sbua: '', parking: '', bedroom: '', bathroom: '', balconies: '' })
  const [resaleMore, setResaleMore] = useState({ amenities: [], description: '' })
  const [rentalMore, setRentalMore] = useState({ preferredTenants: '', maintenance: '', commission: '', noticePeriod: '', petAllowed: 'Yes', nonVegAllowed: 'Yes', amenities: [], description: '' })

  const TITLES = ['Add Inventory', 'Property Details', 'More Details']

  const handleTabChange = (newTab) => {
    setTab(newTab)
    // Don't reset step — let user stay on same step when switching tabs
  }

  return (
    <div className=" bg-gray-50 p-8" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div className="w-full mx-auto flex gap-8">

        {/* Sidebar — clickable */}
        <Sidebar step={step} setStep={setStep} />

        <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-4 mb-7">
            <h1 className="text-2xl font-black text-gray-900">{TITLES[step]}</h1>
            {/* Tab switcher only on Basic Details */}
            {step === 0 && <TabSwitch tab={tab} setTab={handleTabChange} />}
            {/* Show badge on other steps */}
            {step > 0 && (
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: RED }}>
                {tab === 'resale' ? 'Resale' : 'Rental'}
              </span>
            )}
          </div>

          {/* Step 1 — same for both */}
          {step === 0 && (
            <Step1 data={basicData} setData={setBasicData} onNext={() => setStep(1)} />
          )}

          {/* Step 2 — different per tab */}
          {step === 1 && tab === 'resale' && (
            <Step2Resale data={resaleProp} setData={setResaleProp} onNext={() => setStep(2)} />
          )}
          {step === 1 && tab === 'rental' && (
            <Step2Rental data={rentalProp} setData={setRentalProp} onNext={() => setStep(2)} />
          )}

          {/* Step 3 — different per tab */}
          {step === 2 && tab === 'resale' && (
            <Step3Resale data={resaleMore} setData={setResaleMore} onSubmit={() => setSuccess(true)} />
          )}
          {step === 2 && tab === 'rental' && (
            <Step3Rental data={rentalMore} setData={setRentalMore} onSubmit={() => setSuccess(true)} />
          )}
        </div>
      </div>

      {success && <SuccessModal onClose={() => { setSuccess(false); setStep(0) }} />}
    </div>
  )
}