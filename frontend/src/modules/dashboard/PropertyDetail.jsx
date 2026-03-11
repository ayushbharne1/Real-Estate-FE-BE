// src/modules/dashboard/PropertyDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProperty, fetchSimilar, deleteProperty, clearCurrent,
  selectCurrentProperty, selectDetailLoading, selectDetailError,
  selectSimilar, selectSimilarLoading,
  selectDeleting, selectDeleteError,
} from '../../redux/slices/inventorySlice'
import {
  MapPin, ChevronLeft, Share2, Trash2, Pencil, UserCheck,
  Bed, Bath, Expand, Calendar, ClipboardCheck, CheckCircle2,
  Loader2
} from 'lucide-react'
import { useNavigate as useNav } from 'react-router-dom'

const RED = '#E8431A'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(value, unit) {
  if (!value) return '—'
  const num = Number(value)
  if (unit === 'CRORES' || num >= 100) return `₹${(num / 100).toFixed(2)} Cr`
  if (unit === 'LAKHS' || num < 100)   return `₹${num.toFixed(2)} L`
  return `₹${num}`
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

// ── Sub-components ────────────────────────────────────────────────────────────

const ActionBtn = ({ onClick, variant = 'primary', children }) => (
  <button
    onClick={onClick}
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

// ── Main Page ──────────────────────────────────────────────────────────────────
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

  const [activeImg, setActiveImg] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProperty(id))
      dispatch(fetchSimilar(id))
    }
    return () => { dispatch(clearCurrent()) }
  }, [id, dispatch])

  // Reset active image when property changes
  useEffect(() => { setActiveImg(0) }, [property?._id])

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

          {/* ── Left: Images ── */}
          <div>
            <div className="relative rounded-xl overflow-hidden bg-gray-200 mb-2">
              <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide z-10">
                {property.propertyId}
              </span>
              <img
                src={images[activeImg]}
                alt={b.name}
                className="w-full h-80 object-cover"
              />
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => Math.max(0, i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <button onClick={() => setActiveImg(i => Math.min(images.length - 1, i + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors rotate-180">
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                    className={`w-20 h-14 object-cover rounded-lg cursor-pointer flex-shrink-0 border-2 transition-colors ${activeImg === i ? 'border-[#E8431A]' : 'border-transparent hover:border-gray-300'}`} />
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
                {b.bedrooms ? <InfoBadge label="Bedroom" value={`${b.bedrooms} BHK`} /> : null}
                {pd.doorFacing ? <InfoBadge label="Facing" value={labelify(pd.doorFacing)} /> : null}
                {pd.pricePerSqft ? <InfoBadge label="Price/Sq.ft" value={`₹${Number(pd.pricePerSqft).toLocaleString()}`} /> : null}
                {pd.sbua ? <InfoBadge label="SBUA" value={`${Number(pd.sbua).toLocaleString()} sq.ft`} /> : null}
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
              <div className="flex items-center gap-2">
                <ActionBtn onClick={() => {}}><Share2 className="w-3.5 h-3.5" /></ActionBtn>
                <ActionBtn onClick={() => {}}><UserCheck className="w-3.5 h-3.5" /></ActionBtn>
                <ActionBtn variant="danger" onClick={() => setShowDeleteConfirm(true)}><Trash2 className="w-3.5 h-3.5" /></ActionBtn>
                <ActionBtn onClick={() => navigate(`/inventory/edit/${id}`)}><Pencil className="w-3.5 h-3.5" /></ActionBtn>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-5">
              <SectionTitle>Property Details</SectionTitle>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {pd.apartmentType && <DetailCell icon={CheckCircle2} label="Apartment Type" value={labelify(pd.apartmentType)} />}
                {pd.doorFacing    && <DetailCell icon={CheckCircle2} label="Door Facing"    value={labelify(pd.doorFacing)} />}
                {pd.ageOfBuilding && <DetailCell icon={Calendar}     label="Age of Building" value={labelify(pd.ageOfBuilding)} />}
                {pd.furnishing    && <DetailCell icon={CheckCircle2} label="Furnishing"     value={labelify(pd.furnishing)} />}
                {pd.floorNumber   && <DetailCell icon={CheckCircle2} label="Floor Number"   value={labelify(pd.floorNumber)} />}
                {b.bedrooms != null && b.bedrooms > 0 && <DetailCell icon={Bed}         label="Bedrooms"  value={b.bedrooms} />}
                {b.bathrooms != null && b.bathrooms > 0 && <DetailCell icon={Bath}       label="Bathrooms" value={b.bathrooms} />}
                {b.balconies != null && b.balconies > 0 && <DetailCell icon={Expand}     label="Balconies" value={b.balconies} />}
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
                  </>
                ) : (
                  <>
                    <InfoBadge label="Ask Price"  value={formatPrice(pd.askPrice, pd.priceUnit)} />
                    {pd.pricePerSqft && <InfoBadge label="Price/Sq.ft" value={`₹${Number(pd.pricePerSqft).toLocaleString()}`} />}
                    {pd.sbua         && <InfoBadge label="SBUA"        value={`${Number(pd.sbua).toLocaleString()} sq.ft`} />}
                  </>
                )}
              </div>
            </div>

            {/* More Details */}
            <div className="mb-5">
              <SectionTitle>More Details</SectionTitle>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {md.buildingKhata != null && <DetailCell icon={CheckCircle2} label="B Khata"      value={md.buildingKhata ? 'Yes' : 'No'} />}
                {md.eKhata        != null && <DetailCell icon={CheckCircle2} label="E Khata"      value={md.eKhata ? 'Yes' : 'No'} />}
                {md.parking               && <DetailCell icon={CheckCircle2} label="Parking"      value={labelify(md.parking)} />}
                {md.cornerUnit    != null && <DetailCell icon={CheckCircle2} label="Corner Unit"  value={md.cornerUnit ? 'Yes' : 'No'} />}
                {md.extraRooms?.length > 0 && <DetailCell icon={CheckCircle2} label="Extra Rooms" value={md.extraRooms.map(labelify).join(', ')} />}
                {md.preferredTenant       && <DetailCell icon={CheckCircle2} label="Preferred Tenant" value={labelify(md.preferredTenant)} />}
                {md.petAllowed    != null && <DetailCell icon={CheckCircle2} label="Pet Allowed"  value={md.petAllowed ? 'Yes' : 'No'} />}
                {md.nonVegAllowed != null && <DetailCell icon={CheckCircle2} label="Non-Veg"      value={md.nonVegAllowed ? 'Yes' : 'No'} />}
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

            {/* Amenities */}
            {md.amenities?.length > 0 && (
              <div className="mb-5">
                <SectionTitle>Amenities</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {md.amenities.map(a => (
                    <span key={a} className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-3 py-1 font-medium">
                      <CheckCircle2 className="w-3 h-3" /> {labelify(a)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {md.description && (
              <div>
                <SectionTitle>Description</SectionTitle>
                <p className="text-sm text-gray-500 leading-relaxed">{md.description}</p>
              </div>
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
            <p className="text-sm text-gray-400">No similar properties found.</p>
          )}
        </div>

      </div>

      {/* ── Delete Confirm Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete Property?</h3>
            <p className="text-sm text-gray-500 mb-5">This will permanently remove <strong>{b.name}</strong>. This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} disabled={deleting}
                className="text-sm px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-60 flex items-center gap-2">
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail