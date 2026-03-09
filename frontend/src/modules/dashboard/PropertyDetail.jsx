import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Share2, MapPin, Trash2, Edit, MapPinned,
  BedDouble, Maximize2, DollarSign, LayoutGrid,
  Calendar, ClipboardCheck, Building2, Wind,
  Layers, ChevronLeft, ChevronRight, Home,
  CheckCircle2, Bath, Columns
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
  { id: 'PB2569', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70',    name: 'Brigade Orchards Apartment',      type: 'Apartment',        bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16,069', sbua: '13,068 sq.ft', askPrice: '₹21.00 Cr', badge: 'Resale' },
  { id: 'PB2570', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70', name: 'Brigade Commercial',              type: 'Commercial Space', bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16,069', sbua: '13,068 sq.ft', askPrice: '₹21.00 Cr', badge: 'Resale' },
  { id: 'PB2571', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70', name: 'Brigade Orchards Pavilion Villa', type: 'Villa',            bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16,069', sbua: '13,068 sq.ft', askPrice: '₹21.00 Cr', badge: 'Resale' },
  { id: 'PB2572', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70', name: 'Brigade Plot',                    type: 'Plot',             bhk: '4BHK', facing: 'North-East', location: 'Electronic City', priceSqft: '16,069', sbua: '13,068 sq.ft', askPrice: '₹21.00 Cr', badge: 'Resale' },
]

// ── Sub-components ─────────────────────────────────────────────────────────────
const ActionBtn = ({ children, variant = 'default', onClick }) => (
  <button onClick={onClick}
    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
      variant === 'danger'
        ? 'bg-red-100 hover:bg-red-200 text-red-600'
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

const MatchingCard = ({ prop }) => (
  <div className="bg-white rounded-md overflow-hidden shadow-md border border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group">
    <div className="relative overflow-hidden">
      <img src={prop.img} alt={prop.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      <span className="absolute top-3 left-3 bg-[#E8431A] text-white text-xs font-bold px-2.5 py-1 rounded-md tracking-wide">
        {prop.id}
      </span>
      <span className="absolute bottom-3 left-3 bg-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
        {prop.badge}
      </span>
    </div>
    <div className="p-2">
      <div className="flex flex-wrap gap-1.5 mb-2">
        <MChip label={prop.type} />
        <MChip label={prop.bhk} />
        <MChip label={prop.facing} />
      </div>
      <p className="font-bold text-gray-900 text-sm leading-snug mb-1 truncate">{prop.name}</p>
      <p className="flex items-center gap-1 text-xs text-gray-400 mb-3">
        <MapPin className="w-3 h-3 text-[#E8431A] flex-shrink-0" />{prop.location}
      </p>
      <div className="flex items-center justify-between border-t border-gray-100 pt-2.5 gap-2">
        <div className="flex items-center justify-around flex-1 border border-gray-300 rounded-sm py-2 px-1 gap-1">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-900">{prop.priceSqft}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Price/Sq.ft</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-900">{prop.sbua}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">SBUA</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-900">{prop.askPrice}</p>
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

// ── Main Page ──────────────────────────────────────────────────────────────────
const PropertyDetail = () => {
  const navigate = useNavigate()
  const [activeImg, setActiveImg] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="w-full mx-auto">

        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-sm text-[#E8431A] hover:underline">
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
              <img src={GALLERY[activeImg]} alt="Property" className="w-full h-64 object-cover" />
              <button onClick={() => setActiveImg(i => (i - 1 + GALLERY.length) % GALLERY.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow">
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button onClick={() => setActiveImg(i => (i + 1) % GALLERY.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow">
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {GALLERY.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`rounded-full transition-all ${i === activeImg ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/50'}`} />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mb-3">
              {GALLERY.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`flex-1 rounded-lg overflow-hidden border-2 transition-all ${i === activeImg ? 'border-[#E8431A]' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-14 object-cover" />
                </button>
              ))}
            </div>

            {/* Property name */}
            <h2 className="text-xl font-bold text-gray-900 mb-1">Brigade Orchards Pavilion Villas</h2>
            <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <MapPin className="w-3.5 h-3.5 text-[#E8431A]" /> Electronic City
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-5 gap-2 border border-gray-200 rounded-xl p-3 bg-white">
              <DetailCell icon={Building2}  label="Type"        value="Apartment" />
              <DetailCell icon={BedDouble}  label="Bedroom"     value="2 BHK" />
              <DetailCell icon={Wind}       label="Facing"      value="South" />
              <DetailCell icon={DollarSign} label="Price/Sq.ft" value="₹16,069" />
              <DetailCell icon={LayoutGrid} label="SBUA"        value="13,068" />
            </div>
          </div>

          {/* Right – Details */}
          <div>
            {/* Price + Action buttons */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-3xl font-black text-gray-900">
                  ₹21.00 Cr <span className="text-sm font-normal text-gray-400">Ask Price</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Kammasandra Rd, Kammasandra, Electronic City, Bengaluru, Karnataka 560100, India
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <ActionBtn><Share2 className="w-4 h-4" /></ActionBtn>
                <ActionBtn><MapPinned className="w-4 h-4" /></ActionBtn>
                <ActionBtn variant="danger"><Trash2 className="w-4 h-4" /></ActionBtn>
                <ActionBtn><Edit className="w-4 h-4" /></ActionBtn>
              </div>
            </div>

            {/* ── Property Details ── */}
            <div className="mb-5">
              <SectionTitle>Property Details</SectionTitle>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <DetailCell icon={Home}      label="Apartment Type"  value="Simple" />
                <DetailCell icon={Wind}      label="Door Facing"     value="East" />
                <DetailCell icon={Calendar}  label="Age of Building" value="1–5 Years" />
                <DetailCell icon={Layers}    label="Furnishing"      value="Semi-Furnished" />
                <DetailCell icon={Columns}   label="Floor Number"    value="Lower Floor (1–5)" />
                <DetailCell icon={BedDouble} label="Bedrooms"        value="2" />
                <DetailCell icon={Bath}      label="Bathrooms"       value="2" />
                <DetailCell icon={Maximize2} label="Balconies"       value="1" />
              </div>
            </div>

            {/* ── Pricing ── */}
            <div className="mb-5">
              <SectionTitle>Pricing</SectionTitle>
              <div className="grid grid-cols-3 gap-3">
                <InfoBadge label="Ask Price"    value="₹21.00 Cr" />
                <InfoBadge label="Price/Sq.ft"  value="₹16,069" />
                <InfoBadge label="SBUA"         value="13,068 sq.ft" />
              </div>
            </div>

            {/* ── More Details ── */}
            <div className="mb-5">
              <SectionTitle>More Details</SectionTitle>
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                <DetailCell icon={CheckCircle2} label="B Khata"     value="Yes" />
                <DetailCell icon={CheckCircle2} label="E Khata"     value="No" />
                <DetailCell icon={CheckCircle2} label="Parking"     value="2 Covered" />
                <DetailCell icon={CheckCircle2} label="Corner Unit" value="No" />
                <DetailCell icon={CheckCircle2} label="Extra Rooms" value="Servant" />
              </div>
            </div>

            {/* ── Inventory Details ── */}
            <div className="mb-5">
              <SectionTitle>Inventory Details</SectionTitle>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <DetailCell icon={Calendar}       label="Listed"                 value="1 day ago" />
                <DetailCell icon={ClipboardCheck} label="Inventory Last Checked" value="1 day ago" />
              </div>
            </div>

            {/* ── Amenities ── */}
            <div className="mb-5">
              <SectionTitle>Amenities</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {['Swimming Pool', 'Gym', 'Club House', 'Children Play Area', 'Power Backup', 'Security', 'Lift', 'Intercom'].map(a => (
                  <span key={a} className="flex items-center gap-1 text-xs bg-orange-50 text-[#E8431A] border border-orange-200 rounded-full px-3 py-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Description ── */}
            <div>
              <SectionTitle>Description</SectionTitle>
              <p className="text-sm text-gray-500 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et purus porttitor, dapibus lacus vitae,
                maximus ligula. Donec non libero vitae metus molestie euismod sed vitae ipsum. Ut efficitur diam ante, in
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