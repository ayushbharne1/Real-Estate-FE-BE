import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Share2, MapPin, Trash2, Edit, MapPinned,
  BedDouble, Maximize2, DollarSign, LayoutGrid,
  Calendar, ClipboardCheck, Building2, Wind,
  Layers, ChevronLeft, ChevronRight
} from 'lucide-react'

// ── Sample Images ──────────────────────────────────────────────────────────────
const GALLERY = [
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
]

const MATCHING = [
  { id: 'PB2569', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=70', name: 'Brigade Commercial', location: 'Electronic City', price: '$18.00 Cr' },
  { id: 'PB2569', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70', name: 'Orchards Plot', location: 'Electronic City', price: '$12.00 Cr' },
  { id: 'PB2569', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70', name: 'Brigade Villa', location: 'Electronic City', price: '$25.00 Cr' },
  { id: 'PB2569', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70', name: 'Pavilion Villas', location: 'Electronic City', price: '$21.00 Cr' },
]

// ── Sub-components ─────────────────────────────────────────────────────────────
const ActionBtn = ({ children, variant = 'default' }) => (
  <button className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
    variant === 'danger'
      ? 'bg-[#E8431A] hover:bg-[#cf3b16] text-white'
      : 'bg-[#E8431A] hover:bg-[#cf3b16] text-white'
  }`}>
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

const MatchingCard = ({ prop }) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="relative">
      <img src={prop.img} alt={prop.name} className="w-full h-36 object-cover" />
      <span className="absolute top-2 left-2 bg-[#E8431A] text-white text-xs font-bold px-2 py-0.5 rounded">
        {prop.id}
      </span>
      <button className="absolute top-2 right-2 bg-[#E8431A] text-white rounded-lg p-1.5 hover:bg-[#cf3b16]">
        <Share2 className="w-3 h-3" />
      </button>
    </div>
    <div className="p-2.5">
      <p className="font-bold text-gray-900 text-sm truncate">{prop.name}</p>
      <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
        <MapPin className="w-3 h-3 text-[#E8431A]" /> {prop.location}
      </p>
      <p className="text-sm font-bold text-gray-900 mt-1">{prop.price}</p>
    </div>
  </div>
)

// ── Main Page ──────────────────────────────────────────────────────────────────
const PropertyDetail = () => {
  const navigate = useNavigate()
  const [activeImg, setActiveImg] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="w-full mx-auto">
        {/* back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm text-[#E8431A] hover:underline"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {/* ── Top Section: Image + Details ── */}
        <div className="grid grid-cols-2 gap-8 mb-6">

          {/* Left – Gallery */}
          <div>
            {/* Main image */}
            <div className="relative rounded-xl overflow-hidden mb-3">
              <span className="absolute top-3 left-3 z-10 bg-[#E8431A] text-white text-xs font-bold px-2 py-0.5 rounded">
                PB2569
              </span>
              <img
                src={GALLERY[activeImg]}
                alt="Property"
                className="w-full h-64 object-cover"
              />
              {/* Prev/Next */}
              <button
                onClick={() => setActiveImg(i => (i - 1 + GALLERY.length) % GALLERY.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % GALLERY.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {GALLERY.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`rounded-full transition-all ${
                      i === activeImg ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Property name */}
            <h2 className="text-xl font-bold text-gray-900 mb-1">Brigade Orchards Pavilion Villas</h2>
            <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#E8431A]" /> Electronic City
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-5 gap-2 border border-gray-200 rounded-xl p-3 bg-white">
              <DetailCell icon={Building2}  label="Type"     value="Apartment" />
              <DetailCell icon={BedDouble}  label="Bedroom"  value="2Bhk" />
              <DetailCell icon={Maximize2}  label="Area"     value="South" />
              <DetailCell icon={DollarSign} label="Price Sq/ft" value="16069" />
              <DetailCell icon={LayoutGrid} label="SBUA"     value="13068" />
            </div>
          </div>

          {/* Right – Details */}
          <div>
            {/* Price + Action buttons */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-3xl font-black text-gray-900">$21.00 Cr <span className="text-sm font-normal text-gray-400">Ask Price</span></p>
                <p className="text-xs text-gray-500 mt-0.5">Kammasandra Rd, Kammasandra, Electronic City, Bengaluru, Karnataka 560100, India</p>
              </div>
              <div className="flex items-center gap-2">
                <ActionBtn><Share2 className="w-4 h-4" /></ActionBtn>
                <ActionBtn><MapPinned className="w-4 h-4" /></ActionBtn>
                <ActionBtn><Trash2 className="w-4 h-4" /></ActionBtn>
                <ActionBtn><Edit className="w-4 h-4" /></ActionBtn>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-4 mt-3">
              <SectionTitle>Property Details</SectionTitle>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <DetailCell icon={Building2}  label="Apartment Type"  value="Simple" />
                <DetailCell icon={Wind}       label="Door Facing"     value="East" />
                <DetailCell icon={Calendar}   label="Age of Building" value="1-5 Years" />
                <DetailCell icon={Layers}     label="Furnishing"      value="Semi- Furnished" />
                <DetailCell icon={Layers}     label="Floor Number"    value="Lower Floor (1-5)" />
              </div>
            </div>

            {/* Inventory Details */}
            <div className="mb-4">
              <SectionTitle>Inventory Details</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <DetailCell icon={Calendar}       label="Listed"                 value="1 days ago" />
                <DetailCell icon={ClipboardCheck} label="Inventory Last Checked" value="1 days ago" />
              </div>
            </div>

            {/* Description */}
            <div>
              <SectionTitle>Description</SectionTitle>
              <p className="text-sm text-gray-500 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et purus porttitor, dapibus lacus vitae,
                maximus ligula. Donecnon libero vitae metus molestie euismod sed vitae ipsum. Ut efficitur diam ante, in
                efficitur nisl luctus eu. Quisque vulputate vestibulum tellus, et sollicitudin justo gravida quis. Fusce nec
                tortor ac massa molestie mattis.
              </p>
            </div>
          </div>
        </div>

        {/* ── Matching Requirements ── */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Matching Requirements</h3>
          <div className="grid grid-cols-4 gap-4">
            {MATCHING.map((prop, i) => (
              <MatchingCard key={i} prop={prop} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default PropertyDetail