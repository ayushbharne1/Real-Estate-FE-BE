import { useState, useRef } from 'react'
import { ChevronDown, X, Plus } from 'lucide-react'

// ── Shared UI ──────────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-sm text-gray-600 mb-1.5">
    {children}{required && <span className="text-[#E8431A]"> *</span>}
  </label>
)

const Input = ({ placeholder, value, onChange, type = 'text' }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#E8431A] focus:ring-1 focus:ring-[#E8431A]/20 transition-colors bg-white"
  />
)

const Select = ({ placeholder, options = [], value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-500 focus:outline-none focus:border-[#E8431A] appearance-none bg-white pr-8"
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
)

const NextBtn = ({ onClick, label = 'Next' }) => (
  <div className="flex justify-end mt-8">
    <button
      onClick={onClick}
      className="bg-[#E8431A] hover:bg-[#cf3b16] text-white font-semibold px-8 py-3 rounded-lg transition-colors text-sm"
    >
      {label}
    </button>
  </div>
)

// ── Step Sidebar ───────────────────────────────────────────────────────────────
const STEPS = ['Basic Details', 'Property Details', 'More Details']

const Sidebar = ({ step }) => (
  <aside className="w-60 flex-shrink-0 bg-gray-100 rounded-2xl p-4 flex flex-col gap-2 self-start">
    {STEPS.map((s, i) => {
      const active = step === i
      return (
        <div
          key={i}
          className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${active ? 'bg-white shadow-sm' : ''}`}
        >
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            active ? 'bg-[#E8431A] text-white' : 'border-2 border-gray-400 text-gray-500'
          }`}>
            {i + 1}
          </span>
          <span className={`text-sm font-semibold ${active ? 'text-[#E8431A]' : 'text-gray-600'}`}>{s}</span>
        </div>
      )
    })}
  </aside>
)

// ── Photo/Video Upload ─────────────────────────────────────────────────────────
const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=60',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=80&q=60',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=80&q=60',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=60',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=80&q=60',
]

const PhotoUpload = () => {
  const inputRef = useRef()
  return (
    <div>
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
        <span className="px-4 py-2 text-sm text-gray-600 bg-white">Add Photos</span>
        <button
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
        >Browse</button>
      </div>
      <input ref={inputRef} type="file" multiple accept="image/*" className="hidden" />
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {SAMPLE_PHOTOS.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-200" />
            <p className="text-[9px] text-gray-400 text-center mt-0.5">Photo 0{i+1}.jpg</p>
          </div>
        ))}
        <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-gray-700">
          +4
        </div>
      </div>
    </div>
  )
}

const VideoUpload = () => {
  const inputRef = useRef()
  return (
    <div className="flex items-start gap-3">
      <div>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
          <span className="px-4 py-2 text-sm text-gray-600 bg-white">Add Video</span>
          <button
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors"
          >Browse</button>
        </div>
        <input ref={inputRef} type="file" accept="video/*" className="hidden" />
      </div>
      <div className="text-center">
        <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=60" alt="" className="w-full h-full object-cover" />
        </div>
        <p className="text-[9px] text-gray-400 mt-0.5">Video 10sec</p>
      </div>
    </div>
  )
}

// ── STEP 1 – Basic Details ─────────────────────────────────────────────────────
const Step1 = ({ data, setData, onNext }) => (
  <div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Name of the Property</Label>
        <Input placeholder="Eg. Ramesh" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
      </div>
      <div>
        <Label>Select Assets Type</Label>
        <Select placeholder="Select Assets Type" options={['Apartment', 'Villa', 'Plot', 'Commercial', 'Office Space']} value={data.assetType} onChange={e => setData({ ...data, assetType: e.target.value })} />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6 mb-5">
      <PhotoUpload />
      <VideoUpload />
    </div>

    <div className="mb-5">
      <Label required>Description</Label>
      <textarea
        placeholder="Write Description"
        value={data.description}
        onChange={e => setData({ ...data, description: e.target.value })}
        rows={5}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#E8431A] focus:ring-1 focus:ring-[#E8431A]/20 transition-colors resize-y"
      />
    </div>

    <div className="mb-5">
      <Label>Add Address</Label>
      <Input placeholder="Address" value={data.address} onChange={e => setData({ ...data, address: e.target.value })} />
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Select placeholder="City" options={['Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai']} value={data.city} onChange={e => setData({ ...data, city: e.target.value })} />
      <Select placeholder="State" options={['Karnataka', 'Maharashtra', 'Delhi', 'Telangana', 'Tamil Nadu']} value={data.state} onChange={e => setData({ ...data, state: e.target.value })} />
      <Input placeholder="Pincode" value={data.pincode} onChange={e => setData({ ...data, pincode: e.target.value })} />
    </div>

    <NextBtn onClick={onNext} />
  </div>
)

// ── STEP 2 – Property Details (RESALE) ─────────────────────────────────────────
const Step2Resale = ({ data, setData, onNext }) => (
  <div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Apartment Type</Label>
        <Input placeholder="Eg. Ramesh" value={data.aptType} onChange={e => setData({ ...data, aptType: e.target.value })} />
      </div>
      <div>
        <Label>Door Facing</Label>
        <Select placeholder="Select Type" options={['East', 'West', 'North', 'South', 'North-East', 'South-West']} value={data.doorFacing} onChange={e => setData({ ...data, doorFacing: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Age of Building</Label>
        <Input placeholder="Eg - 1-5 years" value={data.age} onChange={e => setData({ ...data, age: e.target.value })} />
      </div>
      <div>
        <Label>Floor Number</Label>
        <Input placeholder="Enter Floor Number" value={data.floorNo} onChange={e => setData({ ...data, floorNo: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>No of Floors</Label>
        <Input placeholder="Enter no. of floors" value={data.floors} onChange={e => setData({ ...data, floors: e.target.value })} />
      </div>
      <div>
        <Label>Bedroom</Label>
        <Select placeholder="Select Type" options={['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+']} value={data.bedroom} onChange={e => setData({ ...data, bedroom: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Enter Area</Label>
        <Input placeholder="Enter Area" value={data.area} onChange={e => setData({ ...data, area: e.target.value })} />
      </div>
      <div>
        <Label>Price Sq/ft</Label>
        <Input placeholder="Enter Price" value={data.priceSqft} onChange={e => setData({ ...data, priceSqft: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Ask Price</Label>
        <Input placeholder="Enter Price" value={data.askPrice} onChange={e => setData({ ...data, askPrice: e.target.value })} />
      </div>
      <div>
        <Label required>Furnishing</Label>
        <Input placeholder="Eg - Furnished" value={data.furnishing} onChange={e => setData({ ...data, furnishing: e.target.value })} />
      </div>
    </div>
    <NextBtn onClick={onNext} />
  </div>
)

// ── STEP 2 – Property Details (RENTAL) ─────────────────────────────────────────
const Step2Rental = ({ data, setData, onNext }) => (
  <div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Apartment Type</Label>
        <Input placeholder="Eg. Apartment" value={data.aptType} onChange={e => setData({ ...data, aptType: e.target.value })} />
      </div>
      <div>
        <Label>Door Facing</Label>
        <Select placeholder="Select Type" options={['East', 'West', 'North', 'South', 'North-East', 'South-West']} value={data.doorFacing} onChange={e => setData({ ...data, doorFacing: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Age of Building</Label>
        <Input placeholder="Eg - 1-5 years" value={data.age} onChange={e => setData({ ...data, age: e.target.value })} />
      </div>
      <div>
        <Label>Floor Number</Label>
        <Input placeholder="Enter Floor Number" value={data.floorNo} onChange={e => setData({ ...data, floorNo: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>No of Floors</Label>
        <Input placeholder="Enter no. of floors" value={data.floors} onChange={e => setData({ ...data, floors: e.target.value })} />
      </div>
      <div>
        <Label>Bedroom</Label>
        <Select placeholder="Select Type" options={['1BHK', '2BHK', '3BHK', '4BHK', '5BHK+']} value={data.bedroom} onChange={e => setData({ ...data, bedroom: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Enter Area</Label>
        <Input placeholder="Enter Area" value={data.area} onChange={e => setData({ ...data, area: e.target.value })} />
      </div>
      <div>
        <Label required>Monthly Rent</Label>
        <Input placeholder="Enter Monthly Rent" value={data.rent} onChange={e => setData({ ...data, rent: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label required>Security Deposit</Label>
        <Input placeholder="Enter Deposit Amount" value={data.deposit} onChange={e => setData({ ...data, deposit: e.target.value })} />
      </div>
      <div>
        <Label required>Furnishing</Label>
        <Input placeholder="Eg - Furnished" value={data.furnishing} onChange={e => setData({ ...data, furnishing: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-6 mb-5">
      <div>
        <Label>Available From</Label>
        <Input type="date" value={data.availableFrom} onChange={e => setData({ ...data, availableFrom: e.target.value })} />
      </div>
      <div>
        <Label>Lease Duration</Label>
        <Select placeholder="Select Duration" options={['6 months', '11 months', '1 year', '2 years', '3 years']} value={data.leaseDuration} onChange={e => setData({ ...data, leaseDuration: e.target.value })} />
      </div>
    </div>
    <NextBtn onClick={onNext} />
  </div>
)

// ── STEP 3 – More Details ──────────────────────────────────────────────────────
const AMENITY_OPTIONS = ['Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup', 'Lift', 'Garden', 'Clubhouse', 'Play Area', 'CCTV']

const Step3 = ({ data, setData, onSubmit }) => {
  const [amenityInput, setAmenityInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const filtered = AMENITY_OPTIONS.filter(a =>
    a.toLowerCase().includes(amenityInput.toLowerCase()) && !data.amenities?.includes(a)
  )

  const addAmenity = (a) => {
    setData({ ...data, amenities: [...(data.amenities || []), a] })
    setAmenityInput('')
    setShowDropdown(false)
  }

  const removeAmenity = (a) => {
    setData({ ...data, amenities: (data.amenities || []).filter(x => x !== a) })
  }

  return (
    <div>
      <div className="mb-5">
        <Label required>Parking</Label>
        <Input placeholder="Enter Parking" value={data.parking} onChange={e => setData({ ...data, parking: e.target.value })} />
      </div>

      <div className="mb-5">
        <Label required>Enter Amenities</Label>
        <div className="border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#E8431A] focus-within:ring-1 focus-within:ring-[#E8431A]/20 transition-colors bg-white">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {(data.amenities || []).map(a => (
              <span key={a} className="flex items-center gap-1 bg-[#E8431A]/10 text-[#E8431A] text-xs font-medium px-2 py-1 rounded-full">
                {a}
                <button onClick={() => removeAmenity(a)}><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Select Amenties"
              value={amenityInput}
              onChange={e => { setAmenityInput(e.target.value); setShowDropdown(true) }}
              onFocus={() => setShowDropdown(true)}
              className="w-full text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
            />
            {showDropdown && filtered.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1 max-h-40 overflow-y-auto">
                {filtered.map(a => (
                  <button
                    key={a}
                    onClick={() => addAmenity(a)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#E8431A] transition-colors"
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <NextBtn onClick={onSubmit} label="Add Inventory" />
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
const AddInventory = () => {
  const [tab, setTab] = useState('resale') // 'resale' | 'rental'
  const [step, setStep] = useState(0)

  const [basic, setBasic] = useState({ name: '', assetType: '', description: '', address: '', city: '', state: '', pincode: '' })

  const [resaleProp, setResaleProp] = useState({ aptType: '', doorFacing: '', age: '', floorNo: '', floors: '', bedroom: '', area: '', priceSqft: '', askPrice: '', furnishing: '' })
  const [rentalProp, setRentalProp] = useState({ aptType: '', doorFacing: '', age: '', floorNo: '', floors: '', bedroom: '', area: '', rent: '', deposit: '', furnishing: '', availableFrom: '', leaseDuration: '' })

  const [more, setMore] = useState({ parking: '', amenities: [] })

  const TITLES = ['Add Inventory', 'Property Details', 'More Details']

  return (
    <div className="min-h-screen bg-white p-8" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="w-full mx-auto flex gap-8">

        {/* Sidebar */}
        <Sidebar step={step} />

        {/* Main Form */}
        <div className="flex-1">
          {/* Title + Tab */}
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-black text-gray-900">{TITLES[step]}</h1>
            {step === 0 && (
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setTab('resale')}
                  className={`px-5 py-2 text-sm font-semibold transition-colors ${tab === 'resale' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Resale
                </button>
                <button
                  onClick={() => setTab('rental')}
                  className={`px-5 py-2 text-sm font-semibold transition-colors ${tab === 'rental' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                >
                  Rental
                </button>
              </div>
            )}
          </div>

          {step === 0 && <Step1 data={basic} setData={setBasic} onNext={() => setStep(1)} />}
          {step === 1 && tab === 'resale' && <Step2Resale data={resaleProp} setData={setResaleProp} onNext={() => setStep(2)} />}
          {step === 1 && tab === 'rental' && <Step2Rental data={rentalProp} setData={setRentalProp} onNext={() => setStep(2)} />}
          {step === 2 && <Step3 data={more} setData={setMore} onSubmit={() => alert('Inventory Added!')} />}
        </div>
      </div>
    </div>
  )
}

export default AddInventory