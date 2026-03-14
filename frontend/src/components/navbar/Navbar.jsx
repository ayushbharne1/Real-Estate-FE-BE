// src/components/navbar/Navbar.jsx
import { Search, Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import companyLogo from "../../assets/logo.svg"

export const SEARCH_EVENT = 'navbar:search'

const LogoIcon = () => (
  <img src={companyLogo} alt="" className='w-45' />
)

const Navbar = () => {
  const [query, setQuery] = useState('')
  const navigate   = useNavigate()
  const location   = useLocation()
  const debounceRef = useRef(null)

  const fireSearch = (q) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { search: q } })
    } else {
      window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: q }))
    }
  }

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    // Debounce: fire search 400ms after user stops typing
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fireSearch(val), 400)
  }

  // Handle Enter key immediately without waiting for debounce
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounceRef.current)
      fireSearch(query)
    }
  }

  // When navigated to dashboard with search state, dispatch event
  useEffect(() => {
    if (location.pathname === '/' && location.state?.search) {
      const q = location.state.search
      setQuery(q)
      window.dispatchEvent(new CustomEvent(SEARCH_EVENT, { detail: q }))
      window.history.replaceState({}, '')
    }
  }, [location])

  return (
    <header
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
      className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-6 py-2.5 flex items-center justify-between"
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
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Search properties…"
            className="flex-1 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 outline-none"
          />
          <button
            onClick={() => { clearTimeout(debounceRef.current); fireSearch(query) }}
            className="bg-[#E8431A] hover:bg-[#cf3b16] transition-colors px-3 py-2 flex items-center justify-center rounded-md m-1"
          >
            <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="relative p-1.5 rounded-md border-2 border-gray-400 hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
        </button>
      </div>
    </header>
  )
}

export default Navbar