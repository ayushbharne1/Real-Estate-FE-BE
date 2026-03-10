import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  Settings,
  LogOut,
  Tags,
  PlusCircle,
  Crown,
  User,
} from 'lucide-react'
import ConfirmModal from '../common/ConfirmModal'

// ─── Nav Config ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', icon: Home, path: '/', label: 'Properties' },
  { id: 'listings', icon: Tags, path: '/listings', label: 'Listings' },
  { id: 'add', icon: PlusCircle, path: '/add', label: 'Add Inventory' },
]

const BOTTOM_NAV_ITEMS = [
  { id: 'premium', icon: Crown, path: '/premium', label: 'Premium' },
  { id: 'profile', icon: User, path: '/profile', label: 'Profile' },
  // { id: 'settings', icon: Settings, path: '/settings', label: 'Settings' },
  // { id: 'logout', icon: LogOut, path: '/logout', label: 'Logout' },
]

// ─── Tooltip ───────────────────────────────────────────────────────────────────
const Tooltip = ({ label, children }) => (
  <div className="relative group flex justify-center w-full">
    {children}
    <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium rounded-md px-2.5 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
      {label}
    </span>
  </div>
)

// ─── Nav Item ──────────────────────────────────────────────────────────────────
const NavItem = ({ item }) => {
  const Icon = item.icon

  return (
    <li className="w-full flex justify-center">
      <Tooltip label={item.label}>
        <NavLink
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `w-11 h-11 flex items-center justify-center rounded-xl transition ${
              isActive
                ? 'text-[#E8431A]'
                : 'text-gray-500 hover:text-[#E8431A]'
            }`
          }
        >
          {({ isActive }) => (
            <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.8} />
          )}
        </NavLink>
      </Tooltip>
    </li>
  )
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setShowLogoutModal(false)
    navigate('/login')
  }

  return (
    <>
      <aside
        className="sticky top-0 h-screen bg-white flex flex-col items-center py-4 z-20 rounded-tr-lg rounded-br-lg bor shadow-md shadow-gray-400"
        style={{
          width: 64,
          
        }}
      >
        {/* Main Navigation */}
        <nav className="flex-1 w-full flex flex-col items-center ">
          <ul className="flex flex-col items-center gap-2 w-full px-2">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </ul>
        </nav>

        {/* Bottom Navigation */}
        <div
          className="flex flex-col items-center gap-2 px-2 w-full pt-3"
          style={{ borderTop: '1px solid #f3f4f6' }}
        >
          {BOTTOM_NAV_ITEMS.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}

          {/* Logout (same as before) */}
          <Tooltip label="Logout">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
            >
              <LogOut className="w-5 h-5" strokeWidth={1.8} />
            </button>
          </Tooltip>
        </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Yes, Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  )
}

export default Sidebar

