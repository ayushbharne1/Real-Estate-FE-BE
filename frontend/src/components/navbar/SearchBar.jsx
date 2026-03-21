// frontend/src/components/navbar/SearchBar.jsx
import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import api from '../../api/axiosInstance'
import { setSearchQuery } from '../../redux/slices/uiSlice'
import { useDispatch } from 'react-redux'


export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([]) // plain strings
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)

  const navigate = useNavigate()
  const location = useLocation()
  const debounceRef = useRef(null)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const dispatch = useDispatch()

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIdx(-1)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Restore from nav state
  useEffect(() => {
    if (location.pathname === '/' && location.state?.search) {
      const q = location.state.search
      setQuery(q)
      fireSearch(q)
      window.history.replaceState({}, '')
    }
  }, [location])

  const fireSearch = useCallback((q) => {
    setSuggestions([])
    setOpen(false)
    setActiveIdx(-1)
    if (location.pathname !== '/') {
      navigate('/', { state: { search: q } })
    } else {
      dispatch(setSearchQuery(q))
    }
  }, [location.pathname, navigate, dispatch])

  const fetchSuggestions = useCallback(async (q) => {
    if (!q.trim()) { setSuggestions([]); setOpen(false); return }
    setLoading(true)
    try {
      const { data } = await api.get('/inventory/keywords', { params: { q } })
      const keywords = data?.data || []
      if (keywords.length > 0) {
        setSuggestions(keywords)
        setOpen(true)
      } else {
        setSuggestions([])
        setOpen(false)
      }
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    setActiveIdx(-1)
    clearTimeout(debounceRef.current)
    if (!val.trim()) {
      setSuggestions([])
      setOpen(false)
      fireSearch('')
      return
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const handleKeyDown = (e) => {
    if (!open || suggestions.length === 0) {
      if (e.key === 'Enter') { clearTimeout(debounceRef.current); fireSearch(query) }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = activeIdx >= 0 ? suggestions[activeIdx] : query
      setQuery(selected)
      fireSearch(selected)
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  const handleClickSuggestion = (keyword) => {
    setQuery(keyword)
    fireSearch(keyword)
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setOpen(false)
    fireSearch('')
    inputRef.current?.focus()
  }

  // Bold the matching part of keyword
  const highlight = (text, q) => {
    const idx = text.toLowerCase().indexOf(q.toLowerCase())
    if (idx === -1) return <span>{text}</span>
    return (
      <>
        {text.slice(0, idx)}
        <strong className="text-gray-900 font-semibold">{text.slice(idx, idx + q.length)}</strong>
        {text.slice(idx + q.length)}
      </>
    )
  }

  return (
    <div ref={containerRef} className="relative flex-1 mx-10 max-w-lg">
      {/* Input */}
      <div className={`flex items-center border-2 rounded-md transition-colors ${open ? 'border-[#E8431A]' : 'border-gray-300'}`}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0) setOpen(true) }}
          placeholder="Search properties…"
          className="flex-1 px-3 py-2 text-sm text-gray-600 placeholder-gray-400 outline-none bg-white rounded-l-md"
        />
        {query && (
          <button onClick={handleClear} className="px-2 text-gray-400 hover:text-gray-600 transition-colors">
            {loading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <X className="w-4 h-4" />}
          </button>
        )}
        <button
          onClick={() => { clearTimeout(debounceRef.current); fireSearch(query) }}
          className="bg-[#E8431A] hover:bg-[#cf3b16] transition-colors px-3 py-2 flex items-center justify-center rounded-md m-1"
        >
          <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Keyword Suggestions */}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          style={{ zIndex: 99999 }}
        >
          {suggestions.map((keyword, idx) => (
            <li key={keyword}>
              <button
                type="button"
                onMouseDown={() => handleClickSuggestion(keyword)}
                onMouseEnter={() => setActiveIdx(idx)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors ${activeIdx === idx ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
              >
                <Search className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-500">
                  {highlight(keyword, query)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}