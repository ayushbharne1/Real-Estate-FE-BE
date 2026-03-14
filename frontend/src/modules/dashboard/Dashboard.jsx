// src/modules/dashboard/Dashboard.jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid, List, ChevronDown, MapPin, Share2,
  ChevronLeft, ChevronRight,
  Building2, LayoutGrid, Home, Landmark, TreePine,
  Warehouse, Store, X, Loader2, Copy, Check,
} from 'lucide-react'
import {
  fetchProperties,
  selectInventoryList,
  selectInventoryTotal,
  selectInventoryPages,
  selectListLoading,
  selectListError,
} from '../../redux/slices/inventoryslice'

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all',        label: 'All',        Icon: LayoutGrid, assetFilter: null },
  { id: 'commercial', label: 'Commercial', Icon: Building2,  assetFilter: ['COMMERCIAL_SPACE','COMMERCIAL_PROPERTY','OFFICE_SPACE','RETAIL_SPACE'] },
  { id: 'apartment',  label: 'Apartment',  Icon: Home,       assetFilter: ['APARTMENT'] },
  { id: 'plot',       label: 'Plot',       Icon: Landmark,   assetFilter: ['PLOT'] },
  { id: 'villas',     label: 'Villas',     Icon: TreePine,   assetFilter: ['VILLA','VILAMENT','INDEPENDENT_HOUSE','ROW_HOUSE'] },
]

const ASSET_TYPES = [
  { label: 'Apartment',           value: 'APARTMENT',           Icon: Home },
  { label: 'Plot',                value: 'PLOT',                Icon: Landmark },
  { label: 'Villa',               value: 'VILLA',               Icon: TreePine },
  { label: 'Independent House',   value: 'INDEPENDENT_HOUSE',   Icon: Home },
  { label: 'Commercial Space',    value: 'COMMERCIAL_SPACE',    Icon: Building2 },
  { label: 'Row House',           value: 'ROW_HOUSE',           Icon: Home },
  { label: 'Commercial Property', value: 'COMMERCIAL_PROPERTY', Icon: Warehouse },
  { label: 'Villament',           value: 'VILAMENT',            Icon: Home },
  { label: 'Office Space',        value: 'OFFICE_SPACE',        Icon: Building2 },
  { label: 'Retail Space',        value: 'RETAIL_SPACE',        Icon: Store },
]

const BHK_OPTIONS = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK']

const SORT_OPTIONS = [
  { label: 'Price: Low to High',      value: 'PRICE_LOW_TO_HIGH' },
  { label: 'Price: High to Low',      value: 'PRICE_HIGH_TO_LOW' },
  { label: 'Newest First',            value: 'NEWEST_FIRST' },
  { label: 'Oldest First',            value: 'OLDEST_FIRST' },
  { label: 'Price/Sqft: Low to High', value: 'PRICE_SQFT_LOW_TO_HIGH' },
  { label: 'Price/Sqft: High to Low', value: 'PRICE_SQFT_HIGH_TO_LOW' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const RED = '#E8431A'

function formatPrice(value, unit) {
  if (value == null || value === '') return '—'
  const num = Number(value)
  if (isNaN(num) || num === 0) return '—'
  if (unit === 'CRORES') return `₹${num.toFixed(2)} Cr`
  if (num >= 100) return `₹${(num / 100).toFixed(2)} Cr`
  return `₹${num.toFixed(2)} L`
}

function formatSqft(val) {
  return val ? `${Number(val).toLocaleString()} sq.ft` : '—'
}

function formatPriceSqft(val) {
  return val ? `₹${Number(val).toLocaleString()}` : '—'
}

function getBHKLabel(bedrooms) {
  if (!bedrooms) return null
  return `${bedrooms}BHK`
}

function getAssetLabel(assetType) {
  return ASSET_TYPES.find(a => a.value === assetType)?.label || assetType || '—'
}

function labelify(str) {
  if (!str) return '—'
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function buildShareMessage(prop) {
  const b  = prop?.basicDetails    || {}
  const pd = prop?.propertyDetails || {}
  const isRental  = b.listingType === 'RENTAL'
  const fullAddr  = [b.address, b.area, b.city, b.state, b.pincode].filter(Boolean).join(', ')
  const price = isRental
    ? formatPrice(pd.rentPerMonth, pd.rentUnit)
    : formatPrice(pd.askPrice, pd.priceUnit)
  const lines = []
  lines.push(`🏠 *${b.name}* [${prop.propertyId}]`)
  lines.push(`📍 ${fullAddr || '—'}`)
  lines.push('')
  lines.push(`🏷️ *Type:* ${isRental ? 'Rental' : 'Resale'} | ${labelify(b.assetType)}`)
  if (b.bedrooms)     lines.push(`🛏 *BHK:* ${b.bedrooms} BHK`)
  if (pd.sbua)        lines.push(`📐 *SBUA:* ${formatSqft(pd.sbua)}`)
  if (pd.pricePerSqft && !isRental) lines.push(`💰 *Price/Sqft:* ${formatPriceSqft(pd.pricePerSqft)}`)
  lines.push(`💵 *${isRental ? 'Rent' : 'Ask Price'}:* ${price}`)
  if (isRental && pd.deposit) lines.push(`🔒 *Deposit:* ${formatPrice(pd.deposit, pd.depositUnit)}`)
  lines.push('')
  lines.push(`🔗 ${window.location.origin}/property/details/${prop._id}`)
  return lines.join('\n')
}

// ── Share Modal ───────────────────────────────────────────────────────────────
const ShareModal = ({ prop, onClose }) => {
  const [copied, setCopied] = useState(false)
  const message = buildShareMessage(prop)
  const propUrl = `${window.location.origin}/property/details/${prop._id}`
  const copy = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">Share Property</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-gray-400" /></button>
        </div>
        <pre className="text-xs text-gray-600 bg-gray-50 rounded-xl p-3 whitespace-pre-wrap font-sans mb-4 max-h-48 overflow-y-auto border border-gray-100">{message}</pre>
        <div className="flex gap-2">
          <button onClick={copy}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${copied ? 'border-green-400 bg-green-50 text-green-600' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Message'}
          </button>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={async () => { try { await navigator.share({ title: prop?.basicDetails?.name, text: message, url: propUrl }) } catch {} }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-[#E8431A] text-white hover:bg-[#cf3b16] transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── PropertyCard ──────────────────────────────────────────────────────────────
const Chip = ({ label }) => (
  <span className="text-xs border border-gray-200 rounded-full px-3 py-1 text-gray-500 whitespace-nowrap bg-gray-50">{label}</span>
)

const PropertyCard = ({ prop, mode, onShare }) => {
  const navigate   = useNavigate()
  const isRental   = mode === 'rental'
  const b          = prop.basicDetails || {}
  const pd         = prop.propertyDetails || {}
  const img        = b.primaryImage || b.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
  const bhk        = getBHKLabel(b.bedrooms)
  const facing     = pd.doorFacing?.replace(/_/g, ' ') || null
  const priceLabel = isRental ? formatPrice(pd.rentPerMonth, pd.rentUnit) : formatPrice(pd.askPrice, pd.priceUnit)
  const depositLabel = isRental ? formatPrice(pd.deposit, pd.depositUnit) : null

  return (
    <div onClick={() => navigate(`/property/details/${prop._id}`)}
      className="bg-white rounded-md overflow-hidden shadow-md border border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="relative overflow-hidden">
        <img src={img} alt={b.name} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide">{prop.propertyId}</span>
        <span className={`absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-md ${isRental ? 'bg-[#E8431A]' : 'bg-[#E8431A]'}`}>
          {isRental ? 'Rental' : 'Resale'}
        </span>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <Chip label={getAssetLabel(b.assetType)} />
          {bhk    && <Chip label={bhk} />}
          {facing && <Chip label={labelify(facing)} />}
        </div>
        <p className="font-bold text-gray-900 text-sm leading-snug mb-1 truncate">{b.name}</p>
        <p className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: RED }} />{b.area || b.city || '—'}
        </p>
        <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 gap-2">
          <div className="flex items-center justify-around flex-1 border border-gray-300 rounded-sm py-2 px-1 gap-1">
            {isRental ? (
              <>
                <div className="text-center"><p className="text-xs font-bold text-gray-900">{priceLabel}</p><p className="text-[10px] text-gray-400 mt-0.5">Rent</p></div>
                <div className="text-center"><p className="text-xs font-bold text-gray-900">{depositLabel || '—'}</p><p className="text-[10px] text-gray-400 mt-0.5">Deposit</p></div>
                <div className="text-center"><p className="text-xs font-bold text-gray-900">{formatSqft(pd.sbua)}</p><p className="text-[10px] text-gray-400 mt-0.5">SBUA</p></div>
              </>
            ) : (
              <>
                <div className="text-center"><p className="text-xs font-bold text-gray-900">{formatPriceSqft(pd.pricePerSqft)}</p><p className="text-[10px] text-gray-400 mt-0.5">Price/Sq.ft</p></div>
                <div className="text-center"><p className="text-xs font-bold text-gray-900">{formatSqft(pd.sbua)}</p><p className="text-[10px] text-gray-400 mt-0.5">SBUA</p></div>
                <div className="text-center"><p className="text-xs font-bold text-gray-900">{priceLabel}</p><p className="text-[10px] text-gray-400 mt-0.5">Ask Price</p></div>
              </>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); onShare(prop) }}
            className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-md px-2.5 py-2 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors flex-shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Dropdown components ───────────────────────────────────────────────────────

const AssetTypeDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${selected ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
        <Building2 className="w-4 h-4" /> Asset Type <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 max-h-72 overflow-y-auto">
          {ASSET_TYPES.map(({ label, value, Icon }) => (
            <button key={value} onClick={() => { onChange(selected === value ? null : value); setOpen(false) }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selected === value ? 'text-[#E8431A] font-semibold bg-orange-50' : 'text-gray-700'}`}>
              <span className="flex items-center gap-2"><Icon className="w-4 h-4" />{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const ConfigurationDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${selected.length > 0 ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
        <Home className="w-4 h-4" /> Configuration <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-3">
          <div className="flex gap-2 flex-wrap mb-3">
            {BHK_OPTIONS.map(bhk => (
              <button key={bhk}
                onClick={() => onChange(selected.includes(bhk) ? selected.filter(x => x !== bhk) : [...selected, bhk])}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${selected.includes(bhk) ? 'bg-[#E8431A] text-white border-[#E8431A]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {bhk}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { onChange([]); setOpen(false) }} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={() => setOpen(false)} className="text-xs px-3 py-1.5 rounded-lg bg-[#E8431A] text-white hover:bg-[#cf3b16]">Apply</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Budget Dropdown (fixed) ───────────────────────────────────────────────────
const BudgetDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [min, setMin]   = useState('')
  const [max, setMax]   = useState('')
  const ref = useRef(null)

  const handleOpen = () => {
    setMin(value?.min || '')
    setMax(value?.max || '')
    setOpen(true)
  }

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const apply = () => {
    if (min || max) onChange({ min, max })
    else onChange(null)
    setOpen(false)
  }

  const cancel = () => {
    onChange(null)
    setMin('')
    setMax('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${
          value ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-600 hover:border-gray-400'
        }`}
      >
        Budget <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            Budget Range <span className="font-normal normal-case text-gray-400">(in Lakhs)</span>
          </p>
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-semibold mb-1.5 block uppercase tracking-wide">Min</label>
              <input
                value={min}
                onChange={e => setMin(e.target.value)}
                placeholder="e.g. 50"
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E8431A] focus:ring-2 focus:ring-orange-50 transition-all bg-gray-50 placeholder-gray-300"
              />
            </div>
            <div className="pb-2.5 text-gray-300 font-bold text-lg select-none">—</div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-semibold mb-1.5 block uppercase tracking-wide">Max</label>
              <input
                value={max}
                onChange={e => setMax(e.target.value)}
                placeholder="e.g. 500"
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E8431A] focus:ring-2 focus:ring-orange-50 transition-all bg-gray-50 placeholder-gray-300"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancel}
              className="flex-1 text-sm font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={apply}
              className="flex-1 text-sm font-semibold py-2.5 rounded-xl bg-[#E8431A] text-white hover:bg-[#cf3b16] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── SBUA Dropdown (fixed) ─────────────────────────────────────────────────────
const SBUADropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false)
  const [min, setMin]   = useState('')
  const [max, setMax]   = useState('')
  const ref = useRef(null)

  const handleOpen = () => {
    setMin(value?.min || '')
    setMax(value?.max || '')
    setOpen(true)
  }

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const apply = () => {
    if (min || max) onChange({ min, max })
    else onChange(null)
    setOpen(false)
  }

  const cancel = () => {
    onChange(null)
    setMin('')
    setMax('')
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${
          value ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-600 hover:border-gray-400'
        }`}
      >
        SBUA <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
            SBUA Range <span className="font-normal normal-case text-gray-400">(Sq.ft)</span>
          </p>
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-semibold mb-1.5 block uppercase tracking-wide">Min</label>
              <input
                value={min}
                onChange={e => setMin(e.target.value)}
                placeholder="e.g. 500"
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E8431A] focus:ring-2 focus:ring-orange-50 transition-all bg-gray-50 placeholder-gray-300"
              />
            </div>
            <div className="pb-2.5 text-gray-300 font-bold text-lg select-none">—</div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-semibold mb-1.5 block uppercase tracking-wide">Max</label>
              <input
                value={max}
                onChange={e => setMax(e.target.value)}
                placeholder="e.g. 5000"
                type="number"
                min="0"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#E8431A] focus:ring-2 focus:ring-orange-50 transition-all bg-gray-50 placeholder-gray-300"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cancel}
              className="flex-1 text-sm font-semibold py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={apply}
              className="flex-1 text-sm font-semibold py-2.5 rounded-xl bg-[#E8431A] text-white hover:bg-[#cf3b16] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const SortDropdown = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border rounded-lg transition-colors ${selected ? 'border-[#E8431A] text-[#E8431A]' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
        {selected ? SORT_OPTIONS.find(s => s.value === selected)?.label : 'Sort'} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2">
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => { onChange(selected === opt.value ? null : opt.value); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selected === opt.value ? 'text-[#E8431A] font-semibold bg-orange-50' : 'text-gray-700'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Pagination ────────────────────────────────────────────────────────────────
const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, onItemsPerPageChange }) => {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Per page:</span>
        <select value={itemsPerPage} onChange={e => { onItemsPerPageChange(Number(e.target.value)); onPageChange(1) }}
          className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-700 outline-none focus:border-[#E8431A] cursor-pointer">
          {[10, 20, 30, 40, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span className="ml-2">Total: {totalItems}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map(p => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === p ? 'bg-[#E8431A] text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const items      = useSelector(selectInventoryList)
  const total      = useSelector(selectInventoryTotal)
  const totalPages = useSelector(selectInventoryPages)
  const loading    = useSelector(selectListLoading)
  const listError  = useSelector(selectListError)

  const [viewMode,        setViewMode]        = useState('grid')
  const [activeCategory,  setActiveCategory]  = useState('all')
  const [activeTab,       setActiveTab]       = useState('resale')
  const [assetType,       setAssetType]       = useState(null)
  const [configuration,   setConfiguration]   = useState([])
  const [budget,          setBudget]          = useState(null)
  const [sbua,            setSbua]            = useState(null)
  const [sortBy,          setSortBy]          = useState(null)
  const [page,            setPage]            = useState(1)
  const [limit,           setLimit]           = useState(10)
  const [shareprop,       setShareprop]       = useState(null)
  const [inputSearch,     setInputSearch]     = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const debounceRef = useRef(null)

  // Listen for search events from Navbar
  useEffect(() => {
    const handler = (e) => {
      const q = e.detail || ''
      setInputSearch(q)
      clearTimeout(debounceRef.current)
      setDebouncedSearch(q)
      setPage(1)
    }
    window.addEventListener('navbar:search', handler)
    return () => window.removeEventListener('navbar:search', handler)
  }, [])

  // Debounce typed search
  const handleSearchInput = (val) => {
    setInputSearch(val)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(val)
      setPage(1)
    }, 400)
  }

  const isRental = activeTab === 'rental'

  const buildParams = useCallback(() => {
    const categoryObj = CATEGORIES.find(c => c.id === activeCategory)
    const params = { listingType: isRental ? 'RENTAL' : 'RESALE', page, limit }
    if (assetType) { params.assetType = assetType }
    else if (categoryObj?.assetFilter?.length === 1) { params.assetType = categoryObj.assetFilter[0] }
    if (configuration.length > 0) {
      params.bhkTypes = configuration.map(b => b.replace('BHK', ''))
    }
    if (budget?.min) params.budgetMin = budget.min
    if (budget?.max) params.budgetMax = budget.max
    if (sbua?.min)   params.sbuaMin   = sbua.min
    if (sbua?.max)   params.sbuaMax   = sbua.max
    if (sortBy)      params.sortBy    = sortBy
    if (debouncedSearch) params.search = debouncedSearch
    return params
  }, [isRental, activeCategory, assetType, configuration, budget, sbua, sortBy, page, limit, debouncedSearch])

  useEffect(() => { dispatch(fetchProperties(buildParams())) }, [dispatch, buildParams])

  const handleTabChange = (tab) => {
    setActiveTab(tab); setPage(1); setAssetType(null)
    setConfiguration([]); setBudget(null); setSbua(null); setSortBy(null)
  }
  const handleCategoryChange = (cat) => { setActiveCategory(cat); setPage(1); setAssetType(null) }
  const hasFilters = assetType || configuration.length > 0 || budget?.min || budget?.max || sbua?.min || sbua?.max || sortBy || debouncedSearch

  return (
    <div className="bg-white min-h-[80vh]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {shareprop && <ShareModal prop={shareprop} onClose={() => setShareprop(null)} />}

      {/* ── Sticky Header ── */}
      <div className="sticky top-0 left-0 w-full z-10 bg-white border-b border-gray-100 px-6 flex items-center justify-between gap-4" style={{ overflow: 'visible' }}>
        <div className="flex items-center gap-6 flex-shrink-0">
          {CATEGORIES.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => handleCategoryChange(id)}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium py-3 transition-colors whitespace-nowrap border-b-2 ${activeCategory === id ? 'text-[#E8431A] border-[#E8431A]' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}>
              <Icon className={`w-5 h-5 ${activeCategory === id ? 'text-[#E8431A]' : 'text-gray-400'}`} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
          {['resale', 'rental'].map(t => (
            <button key={t} onClick={() => handleTabChange(t)}
              className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors ${activeTab === t ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
            <button onClick={() => setViewMode('table')} className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
              <List className="w-3.5 h-3.5" /> Table
            </button>
          </div>
          <AssetTypeDropdown selected={assetType} onChange={v => { setAssetType(v); setPage(1) }} />
          <ConfigurationDropdown selected={configuration} onChange={v => { setConfiguration(v); setPage(1) }} />
          <BudgetDropdown value={budget} onChange={v => { setBudget(v); setPage(1) }} />
          <SBUADropdown value={sbua} onChange={v => { setSbua(v); setPage(1) }} />
          <SortDropdown selected={sortBy} onChange={v => { setSortBy(v); setPage(1) }} />
        </div>
      </div>

      {/* ── Active Filters ── */}
      {hasFilters && (
        <div className="px-6 py-2 bg-white border-b border-gray-100 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Active filters:</span>
          {debouncedSearch && <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">"{debouncedSearch}"<button onClick={() => { setInputSearch(''); setDebouncedSearch(''); setPage(1) }}><X className="w-3 h-3" /></button></span>}
          {assetType && <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">{getAssetLabel(assetType)}<button onClick={() => setAssetType(null)}><X className="w-3 h-3" /></button></span>}
          {configuration.map(c => <span key={c} className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">{c}<button onClick={() => setConfiguration(prev => prev.filter(x => x !== c))}><X className="w-3 h-3" /></button></span>)}
          {(budget?.min || budget?.max) && <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">Budget: {budget.min || '0'}–{budget.max || '∞'}<button onClick={() => setBudget(null)}><X className="w-3 h-3" /></button></span>}
          {(sbua?.min || sbua?.max) && <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">SBUA: {sbua.min}–{sbua.max}<button onClick={() => setSbua(null)}><X className="w-3 h-3" /></button></span>}
          {sortBy && <span className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-2.5 py-0.5 font-medium">{SORT_OPTIONS.find(s => s.value === sortBy)?.label || sortBy}<button onClick={() => setSortBy(null)}><X className="w-3 h-3" /></button></span>}
        </div>
      )}

      {/* ── Content ── */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-3" style={{ color: RED }} />
            <p className="text-sm font-medium">Loading properties…</p>
          </div>
        ) : listError ? (
          <div className="flex flex-col items-center justify-center py-20"><p className="text-sm font-medium text-red-500">{listError}</p></div>
        ) : viewMode === 'grid' ? (
          <>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map(prop => <PropertyCard key={prop._id} prop={prop} mode={activeTab} onShare={setShareprop} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <LayoutGrid className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">No properties found</p>
              </div>
            )}
            {total > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={limit} onItemsPerPageChange={n => { setLimit(n); setPage(1) }} />}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b border-orange-200 bg-orange-100">
                  <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Sr No.</th>
                  <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Property ID</th>
                  <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Property Name</th>
                  <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Asset Type</th>
                  <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">SBUA (Sqft)</th>
                  <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Plot Size</th>
                  <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Facing</th>
                  {isRental ? (
                    <>
                      <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Rent/Month</th>
                      <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Deposit</th>
                    </>
                  ) : (
                    <>
                      <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Price/Sqft</th>
                      <th className="text-left px-4 py-3 text-gray-900 font-semibold text-xs uppercase tracking-wide">Ask Price</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-16 text-gray-400 text-sm">No properties found</td></tr>
                ) : items.map((prop, idx) => {
                  const b  = prop.basicDetails    || {}
                  const pd = prop.propertyDetails || {}
                  return (
                    <tr key={prop._id} onClick={() => navigate(`/property/details/${prop._id}`)}
                      className="border-b border-gray-100 hover:bg-orange-50 cursor-pointer transition-colors">
                      <td className="px-4 py-3 text-gray-500 text-xs">{(page-1)*limit + idx + 1}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold text-[#E8431A]">{prop.propertyId}</span></td>
                      <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px] truncate">{b.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{getAssetLabel(b.assetType)}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{formatSqft(pd.sbua)}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{pd.plotArea ? formatSqft(pd.plotArea) : '—'}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{pd.doorFacing ? labelify(pd.doorFacing) : '—'}</td>
                      {isRental ? (
                        <>
                          <td className="px-4 py-3 text-gray-800 text-xs font-semibold">{formatPrice(pd.rentPerMonth, pd.rentUnit)}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{formatPrice(pd.deposit, pd.depositUnit)}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-gray-600 text-xs">{formatPriceSqft(pd.pricePerSqft)}</td>
                          <td className="px-4 py-3 text-gray-800 text-xs font-semibold">{formatPrice(pd.askPrice, pd.priceUnit)}</td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {total > 0 && (
              <div className="p-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={total} itemsPerPage={limit} onItemsPerPageChange={n => { setLimit(n); setPage(1) }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard