import { Search, Bell, CompassIcon } from 'lucide-react'
import { useState } from 'react'
import companyLogo from "../../assets/logo.svg";

// ─── Logo Icon ──────────────────────────────────────────────────────────────
const LogoIcon = () => (
  <img src={companyLogo} alt="" className='w-45'/>
)

// ─── Navbar ─────────────────────────────────────────────────────────────────
const Navbar = () => {
  // const [activeTab, setActiveTab] = useState('resale')
  const [query, setQuery] = useState('')

  return (
    <header
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
      className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between "
    >
      {/* Left – Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <LogoIcon />
      </div>

      {/* Center – Search */}
      <div className="flex-1 mx-10 max-w-lg">
        <div className="flex items-center border-2 border-gray-300 rounded-md overflow-hidden">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything"
            className="flex-1 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 outline-none "
          />
          <button className="bg-[#E8431A] hover:bg-[#cf3b16] transition-colors px-3 py-2 flex items-center justify-center rounded-md  m-1">
            <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Right – Resale / Rental toggle + Bell */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Toggle */}
        {/* <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab('resale')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'resale'
                ? 'bg-[#E8431A] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Resale
          </button>
          <button
            onClick={() => setActiveTab('rental')}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === 'rental'
                ? 'bg-[#E8431A] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rental
          </button>
        </div> */}

        {/* Bell */}
        <button className="relative p-1.5 rounded-md border-2 border-gray-400 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}

export default Navbar