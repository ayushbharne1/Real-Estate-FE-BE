import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Grid, List, ChevronDown, MapPin, Share2,
  Info, ChevronLeft, ChevronRight, Bell, ArrowUpDown,
  Building2, LayoutGrid, Home, Landmark, TreePine,
  Warehouse, Store, X
} from 'lucide-react'

// ── Brand ──────────────────────────────────────────────────────────────────────
const LogoIcon = () => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
    <polygon points="2,26 14,2 26,26" fill="#E8431A" />
    <polygon points="14,2 26,26 26,10" fill="#c03510" />
  </svg>
)

// ── Data ───────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',        label: 'All',        Icon: LayoutGrid },
  { id: 'commercial', label: 'Commercial', Icon: Building2 },
  { id: 'apartment',  label: 'Apartment',  Icon: Home },
  { id: 'plot',       label: 'Plot',       Icon: Landmark },
  { id: 'villas',     label: 'Villas',     Icon: TreePine },
]

const ASSET_TYPES = [
  { label: 'Apartment',          count: 2386, Icon: Home },
  { label: 'Plot',               count: 575,  Icon: Landmark },
  { label: 'Villa',              count: 280,  Icon: TreePine },
  { label: 'Independent House',  count: 80,   Icon: Home },
  { label: 'Commercial Space',   count: 41,   Icon: Building2 },
  { label: 'Row House',          count: 25,   Icon: Home },
  { label: 'Commercial Property',count: 21,   Icon: Warehouse },
  { label: 'Villament',          count: 9,    Icon: Home },
  { label: 'Office Space',       count: 5,    Icon: Building2 },
  { label: 'Retail Space',       count: 3,    Icon: Store },
]

const BHK_OPTIONS = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK']

const SORT_OPTIONS = [
  'Price: Low to High',
  'Price: High to Low',
  'Newest First',
  'Oldest First',
  'Price/Sqft: Low to High',
  'Price/Sqft: High to Low',
]

// Resale properties — show Price/Sq.ft, SBUA, Ask Price
const RESALE_PROPERTIES = [
  { id: 'PB2569', name: 'Brigade Orchards Apartment',      type: 'Apartment',        bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16069', sbua: '13068', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70',      category: 'apartment' },
  { id: 'PB2569', name: 'Brigade Commercial',              type: 'Commercial Space', bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16069', sbua: '13068', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70', category: 'commercial' },
  { id: 'PB2569', name: 'Brigade Orchards Pavilion Villa', type: 'Villa',            bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16069', sbua: '13068', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70', category: 'villas' },
  { id: 'PB2569', name: 'Brige Plot',                      type: 'Plot',             bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16069', sbua: '13068', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70',  category: 'plot' },
  { id: 'PB2569', name: 'Wright The Grove',                type: 'Apartment',        bhk: '2BHK', facing: 'North',      location: 'Electronic City', priceSqft: '16069', sbua: '13068', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70',  category: 'apartment' },
  { id: 'PB2569', name: 'Ezzy Corniath',                   type: 'Row House',        bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16069', sbua: '13068', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&q=70',  category: 'apartment' },
  { id: 'PB2569', name: 'Independent House For Sale',      type: 'Independent House',bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '13969', sbua: '13568', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70',  category: 'villas' },
  { id: 'PB2569', name: 'Brige Plot',                      type: 'Office Space',     bhk: '4BHK', facing: 'North',      location: 'Electronic City', priceSqft: '14369', sbua: '13368', askPrice: '₹21.00 Cr', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=70', category: 'commercial' },
]

// Rental properties — show Rent, Deposit, SBUA
const RENTAL_PROPERTIES = [
  { id: 'PB2569', name: 'Brigade Orchards Apartment',      type: 'Apartment',        bhk: '2BHK', facing: 'East',       location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70',      category: 'apartment' },
  { id: 'PB2569', name: 'Brigade Villament',               type: 'Villament',        bhk: '2BHK', facing: 'North-East', location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70', category: 'apartment' },
  { id: 'PB2569', name: 'Brigade Orchards Pavilion Villa', type: 'Villa',            bhk: '2BHK', facing: 'North',      location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70', category: 'villas' },
  { id: 'PB2569', name: 'Pavillion Row House',             type: 'Row House',        bhk: '3BHK', facing: 'North-East', location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&q=70',  category: 'apartment' },
  { id: 'PB2569', name: 'Brigade Orchards Apartment',      type: 'Apartment',        bhk: '2BHK', facing: 'North-East', location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=70', category: 'apartment' },
  { id: 'PB2569', name: 'Brigade Villament',               type: 'Villament',        bhk: '2BHK', facing: 'North-East', location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70',  category: 'villas' },
  { id: 'PB2569', name: 'Brigade Orchards Pavilion Villa', type: 'Villa',            bhk: '2BHK', facing: 'North',      location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70', category: 'villas' },
  { id: 'PB2569', name: 'Pavillion Row House',             type: 'Row House',        bhk: '3BHK', facing: 'North-East', location: 'Electronic City', rent: '₹1.12 Lakh', deposit: '₹4.48 Lakh', sbua: '2388sqft', img: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=400&q=70',  category: 'commercial' },
]

// Resale table — Ask Price + Price Per Sqft
const RESALE_TABLE_DATA = [
  { id: 'RNA32024', name: 'Assetz Marq Phase-2',     type: 'Apartment', sbua: 3802, plot: '-',  facing: 'South - East', askPrice: '3.00 Cr',     priceSqft: '₹17K' },
  { id: 'RNA3023',  name: 'Sobha Carnation',         type: 'Apartment', sbua: 3569, plot: '-',  facing: 'North',        askPrice: '2.80 Cr',     priceSqft: '₹17K' },
  { id: 'RNA3022',  name: 'SOBHA Dream Gardens',     type: 'Apartment', sbua: 5686, plot: 1957, facing: 'West',         askPrice: '2.90 Cr',     priceSqft: '₹7K'  },
  { id: 'RNA3021',  name: 'QVC The Hills',           type: 'Villa',     sbua: 4578, plot: '-',  facing: 'North',        askPrice: '2.39 Cr',     priceSqft: '₹8K'  },
  { id: 'RNA3020',  name: 'R&S Lakeview Apartment',  type: 'Apartment', sbua: 1245, plot: 1500, facing: 'North',        askPrice: '3.25 Cr',     priceSqft: '₹9K'  },
  { id: 'RNA3019',  name: 'Nikoo Homes 1',           type: 'Office',    sbua: 3698, plot: '-',  facing: 'East',         askPrice: '1.25 Cr',     priceSqft: '₹6K'  },
  { id: 'RNA3018',  name: 'Office Space in Hebal',   type: 'Apartment', sbua: 1596, plot: 1289, facing: 'East',         askPrice: '3.00 Cr',     priceSqft: '₹12K' },
  { id: 'RNA3017',  name: 'Prestige Green Gables',   type: 'Apartment', sbua: 2589, plot: '-',  facing: 'East',         askPrice: '95 Lakhs',    priceSqft: '₹30K' },
  { id: 'RNA3016',  name: 'Prestige Jade Pavillion', type: 'Villa',     sbua: 4586, plot: '-',  facing: 'West',         askPrice: '81.586 Lakhs',priceSqft: '₹12K' },
]

// Rental table — Rent + Deposit
const RENTAL_TABLE_DATA = [
  { id: 'RNA32024', name: 'Assetz Marq Phase-2',     type: 'Apartment', sbua: 3802, plot: '-',  facing: 'South - East', rent: '₹75k',  deposit: '₹3 lakhs'   },
  { id: 'RNA3023',  name: 'Sobha Carnation',         type: 'Apartment', sbua: 3569, plot: '-',  facing: 'North',        rent: '₹89k',  deposit: '₹1.5 lakhs' },
  { id: 'RNA3022',  name: 'SOBHA Dream Gardens',     type: 'Apartment', sbua: 5686, plot: 1957, facing: 'West',         rent: '₹45k',  deposit: '₹2 Lakhs'   },
  { id: 'RNA3021',  name: 'QVC The Hills',           type: 'Villa',     sbua: 4578, plot: '-',  facing: 'North',        rent: '₹99k',  deposit: '₹8 lakhs'   },
  { id: 'RNA3020',  name: 'R&S Lakeview Apartment',  type: 'Apartment', sbua: 1245, plot: 1500, facing: 'North',        rent: '₹88k',  deposit: '-'          },
  { id: 'RNA3019',  name: 'Nikoo Homes 1',           type: 'Office',    sbua: 3698, plot: '-',  facing: 'East',         rent: '₹56k',  deposit: '₹37 Lakhs'  },
  { id: 'RNA3018',  name: 'Office Space in Hebal',   type: 'Apartment', sbua: 1596, plot: 1289, facing: 'East',         rent: '₹77k',  deposit: '₹4 lakhs'   },
  { id: 'RNA3017',  name: 'Prestige Green Gables',   type: 'Apartment', sbua: 2589, plot: '-',  facing: 'East',         rent: '₹35k',  deposit: '₹5 lakhs'   },
  { id: 'RNA3016',  name: 'Prestige Jade Pavillion', type: 'Villa',     sbua: 4586, plot: '-',  facing: 'West',         rent: '₹45k',  deposit: '₹69 lakhs'  },
]

// ── Hooks ──────────────────────────────────────────────────────────────────────
function useOutsideClick(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler() }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
  }, [ref, handler])
}

// ── Chip ───────────────────────────────────────────────────────────────────────
const Chip = ({ label }) => (
  <span className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 whitespace-nowrap bg-gray-50">
    {label}
  </span>
)

// ── Property Card ──────────────────────────────────────────────────────────────
const PropertyCard = ({ prop, mode }) => {
  const navigate = useNavigate()
  const isRental = mode === 'rental'

  return (
    <div
      onClick={() => navigate(`/property/details/${prop.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={prop.img}
          alt={prop.name}
          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide">
          {prop.id}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Chip label={prop.type} />
          <Chip label={prop.bhk} />
          <Chip label={prop.facing} />
        </div>

        {/* Name */}
        <p className="font-bold text-gray-900 text-base leading-snug mb-1">{prop.name}</p>

        {/* Location */}
        <p className="flex items-center gap-1 text-sm text-gray-400 mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#E8431A] flex-shrink-0" />
          {prop.location}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 gap-2">
          <div className="flex items-center justify-center gap-4 py-2 px-4 border border-gray-300 rounded-md">
            {isRental ? (
              <>
                <div>
                  <p className="text-sm font-bold text-gray-900">{prop.rent}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Rent</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{prop.deposit}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Deposit</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{prop.sbua}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SBUA</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-bold text-gray-900">{prop.priceSqft}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Price/Sq.ft</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{prop.sbua}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SBUA</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{prop.askPrice}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Ask Price</p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-md px-3 py-2 flex items-center gap-1.5 text-sm font-semibold transition-colors flex-shrink-0"
          >
            <div className='flex flex-col items-center justify-center'><Share2 className="w-3.5 h-3.5" /> Share</div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Asset Type Dropdown ────────────────────────────────────────────────────────
const AssetTypeDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useOutsideClick(ref, () => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-white ${open || selected ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
      >
        <Building2 className="w-3.5 h-3.5" />
        Asset Type {selected && <span className="bg-[#E8431A] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">1</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
          {ASSET_TYPES.map(({ label, count, Icon: Ic }) => (
            <button
              key={label}
              onClick={() => { onChange(label === selected ? null : label); setOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selected === label ? 'text-[#E8431A] font-semibold' : 'text-gray-700'}`}
            >
              <div className="flex items-center gap-2.5">
                <Ic className="w-4 h-4 text-gray-400" />
                <span>{label}</span>
              </div>
              <span className={`text-xs font-semibold ${selected === label ? 'text-[#E8431A]' : 'text-gray-400'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Configuration Dropdown ─────────────────────────────────────────────────────
const ConfigurationDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const [localSelected, setLocalSelected] = useState(selected || [])
  const ref = useRef()
  useOutsideClick(ref, () => setOpen(false))

  const toggle = (bhk) => {
    setLocalSelected(prev =>
      prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]
    )
  }

  const handleApply = () => { onChange(localSelected); setOpen(false) }
  const handleCancel = () => { setLocalSelected(selected || []); setOpen(false) }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-white ${open || (selected?.length > 0) ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
      >
        <Home className="w-3.5 h-3.5" />
        Configuration
        {selected?.length > 0 && (
          <span className="bg-[#E8431A] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {BHK_OPTIONS.map(bhk => (
              <button
                key={bhk}
                onClick={() => toggle(bhk)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  localSelected.includes(bhk)
                    ? 'bg-[#E8431A] text-white border-[#E8431A]'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {bhk}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleApply} className="bg-[#E8431A] hover:bg-[#cf3b16] text-white px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors">Apply</button>
            <button onClick={handleCancel} className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Budget Dropdown ────────────────────────────────────────────────────────────
const BudgetDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [min, setMin] = useState(value?.min ?? '')
  const [max, setMax] = useState(value?.max ?? '')
  const [sliderMin, setSliderMin] = useState(0)
  const [sliderMax, setSliderMax] = useState(100)
  const ref = useRef()
  useOutsideClick(ref, () => setOpen(false))

  const handleApply = () => { onChange({ min, max }); setOpen(false) }
  const handleCancel = () => { setMin(value?.min ?? ''); setMax(value?.max ?? ''); setOpen(false) }
  const isActive = value?.min || value?.max

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-white ${open || isActive ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
      >
        <Landmark className="w-3.5 h-3.5" />
        Budget
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <input type="number" placeholder="Min" value={min} onChange={e => setMin(e.target.value)}
              className="w-0 flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8431A] transition-colors" />
            <span className="text-gray-400 text-sm font-medium flex-shrink-0">to</span>
            <input type="number" placeholder="Max" value={max} onChange={e => setMax(e.target.value)}
              className="w-0 flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8431A] transition-colors" />
          </div>
          <div className="relative h-5 mb-4">
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-gray-200 rounded-full">
              <div className="absolute h-full bg-[#E8431A] rounded-full" style={{ left: `${sliderMin}%`, width: `${sliderMax - sliderMin}%` }} />
            </div>
            <input type="range" min={0} max={100} value={sliderMin}
              onChange={e => { const v = Math.min(Number(e.target.value), sliderMax - 5); setSliderMin(v) }}
              className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: sliderMin > 90 ? 5 : 3 }} />
            <input type="range" min={0} max={100} value={sliderMax}
              onChange={e => { const v = Math.max(Number(e.target.value), sliderMin + 5); setSliderMax(v) }}
              className="absolute w-full h-full opacity-0 cursor-pointer" style={{ zIndex: 4 }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E8431A] shadow border-2 border-white pointer-events-none" style={{ left: `calc(${sliderMin}% - 8px)` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#E8431A] shadow border-2 border-white pointer-events-none" style={{ left: `calc(${sliderMax}% - 8px)` }} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={handleApply} className="bg-[#E8431A] hover:bg-[#cf3b16] text-white px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors">Apply</button>
            <button onClick={handleCancel} className="border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SBUA Dropdown ──────────────────────────────────────────────────────────────
const SBUADropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [min, setMin] = useState(value?.min ?? '0')
  const [max, setMax] = useState(value?.max ?? '1000')
  const ref = useRef()
  useOutsideClick(ref, () => setOpen(false))

  const handleApply = () => { onChange({ min, max }); setOpen(false) }
  const isActive = value?.min || value?.max

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-white ${open || isActive ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-700 hover:border-gray-400'}`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        SBUA
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4">
          <div className="flex items-center gap-2 mb-4">
            <input type="number" value={min} onChange={e => setMin(e.target.value)}
              className="w-0 flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8431A] transition-colors" />
            <span className="text-gray-400 text-sm font-medium flex-shrink-0">to</span>
            <input type="number" value={max} onChange={e => setMax(e.target.value)}
              className="w-0 flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#E8431A] transition-colors" />
          </div>
          <button onClick={handleApply}
            className="w-full bg-[#E8431A] hover:bg-[#cf3b16] text-white py-2 rounded-lg text-sm font-semibold transition-colors">
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

// ── Sort Dropdown ──────────────────────────────────────────────────────────────
const SortDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useOutsideClick(ref, () => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center justify-center border rounded-lg p-1.5 transition-colors bg-white ${open || selected ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}
      >
        <ArrowUpDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
          {SORT_OPTIONS.map(opt => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selected === opt ? 'text-[#E8431A] font-semibold bg-orange-50' : 'text-gray-700'}`}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode]             = useState('grid')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab]           = useState('resale')   // 'resale' | 'rental'
  const [currentPage, setCurrentPage]       = useState(2)
  const [assetType, setAssetType]           = useState(null)
  const [configuration, setConfiguration]   = useState([])
  const [budget, setBudget]                 = useState(null)
  const [sbua, setSbua]                     = useState(null)
  const [sortBy, setSortBy]                 = useState(null)
  const totalPages = 6

  const isRental    = activeTab === 'rental'
  const properties  = isRental ? RENTAL_PROPERTIES  : RESALE_PROPERTIES
  const tableData   = isRental ? RENTAL_TABLE_DATA   : RESALE_TABLE_DATA

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Category Bar + Toolbar ── */}
      <div className="bg-white border-b border-gray-100 px-6 flex items-center justify-between gap-4" style={{overflow:'visible'}}>
        {/* Categories */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {CATEGORIES.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setActiveCategory(id)}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium py-2 transition-colors whitespace-nowrap border-b-2 ${
                activeCategory === id ? 'text-[#E8431A] border-[#E8431A]' : 'text-gray-500 hover:text-gray-700 border-transparent'
              }`}>
              <Icon className={`w-5 h-5 ${activeCategory === id ? 'text-[#E8431A]' : 'text-gray-400'}`} />
              {label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Grid / Table toggle */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
            <button onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <List className="w-3.5 h-3.5" /> Table
            </button>
          </div>

          <AssetTypeDropdown selected={assetType} onChange={setAssetType} />
          <ConfigurationDropdown selected={configuration} onChange={setConfiguration} />
          <BudgetDropdown value={budget} onChange={setBudget} />
          <SBUADropdown value={sbua} onChange={setSbua} />
          <SortDropdown selected={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* ── Active filters ── */}
      {(assetType || configuration.length > 0 || budget?.min || budget?.max || sbua?.min || sbua?.max || sortBy) && (
        <div className="px-6 py-2 bg-white border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Active filters:</span>
          {assetType && (
            <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">
              {assetType}<button onClick={() => setAssetType(null)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {configuration.map(c => (
            <span key={c} className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">
              {c}<button onClick={() => setConfiguration(prev => prev.filter(x => x !== c))}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {(budget?.min || budget?.max) && (
            <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">
              Budget: {budget.min || '0'} – {budget.max || '∞'}
              <button onClick={() => setBudget(null)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {(sbua?.min || sbua?.max) && (
            <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">
              SBUA: {sbua.min} – {sbua.max}
              <button onClick={() => setSbua(null)}><X className="w-3 h-3" /></button>
            </span>
          )}
          {sortBy && (
            <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">
              {sortBy}<button onClick={() => setSortBy(null)}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* ── Content ── */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {properties.map((prop, i) => (
              <PropertyCard key={i} prop={prop} mode={activeTab} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Property ID</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Property Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Asset Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">SBUA (Sqft)</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Plot Size (Sqft)</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Facing</th>

                  {/* ── Mode-specific columns ── */}
                  {isRental ? (
                    <>
                      <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Rent (₹/month)</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Deposit</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Ask Price</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Price Per Sqft</th>
                    </>
                  )}

                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">{row.type}</td>
                    <td className="px-4 py-3 text-gray-600">{row.sbua}</td>
                    <td className="px-4 py-3 text-gray-400">{row.plot}</td>
                    <td className="px-4 py-3 text-gray-600">{row.facing}</td>

                    {/* ── Mode-specific cells ── */}
                    {isRental ? (
                      <>
                        <td className="px-4 py-3 text-gray-800 font-medium">{row.rent}</td>
                        <td className="px-4 py-3 text-gray-600">{row.deposit}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-gray-800 font-medium">{row.askPrice}</td>
                        <td className="px-4 py-3 text-gray-600">{row.priceSqft}</td>
                      </>
                    )}

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-lg p-1.5 transition-colors">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => navigate(`/property/details/${row.id}`)}
                          className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-lg p-1.5 transition-colors">
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-500">Showing 21-30 of 88 Results</p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} className="p-1 rounded hover:bg-gray-100 text-gray-500">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${currentPage === p ? 'bg-[#E8431A] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} className="p-1 rounded hover:bg-gray-100 text-gray-500">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                Items per page:
                <select className="border border-gray-300 rounded px-2 py-0.5 text-xs outline-none">
                  <option>10</option><option>20</option><option>30</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard