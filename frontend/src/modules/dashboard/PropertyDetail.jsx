// src/modules/dashboard/PropertyDetail.jsx
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProperty, fetchSimilar, deleteProperty, clearCurrent,
  selectCurrentProperty, selectDetailLoading, selectDetailError,
  selectSimilar, selectSimilarLoading,
  selectDeleting, selectDeleteError,
} from '../../redux/slices/inventoryslice'
import {
  MapPin, ChevronLeft, Share2, Trash2, Pencil, UserCheck,
  Bed, Bath, Expand, Calendar, ClipboardCheck, CheckCircle2,
  Loader2, Play, X, ZoomIn, ChevronRight, Copy, Check,
  MessageCircle, Send,, ChevronDown, Play
} from 'lucide-react'

const RED = '#E8431A'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(value, unit) {
  if (value == null || value === '') return '—'
  const num = Number(value)
  if (isNaN(num) || num === 0) return '—'
  // FIX: price is stored in Lakhs always. Convert correctly.
  // If unit is CRORES, value is already in crores equivalent stored as-is.
  // Store convention: askPrice stored as raw number in Lakhs.
  // e.g. 2 Cr = 200 Lakhs stored as 200, priceUnit = LAKHS
  // or stored as 2 with priceUnit = CRORES
  if (unit === 'CRORES') {
    return `₹${num.toFixed(2)} Cr`
  }
  // LAKHS
  if (num >= 100) return `₹${(num / 100).toFixed(2)} Cr`
  return `₹${num.toFixed(2)} L`
}

function formatSqft(val) {
  return val ? `${Number(val).toLocaleString()} sq.ft` : null
}

function timeAgo(date) {
  if (!date) return '—'
  const diff = Date.now() - new Date(date).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 30)  return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

function labelify(str) {
  if (!str) return '—'
  return str.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ── Build share message from property data ────────────────────────────────────
function buildShareMessage(property) {
  const b  = property?.basicDetails    || {}
  const pd = property?.propertyDetails || {}
  const md = property?.moreDetails     || {}

  const isRental  = b.listingType === 'RENTAL'
  const fullAddr  = [b.address, b.area, b.city, b.state, b.pincode].filter(Boolean).join(', ')

  const price = isRental
    ? formatPrice(pd.rentPerMonth, pd.rentUnit)
    : formatPrice(pd.askPrice, pd.priceUnit)

  const lines = []

  lines.push(`🏠 *${b.name}* [${property.propertyId}]`)
  lines.push(`📍 ${fullAddr || '—'}`)
  lines.push('')

  // Listing type badge
  lines.push(`🏷️ *Type:* ${isRental ? 'Rental' : 'Resale'} | ${labelify(b.assetType)}`)

  // Price
  if (isRental) {
    lines.push(`💰 *Rent:* ${price}/month`)
    if (pd.deposit) lines.push(`🔐 *Deposit:* ${formatPrice(pd.deposit, pd.depositUnit)}`)
    if (pd.maintenance) lines.push(`🔧 *Maintenance:* ${labelify(pd.maintenance)}`)
  } else {
    lines.push(`💰 *Ask Price:* ${price}`)
    if (pd.pricePerSqft) lines.push(`📐 *Price/Sq.ft:* ₹${Number(pd.pricePerSqft).toLocaleString()}`)
  }

  lines.push('')

  // Configuration
  const configLines = []
  if (b.bedrooms  > 0) configLines.push(`🛏️ ${b.bedrooms} Bedroom${b.bedrooms > 1 ? 's' : ''}`)
  if (b.bathrooms > 0) configLines.push(`🚿 ${b.bathrooms} Bathroom${b.bathrooms > 1 ? 's' : ''}`)
  if (b.balconies > 0) configLines.push(`🏡 ${b.balconies} Balcon${b.balconies > 1 ? 'ies' : 'y'}`)
  if (configLines.length > 0) lines.push(configLines.join('  |  '))

  // Property specs
  const specsLines = []
  if (pd.sbua)          specsLines.push(`📏 *SBUA:* ${formatSqft(pd.sbua)}`)
  if (pd.plotArea)      specsLines.push(`📏 *Plot Area:* ${formatSqft(pd.plotArea)}`)
  if (pd.doorFacing)    specsLines.push(`🧭 *Facing:* ${labelify(pd.doorFacing)}`)
  if (pd.furnishing)    specsLines.push(`🪑 *Furnishing:* ${labelify(pd.furnishing)}`)
  if (pd.ageOfBuilding) specsLines.push(`🏗️ *Age:* ${labelify(pd.ageOfBuilding)}`)
  if (pd.floorNumber)   specsLines.push(`🏢 *Floor:* ${labelify(pd.floorNumber)}`)
  if (pd.apartmentType) specsLines.push(`🏠 *Apt Type:* ${labelify(pd.apartmentType)}`)
  if (specsLines.length > 0) {
    lines.push('')
    specsLines.forEach(l => lines.push(l))
  }

  // More details
  const moreLines = []
  if (md.parking)          moreLines.push(`🚗 *Parking:* ${labelify(md.parking)}`)
  if (md.buildingKhata != null) moreLines.push(`📋 *B-Khata:* ${md.buildingKhata ? 'Yes' : 'No'}`)
  if (md.eKhata != null)   moreLines.push(`📋 *E-Khata:* ${md.eKhata ? 'Yes' : 'No'}`)
  if (md.cornerUnit != null) moreLines.push(`📐 *Corner Unit:* ${md.cornerUnit ? 'Yes' : 'No'}`)
  if (md.petAllowed != null) moreLines.push(`🐾 *Pet Allowed:* ${md.petAllowed ? 'Yes' : 'No'}`)
  if (md.extraRooms?.length > 0) moreLines.push(`🏠 *Extra Rooms:* ${md.extraRooms.map(labelify).join(', ')}`)
  if (md.preferredTenant)  moreLines.push(`👤 *Preferred Tenant:* ${labelify(md.preferredTenant)}`)
  if (moreLines.length > 0) {
    lines.push('')
    moreLines.forEach(l => lines.push(l))
  }

  // Amenities
  if (md.amenities?.length > 0) {
    lines.push('')
    lines.push(`✨ *Amenities:* ${md.amenities.map(labelify).join(' • ')}`)
  }

  // Possession
  if (b.possession) {
    lines.push('')
    lines.push(`🗓️ *Possession:* ${labelify(b.possession)}`)
  }

  // Description
  if (md.description) {
    lines.push('')
    lines.push(`📝 *Description:*`)
    lines.push(md.description)
  }

  lines.push('')
  lines.push(`---`)
  lines.push(`📞 *InfiniteRealty* — For more details, contact us!`)
  lines.push(`🔗 ${window.location.href}`)

  return lines.join('\n')
}

// ── Share Modal ───────────────────────────────────────────────────────────────
const ShareModal = ({ property, onClose }) => {
  const [copied, setCopied] = useState(false)
  const message = buildShareMessage(property)
  const encodedMsg = encodeURIComponent(message)

  const shareOptions = [
    {
      label: 'WhatsApp',
      color: '#25D366',
      bg: '#dcf8c6',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodedMsg}`,
    },
    {
      label: 'Telegram',
      color: '#0088cc',
      bg: '#d0eaf8',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#0088cc">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedMsg}`,
    },
    {
      label: 'SMS',
      color: '#6366f1',
      bg: '#ede9fe',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#6366f1">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
        </svg>
      ),
      url: `sms:?body=${encodedMsg}`,
    },
    {
      label: 'Email',
      color: '#ea4335',
      bg: '#fde8e7',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#ea4335">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      url: `mailto:?subject=${encodeURIComponent(`Property: ${property?.basicDetails?.name || ''}`)}&body=${encodedMsg}`,
    },
  ]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = message
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: property?.basicDetails?.name, text: message, url: window.location.href })
      } catch {}
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Share Property</h3>
            <p className="text-xs text-gray-400 mt-0.5">{property?.basicDetails?.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Message preview */}
        <div className="px-5 pt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Message Preview</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-40 overflow-y-auto">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">{message}</pre>
          </div>
        </div>

        {/* Share platforms */}
        <div className="px-5 pt-4">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Share via</p>
          <div className="grid grid-cols-4 gap-3">
            {shareOptions.map(opt => (
              <a
                key={opt.label}
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                  style={{ background: opt.bg }}
                >
                  {opt.icon}
                </div>
                <span className="text-[10px] font-medium text-gray-500">{opt.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 py-4 mt-3 flex gap-3">
          {/* Copy message */}
          <button
            onClick={handleCopy}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
              copied
                ? 'border-green-400 bg-green-50 text-green-600'
                : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Message'}
          </button>

          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button
              onClick={handleNativeShare}
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

// ── Fullscreen Lightbox ───────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [current, setCurrent] = useState(startIndex)

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: 'rgba(0,0,0,0.96)' }}
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={e => e.stopPropagation()}
      >
        <span className="text-white text-sm font-semibold tracking-wide">
          {current + 1} / {images.length}
        </span>
        <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-white/10">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-0" onClick={e => e.stopPropagation()}>
        {images.length > 1 && (
          <button onClick={prev} className="absolute left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/10 border border-white/20">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        <img
          key={current}
          src={images[current]}
          alt={`Image ${current + 1}`}
          className="max-w-full max-h-full object-contain select-none"
          style={{ maxHeight: 'calc(100vh - 160px)', animation: 'lbFadeIn 0.18s ease' }}
          draggable={false}
        />
        {images.length > 1 && (
          <button onClick={next} className="absolute right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/10 border border-white/20">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-3 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)} className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
              style={{ width: 64, height: 44, border: i === current ? `2px solid ${RED}` : '2px solid transparent', opacity: i === current ? 1 : 0.45 }}>
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
      <style>{`@keyframes lbFadeIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }`}</style>
    </div>
  )
}

function boolDisplay(val) {
  if (val == null) return null
  return val ? 'Yes' : 'No'
}

// ── Sub-components ────────────────────────────────────────────────────────────

const ActionBtn = ({ onClick, variant = 'primary', children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
      variant === 'danger'
        ? 'bg-red-100 hover:bg-red-200 text-red-600'
        : 'bg-[#E8431A] hover:bg-[#cf3b16] text-white'
    }`}
  >
    {children}
  </button>
)

const DetailCell = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-xs text-gray-400">{label}</p>
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" strokeWidth={1.8} />
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
)

const SectionTitle = ({ children }) => (
  <h3 className="text-base font-bold text-gray-900 border-b-2 border-gray-800 inline-block pb-0.5 mb-3">
    {children}
  </h3>
)

const InfoBadge = ({ label, value }) => (
  <div className="flex flex-col gap-0.5 bg-gray-50 rounded-lg px-3 py-2.5 border border-gray-100">
    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value}</p>
  </div>
)

const MChip = ({ label }) => (
  <span className="text-xs border border-gray-200 rounded-full px-2.5 py-0.5 text-gray-500 whitespace-nowrap bg-gray-50">
    {label}
  </span>
)

// FIX: Collapsible section component
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mb-4 border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-sm font-bold text-gray-800">{title}</span>
        <ChevronDown
          className="w-4 h-4 text-gray-500 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && <div className="px-4 py-3">{children}</div>}
    </div>
  )
}

const MatchingCard = ({ prop }) => {
  const navigate = useNavigate()
  const b  = prop.basicDetails    || {}
  const pd = prop.propertyDetails || {}
  const img = b.primaryImage || b.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'
  return (
    <div
      onClick={() => navigate(`/property/details/${prop._id}`)}
      className="bg-white rounded-md overflow-hidden shadow-md border border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      <div className="relative overflow-hidden">
        <img src={img} alt={b.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide">{prop.propertyId}</span>
        <span className="absolute bottom-3 left-3 bg-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
          {b.listingType === 'RENTAL' ? 'Rental' : 'Resale'}
        </span>
      </div>
      <div className="p-2">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <MChip label={labelify(b.assetType)} />
          {b.bedrooms ? <MChip label={`${b.bedrooms}BHK`} /> : null}
          {pd.doorFacing ? <MChip label={labelify(pd.doorFacing)} /> : null}
        </div>
        <p className="font-bold text-gray-900 text-sm leading-snug mb-1 truncate">{b.name}</p>
        <p className="flex items-center gap-1 text-xs text-gray-400 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: RED }} />{b.area || b.city || '—'}
        </p>
        <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 gap-2">
          <div className="flex items-center justify-around flex-1 border border-gray-300 rounded-sm py-2 px-1 gap-1">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">{pd.pricePerSqft ? `₹${Number(pd.pricePerSqft).toLocaleString()}` : '—'}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Price/Sq.ft</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">{formatSqft(pd.sbua) || '—'}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">SBUA</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">{formatPrice(pd.askPrice, pd.priceUnit)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Ask Price</p>
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onShare && onShare(prop) }}
            className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-md px-2.5 py-2 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors flex-shrink-0"
          >
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const PropertyDetail = () => {
  const { id }   = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const property       = useSelector(selectCurrentProperty)
  const loading        = useSelector(selectDetailLoading)
  const detailError    = useSelector(selectDetailError)
  const similar        = useSelector(selectSimilar)
  const similarLoading = useSelector(selectSimilarLoading)
  const deleting       = useSelector(selectDeleting)

  // FIX: media items = images + optional video
  const [activeMedia, setActiveMedia] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [lightboxIndex, setLightboxIndex]         = useState(null)
  const [shareProperty, setShareProperty]         = useState(null) // property to share (null = modal closed)

  useEffect(() => {
    if (id) {
      dispatch(fetchProperty(id))
      dispatch(fetchSimilar(id))
    }
    return () => { dispatch(clearCurrent()) }
  }, [id, dispatch])

  useEffect(() => { setActiveMedia(0) }, [property?._id])
  useEffect(() => { setActiveMedia(0) }, [property?._id])

  const handleDelete = async () => {
    const result = await dispatch(deleteProperty(id))
    if (deleteProperty.fulfilled.match(result)) {
      navigate('/', { replace: true })
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: RED }} />
        <p className="text-sm text-gray-400">Loading property…</p>
      </div>
    </div>
  )

  if (detailError) return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <p className="text-lg font-bold text-gray-800 mb-2">Could not load property</p>
        <p className="text-sm text-gray-500 mb-4">{detailError}</p>
        <button onClick={() => navigate(-1)} className="text-sm font-semibold px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">← Go back</button>
      </div>
    </div>
  )

  if (!property) return null

  const b   = property.basicDetails    || {}
  const pd  = property.propertyDetails || {}
  const md  = property.moreDetails     || {}
  const images     = b.images?.length > 0 ? b.images : ['https://via.placeholder.com/800x600?text=No+Image']
  const videoUrl   = b.videoUrl || null
  const hasVideo   = Boolean(videoUrl)
  const totalMedia = images.length + (hasVideo ? 1 : 0)
  const isRental   = b.listingType === 'RENTAL'
  const fullAddress = [b.address, b.area, b.city, b.state, b.pincode].filter(Boolean).join(', ')

  const goNext = () => setActiveMedia(cur => {
    if (cur === 'video') return 0
    const next = cur + 1
    return next >= images.length ? (hasVideo ? 'video' : 0) : next
  })

  const goPrev = () => setActiveMedia(cur => {
    if (cur === 'video') return images.length - 1
    return cur === 0 ? (hasVideo ? 'video' : images.length - 1) : cur - 1
  })

  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Share Modal ── */}
      {shareProperty && (
        <ShareModal property={shareProperty} onClose={() => setShareProperty(null)} />
      )}

      {/* ── Fullscreen Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox images={images} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* ── Left: Gallery ── */}
          <div>
            <div className="relative rounded-xl overflow-hidden bg-gray-200 mb-2 group/main">
              <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide z-10">
                {property.propertyId}
              </span>

              {activeMedia === 'video' && hasVideo ? (
                <video key={videoUrl} src={videoUrl} controls autoPlay className="w-full h-80 object-contain bg-black" />
              ) : (
                <>
                  <img
                    src={images[activeMedia]}
                    alt={b.name}
                    className="w-full h-80 object-cover cursor-zoom-in"
                    onClick={() => setLightboxIndex(activeMedia)}
                  />
                  <button
                    onClick={() => setLightboxIndex(activeMedia)}
                    className="absolute bottom-3 right-3 z-10 bg-black/50 hover:bg-black/75 text-white rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 text-[11px] font-medium transition-all opacity-0 group-hover/main:opacity-100"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Fullscreen
                  </button>
                  {images.length > 1 && (
                    <span className="absolute bottom-3 left-3 bg-black/50 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md z-10">
                      {activeMedia + 1} / {images.length}
                    </span>
                  )}
                </>
              )}

              {totalMedia > 1 && (
                <>
                  <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors z-10">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors rotate-180 z-10">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}

              {activeMedia === 'video' && (
                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 z-10">
                  <Play className="w-3 h-3" /> Video
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {totalMedia > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <div key={i} className="relative flex-shrink-0 group/thumb">
                    <img
                      src={img} alt=""
                      onClick={() => setActiveMedia(i)}
                      className={`w-20 h-14 object-cover rounded-lg cursor-pointer border-2 transition-colors ${activeMedia === i ? 'border-[#E8431A]' : 'border-transparent hover:border-gray-300'}`}
                    />
                    <button
                      onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                {hasVideo && (
                  <div
                    onClick={() => setActiveMedia('video')}
                    className={`relative w-20 h-14 rounded-lg cursor-pointer flex-shrink-0 border-2 overflow-hidden bg-black transition-colors ${activeMedia === 'video' ? 'border-[#E8431A]' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <video src={videoUrl} className="w-full h-full object-cover opacity-60" muted playsInline preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 rounded-full w-7 h-7 flex items-center justify-center shadow">
                        <svg viewBox="0 0 16 16" fill="#E8431A" className="w-3.5 h-3.5 ml-0.5"><path d="M4 2l10 6-10 6z" /></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* Quick info */}
            <div className="mt-3">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{b.name}</h2>
              <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: RED }} />{b.area || b.city || '—'}
              </p>
              <div className="flex flex-wrap gap-3">
                <InfoBadge label="Type" value={labelify(b.assetType)} />
                {b.bedrooms ? <InfoBadge label="Bedrooms" value={`${b.bedrooms} BHK`} /> : null}
                {pd.sbua ? <InfoBadge label="SBUA" value={`${Number(pd.sbua).toLocaleString()} sq.ft`} /> : null}
                {pd.plotArea ? <InfoBadge label="Plot Area" value={`${Number(pd.plotArea).toLocaleString()} sq.ft`} /> : null}
              </div>
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {isRental ? formatPrice(pd.rentPerMonth, pd.rentUnit) : formatPrice(pd.askPrice, pd.priceUnit)}
                  <span className="text-sm font-normal text-gray-500 ml-1">{isRental ? 'Rent/Month' : 'Ask Price'}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{fullAddress}</p>
              </div>
              {/* FIX: Edit navigates to correct route; Share copies URL */}
              <div className="flex items-center gap-2">
                {/* ── Share button ── */}
                <ActionBtn onClick={() => setShareProperty(property)} title="Share property">
                  <Share2 className="w-3.5 h-3.5" />
                </ActionBtn>
                <ActionBtn onClick={() => {}}><UserCheck className="w-3.5 h-3.5" /></ActionBtn>
                <ActionBtn variant="danger" onClick={() => setShowDeleteConfirm(true)}><Trash2 className="w-3.5 h-3.5" /></ActionBtn>
                <ActionBtn onClick={() => navigate(`/inventory/edit/${id}`)}><Pencil className="w-3.5 h-3.5" /></ActionBtn>
              </div>
            </div>

            <div className="mb-5">
              <SectionTitle>Property Details</SectionTitle>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {pd.apartmentType && <DetailCell icon={CheckCircle2} label="Apartment Type"  value={labelify(pd.apartmentType)} />}
                {pd.doorFacing    && <DetailCell icon={CheckCircle2} label="Door Facing"     value={labelify(pd.doorFacing)} />}
                {pd.ageOfBuilding && <DetailCell icon={Calendar}     label="Age of Building" value={labelify(pd.ageOfBuilding)} />}
                {pd.furnishing    && <DetailCell icon={CheckCircle2} label="Furnishing"      value={labelify(pd.furnishing)} />}
                {pd.floorNumber   && <DetailCell icon={CheckCircle2} label="Floor Number"    value={labelify(pd.floorNumber)} />}
                {/* FIX: structure displayed for Villa, IH, Row House, Villament, Commercial Property */}
                {pd.structure     && <DetailCell icon={CheckCircle2} label="Structure"       value={labelify(pd.structure)} />}
                {/* FIX: totalFloors displayed for Retail Space and Rental */}
                {pd.totalFloors   && <DetailCell icon={CheckCircle2} label="Total Floors"    value={pd.totalFloors} />}
                {/* FIX: totalRooms displayed for Commercial Property */}
                {pd.totalRooms    && <DetailCell icon={CheckCircle2} label="Total Rooms"     value={pd.totalRooms} />}
                {/* FIX: waterSupply displayed */}
                {pd.waterSupply   && <DetailCell icon={CheckCircle2} label="Water Supply"    value={labelify(pd.waterSupply)} />}
                {b.bedrooms != null && b.bedrooms > 0 && <DetailCell icon={Bed}    label="Bedrooms"  value={b.bedrooms} />}
                {b.bathrooms != null && b.bathrooms > 0 && <DetailCell icon={Bath}  label="Bathrooms" value={b.bathrooms} />}
                {b.balconies != null && b.balconies > 0 && <DetailCell icon={Expand} label="Balconies" value={b.balconies} />}
                {/* FIX: No. of Seats for Office Space */}
                {b.seats && <DetailCell icon={CheckCircle2} label="No. of Seats" value={b.seats} />}
                {/* FIX: UDS for Villament */}
                {pd.uds && <DetailCell icon={CheckCircle2} label="UDS" value={formatSqft(pd.uds)} />}
              </div>
            </div>

            <div className="mb-5">
              <SectionTitle>Pricing</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                {isRental ? (
                  <>
                    <InfoBadge label="Rent / Month" value={formatPrice(pd.rentPerMonth, pd.rentUnit)} />
                    {pd.deposit != null && <InfoBadge label="Deposit" value={formatPrice(pd.deposit, pd.depositUnit)} />}
                    {pd.maintenance && <InfoBadge label="Maintenance" value={labelify(pd.maintenance)} />}
                    {/* FIX: commission displayed */}
                    {pd.commissionType && <InfoBadge label="Commission" value={labelify(pd.commissionType)} />}
                  </>
                ) : (
                  <>
                    <InfoBadge label="Ask Price"  value={formatPrice(pd.askPrice, pd.priceUnit)} />
                    {pd.pricePerSqft && <InfoBadge label="Price/Sq.ft" value={`₹${Number(pd.pricePerSqft).toLocaleString()}`} />}
                    {pd.sbua         && <InfoBadge label="SBUA"        value={`${Number(pd.sbua).toLocaleString()} sq.ft`} />}
                    {/* FIX: plot area shown in pricing too if applicable */}
                    {pd.plotArea     && <InfoBadge label="Plot Area"   value={`${Number(pd.plotArea).toLocaleString()} sq.ft`} />}
                  </>
                )}
              </div>
            </div>

            <div className="mb-5">
              <SectionTitle>More Details</SectionTitle>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {/* FIX: Building Khata displayed (was missing) */}
                {md.buildingKhata != null && md.buildingKhata !== '' &&
                  <DetailCell icon={CheckCircle2} label="Building Khata" value={typeof md.buildingKhata === 'boolean' ? (md.buildingKhata ? 'Yes' : 'No') : md.buildingKhata} />}
                {/* FIX: Land Khata displayed */}
                {md.landKhata != null && md.landKhata !== '' &&
                  <DetailCell icon={CheckCircle2} label="Land Khata" value={typeof md.landKhata === 'boolean' ? (md.landKhata ? 'Yes' : 'No') : md.landKhata} />}
                {md.eKhata != null &&
                  <DetailCell icon={CheckCircle2} label="E Khata" value={boolDisplay(md.eKhata)} />}
                {md.parking &&
                  <DetailCell icon={CheckCircle2} label="Parking" value={labelify(md.parking)} />}
                {md.cornerUnit != null &&
                  <DetailCell icon={CheckCircle2} label="Corner Unit" value={boolDisplay(md.cornerUnit)} />}
                {/* FIX: B-Khata (bioppaApprovedKhata) */}
                {md.bioppaApprovedKhata != null &&
                  <DetailCell icon={CheckCircle2} label="Bioppa Khata" value={boolDisplay(md.bioppaApprovedKhata)} />}
                {/* FIX: Exclusive */}
                {md.exclusive != null &&
                  <DetailCell icon={CheckCircle2} label="Exclusive" value={boolDisplay(md.exclusive)} />}
                {/* FIX: No. of Assets (seats for Office Space) */}
                {b.seats != null && b.seats > 0 &&
                  <DetailCell icon={CheckCircle2} label="No. of Assets" value={b.seats} />}
                {md.extraRooms?.length > 0 &&
                  <DetailCell icon={CheckCircle2} label="Extra Rooms" value={md.extraRooms.map(labelify).join(', ')} />}
                {md.preferredTenant &&
                  <DetailCell icon={CheckCircle2} label="Preferred Tenant" value={labelify(md.preferredTenant)} />}
                {md.petAllowed != null &&
                  <DetailCell icon={CheckCircle2} label="Pet Allowed" value={boolDisplay(md.petAllowed)} />}
                {md.nonVegAllowed != null &&
                  <DetailCell icon={CheckCircle2} label="Non-Veg Allowed" value={boolDisplay(md.nonVegAllowed)} />}
                {/* FIX: Balcony Facing */}
                {pd.balconyFacing &&
                  <DetailCell icon={CheckCircle2} label="Balcony Facing" value={labelify(pd.balconyFacing)} />}
              </div>
            </div>

            <div className="mb-5">
              <SectionTitle>Inventory Details</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <DetailCell icon={Calendar}       label="Listed"                 value={timeAgo(property.createdAt)} />
                <DetailCell icon={ClipboardCheck} label="Inventory Last Checked" value={timeAgo(property.lastCheckedAt)} />
              </div>
            </div>

            {/* FIX: Amenities as collapsible */}
            {md.amenities?.length > 0 && (
              <CollapsibleSection title={`Amenities (${md.amenities.length})`}>
                <div className="flex flex-wrap gap-2">
                  {md.amenities.map(a => (
                    <span key={a} className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-3 py-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> {labelify(a)}
                    </span>
                  ))}
                </div>
              </CollapsibleSection>
            )}

            {/* FIX: Description as collapsible */}
            {md.description && (
              <CollapsibleSection title="Description">
                <p className="text-sm text-gray-500 leading-relaxed">{md.description}</p>
              </CollapsibleSection>
            )}
          </div>
        </div>

        {/* ── Similar / Matching ── */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Matching Requirements</h3>
          {similarLoading ? (
            <div className="flex items-center gap-2 text-gray-400 py-4">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: RED }} />
              <span className="text-sm">Loading similar properties…</span>
            </div>
          ) : similar.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map(p => (
                <MatchingCard key={p._id} prop={p} onShare={setShareProperty} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4">No similar properties found.</p>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <p className="text-lg font-bold text-gray-900 mb-2">Delete Property?</p>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 text-sm font-semibold px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 text-sm font-semibold px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail