import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Grid, List, ChevronDown, SlidersHorizontal,
  MapPin, Share2, Bell, Filter, Info, ChevronLeft, ChevronRight
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
  { id: 'all', label: 'All', icon: '⊞' },
  { id: 'commercial', label: 'Commercial', icon: '🏢' },
  { id: 'apartment', label: 'Apartment', icon: '🏠' },
  { id: 'plot', label: 'Plot', icon: '📐' },
  { id: 'villas', label: 'Villas', icon: '🏡' },
]

const PROPERTIES = [
  { id: 'PB2569', name: 'Brigade Orchards Apartment', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=70', category: 'apartment', plotSize: '-', rent: '$75k', deposit: '$3 lakhs' },
  { id: 'PB2569', name: 'Brigade Commercial', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70', category: 'commercial', plotSize: '-', rent: '$89k', deposit: '$1.5 lakhs' },
  { id: 'PB2569', name: 'Brigade Orchards Pavilion Villa', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70', category: 'villas', plotSize: '-', rent: '$45k', deposit: '$2 lakhs' },
  { id: 'PB2569', name: 'Brige Plot', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70', category: 'plot', plotSize: '4578', rent: '$99k', deposit: '$8 lakhs' },
  { id: 'PB2569', name: 'Brigade Villa', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70', category: 'villas', plotSize: '-', rent: '$56k', deposit: '$37 lakhs' },
  { id: 'PB2569', name: 'Brigade Orchards Apartment', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=70', category: 'apartment', plotSize: '-', rent: '$77k', deposit: '$4 lakhs' },
  { id: 'PB2569', name: 'Orchards Plot', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=70', category: 'plot', plotSize: '2589', rent: '$35k', deposit: '$5 lakhs' },
  { id: 'PB2569', name: 'Brigade Commercial', type: 'Apartment', bhk: '2BHK', facing: 'North-East', location: 'Electronic City', price: '16069', sbua: '13068', ask: '$21.00 Cr', img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=70', category: 'commercial', plotSize: '-', rent: '$45k', deposit: '$69 lakhs' },
]

const TABLE_DATA = [
  { id: 'RNA32024', name: 'Assetz Marq Phase-2', type: 'Apartment', sbua: 3802, plot: '-', facing: 'South - East', rent: '$75k', deposit: '$3 lakhs' },
  { id: 'RNA3023', name: 'Sobha Carnation', type: 'Aprtment', sbua: 3569, plot: '-', facing: 'North', rent: '$89k', deposit: '$1.5 lakhs' },
  { id: 'RNA3022', name: 'SOBHA Dream Gardens', type: 'Aprtment', sbua: 5686, plot: '-', facing: 'West', rent: '$45k', deposit: '$2 Lakhs' },
  { id: 'RNA3021', name: 'QVC The Hills', type: 'Villa', sbua: 4578, plot: '-', facing: 'North', rent: '$99k', deposit: '$8 lakhs' },
  { id: 'RNA3020', name: 'R&S Lakeview Apartment', type: 'Apartment', sbua: 1245, plot: '-', facing: 'North', rent: '$88k', deposit: '-' },
  { id: 'RNA3019', name: 'Nikoo Homes 1', type: 'Office SPace', sbua: 3698, plot: '-', facing: 'East', rent: '$56k', deposit: '$37 Lakhs' },
  { id: 'RNA3018', name: 'Office Space in Hebal', type: 'Apartment', sbua: 1596, plot: '-', facing: 'East', rent: '$77k', deposit: '$ 4 lakhs' },
  { id: 'RNA3017', name: 'Prestige Green Gables', type: 'Apartment', sbua: 2589, plot: '-', facing: 'East', rent: '$35k', deposit: '$5 lakhs' },
  { id: 'RNA3016', name: 'Prestige Jade Pavillion', type: 'Villa', sbua: 4586, plot: '-', facing: 'West', rent: '$45k', deposit: '$69 lakhs' },
]

// ── Sub-components ─────────────────────────────────────────────────────────────
const Chip = ({ label }) => (
  <span className="text-xs border border-gray-300 rounded-full px-2 py-0.5 text-gray-500 whitespace-nowrap">
    {label}
  </span>
)

const PropertyCard = ({ prop }) => {
  const navigate = useNavigate()
  return (
    <div onClick={() => navigate(`/property/details/${prop.id}`)} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
    {/* Image */}
    <div className="relative">
      <img src={prop.img} alt={prop.name} className="w-full h-44 object-cover" />
      <span className="absolute top-2 left-2 bg-[#E8431A] text-white text-xs font-bold px-2 py-0.5 rounded">
        {prop.id}
      </span>
    </div>

    {/* Body */}
    <div className="p-3">
      {/* Chips */}
      <div className="flex flex-wrap gap-1 mb-2">
        <Chip label={prop.type} />
        <Chip label={prop.bhk} />
        <Chip label={prop.facing} />
      </div>

      {/* Name & Location */}
      <p className="font-bold text-gray-900 text-sm leading-tight mb-0.5">{prop.name}</p>
      <p className="flex items-center gap-1 text-xs text-gray-500 mb-3">
        <MapPin className="w-3 h-3 text-[#E8431A]" /> {prop.location}
      </p>

      {/* Stats row */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-2">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-800">{prop.price}</p>
          <p className="text-[10px] text-gray-400">Price/Sq.ft</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-800">{prop.sbua}</p>
          <p className="text-[10px] text-gray-400">SBUA</p>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold text-gray-800">{prop.ask}</p>
          <p className="text-[10px] text-gray-400">Ask Price</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); /* keep click on card from firing */ }}
          className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-lg p-2 flex items-center gap-1 text-xs font-semibold">
          <Share2 className="w-3 h-3" /> Share
        </button>
      </div>
    </div>
  </div>
)
}

const Dropdown = ({ label }) => (
  <button className="flex items-center gap-1.5 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 hover:border-gray-400 transition-colors bg-white">
    {label} <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
  </button>
)

// ── Main Dashboard ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('grid')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('resale')
  const [currentPage, setCurrentPage] = useState(2)

  const totalPages = 6

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'Segoe UI', sans-serif" }}>


      {/* ── Category Bar + Toolbar ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-2 flex items-center justify-between">
        {/* Categories */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center gap-0.5 text-xs font-medium pb-1 transition-colors ${
                activeCategory === cat.id
                  ? 'text-[#E8431A] border-b-2 border-[#E8431A]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          {/* Grid / Table toggle */}
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-3.5 h-3.5" /> Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-[#E8431A] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
          </div>
          <Dropdown label="Assest Type" />
          <Dropdown label="Sort by" />
          <Dropdown label="SBUA" />
          <button className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {PROPERTIES.map((prop, i) => (
              <PropertyCard key={i} prop={prop} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-auto">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Property ID</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Property Name</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Asset Type</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">SBUA (Sqft)</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Plot Size (Sqft)</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Facing</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Rent ($/month)</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Deposit</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_DATA.map((row, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{row.name}</td>
                    <td className="px-4 py-3 text-gray-600">{row.type}</td>
                    <td className="px-4 py-3 text-gray-600">{row.sbua}</td>
                    <td className="px-4 py-3 text-gray-400">{row.plot}</td>
                    <td className="px-4 py-3 text-gray-600">{row.facing}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{row.rent}</td>
                    <td className="px-4 py-3 text-gray-600">{row.deposit}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="bg-[#E8431A] hover:bg-[#cf3b16] text-white rounded-lg p-1.5 transition-colors">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate(`/property/details/${row.id}`)}
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
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-gray-100 text-gray-500"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                      currentPage === p
                        ? 'bg-[#E8431A] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1 rounded hover:bg-gray-100 text-gray-500"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                Items per page:
                <select className="border border-gray-300 rounded px-2 py-0.5 text-xs outline-none">
                  <option>10</option>
                  <option>20</option>
                  <option>30</option>
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