// src/modules/dashboard/PropertyDetail.jsx
import { useEffect, useState } from 'react'
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
  Loader2, ChevronDown, Play
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
  return val ? `${Number(val).toLocaleString()} sq.ft` : '—'
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
        <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide">
          {prop.propertyId}
        </span>
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
              <p className="text-xs font-bold text-gray-900">{formatSqft(pd.sbua)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">SBUA</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-900">{formatPrice(pd.askPrice, pd.priceUnit)}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Ask Price</p>
            </div>
          </div>
          <button onClick={e => e.stopPropagation()}
            className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-md px-2.5 py-2 flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors flex-shrink-0">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const PropertyDetail = () => {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const property      = useSelector(selectCurrentProperty)
  const loading       = useSelector(selectDetailLoading)
  const detailError   = useSelector(selectDetailError)
  const similar       = useSelector(selectSimilar)
  const similarLoading = useSelector(selectSimilarLoading)
  const deleting      = useSelector(selectDeleting)

  // FIX: media items = images + optional video
  const [activeMedia, setActiveMedia] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProperty(id))
      dispatch(fetchSimilar(id))
    }
    return () => { dispatch(clearCurrent()) }
  }, [id, dispatch])

  useEffect(() => { setActiveMedia(0) }, [property?._id])

  const handleDelete = async () => {
    const result = await dispatch(deleteProperty(id))
    if (deleteProperty.fulfilled.match(result)) {
      navigate('/', { replace: true })
    }
  }

  // FIX: Share button — copies URL to clipboard
  const handleShare = () => {
    const url = window.location.href
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!')
      }).catch(() => {
        prompt('Copy this link:', url)
      })
    } else {
      prompt('Copy this link:', url)
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
        <button onClick={() => navigate(-1)} className="text-sm font-semibold px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          ← Go back
        </button>
      </div>
    </div>
  )

  if (!property) return null

  const b   = property.basicDetails    || {}
  const pd  = property.propertyDetails || {}
  const md  = property.moreDetails     || {}

  const images = b.images?.length > 0 ? b.images : ['https://via.placeholder.com/800x600?text=No+Image']

  // FIX: Build media items — images first, then video last
  const mediaItems = [
    ...images.map(src => ({ type: 'image', src })),
    ...(b.videoUrl ? [{ type: 'video', src: b.videoUrl }] : []),
  ]
  const totalMedia = mediaItems.length
  const activeItem = mediaItems[activeMedia] || mediaItems[0]

  const isRental = b.listingType === 'RENTAL'
  const fullAddress = [b.address, b.area, b.city, b.state, b.pincode].filter(Boolean).join(', ')

  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* ── Left: Media carousel ── */}
          <div>
            <div className="relative rounded-xl overflow-hidden bg-gray-200 mb-2">
              <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide z-10">
                {property.propertyId}
              </span>

              {/* FIX: Show image or video based on active media type */}
              {activeItem?.type === 'video' ? (
                <video
                  src={activeItem.src}
                  className="w-full h-80 object-cover"
                  controls
                  key={activeItem.src}
                />
              ) : (
                <img
                  src={activeItem?.src}
                  alt={b.name}
                  className="w-full h-80 object-cover"
                />
              )}

              {totalMedia > 1 && (
                <>
                  <button onClick={() => setActiveMedia(i => Math.max(0, i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button onClick={() => setActiveMedia(i => Math.min(totalMedia - 1, i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors rotate-180">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}
            </div>

            {/* FIX: Thumbnails include video thumbnail */}
            {totalMedia > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {mediaItems.map((item, i) => (
                  item.type === 'video' ? (
                    <div key={i} onClick={() => setActiveMedia(i)}
                      className={`relative w-20 h-14 rounded-lg cursor-pointer flex-shrink-0 border-2 transition-colors bg-gray-800 flex items-center justify-center ${activeMedia === i ? 'border-[#E8431A]' : 'border-transparent hover:border-gray-300'}`}>
                      <Play className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <img key={i} src={item.src} alt="" onClick={() => setActiveMedia(i)}
                      className={`w-20 h-14 object-cover rounded-lg cursor-pointer flex-shrink-0 border-2 transition-colors ${activeMedia === i ? 'border-[#E8431A]' : 'border-transparent hover:border-gray-300'}`} />
                  )
                ))}
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
            {/* Price + Actions */}
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
                <ActionBtn onClick={handleShare} title="Share property link">
                  <Share2 className="w-3.5 h-3.5" />
                </ActionBtn>
                <ActionBtn onClick={() => {}} title="Assign to client">
                  <UserCheck className="w-3.5 h-3.5" />
                </ActionBtn>
                <ActionBtn variant="danger" onClick={() => setShowDeleteConfirm(true)} title="Delete property">
                  <Trash2 className="w-3.5 h-3.5" />
                </ActionBtn>
                {/* FIX: Edit button navigates to correct edit path */}
                <ActionBtn onClick={() => navigate(`/edit/${id}`)} title="Edit property">
                  <Pencil className="w-3.5 h-3.5" />
                </ActionBtn>
              </div>
            </div>

            {/* Property Details */}
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

            {/* Pricing */}
            <div className="mb-5">
              <SectionTitle>Pricing</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                {isRental ? (
                  <>
                    <InfoBadge label="Rent / Month"  value={formatPrice(pd.rentPerMonth, pd.rentUnit)} />
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

            {/* More Details */}
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

            {/* Inventory Details */}
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
              {similar.map(p => <MatchingCard key={p._id} prop={p} />)}
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