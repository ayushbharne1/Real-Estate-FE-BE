// frontend/src/components/navbar/Navbar.jsx
// Replace entire file with this

import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import companyLogo from '../../assets/logo.svg'
import SearchBar from './SearchBar'


const Navbar = () => {
  const location = useLocation()

  return (
    <header
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
      className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between"
    >
      {/* Left – Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <img src={companyLogo} alt="" className="w-45" />
      </div>

      

      {/* Right */}
      <div className="flex items-center gap-3 flex-shrink-0">
      {/* Center – Search (dashboard only) */}
      {location.pathname === '/' && <SearchBar />}
        <button className="relative p-1.5 rounded-md border-2 border-gray-400 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}

export default Navbar