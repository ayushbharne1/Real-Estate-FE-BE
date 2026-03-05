import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  ClipboardList,
  ShoppingCart,
  Tag,
  PlusCircle,
  Settings,
  LogOut,
  ChevronDown,
  Tags,
} from 'lucide-react'
import ConfirmModal from '../common/ConfirmModal'
import premiumIcon from '../../assets/sidebarpremium.png'

// ─── Nav Config ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard', icon: Home,          path: '/',         label: 'Properties' },
  { id: 'listings',  icon: Tags, path: '/listings', label: 'Listings' },
  { id: 'add',       icon: PlusCircle,    path: '/add',      label: 'Add Inventory' },
]

const BOTTOM_ITEMS = [
  { id: 'settings', icon: Settings, path: '/settings', label: 'Settings' },
  { id: 'logout',   icon: LogOut,   path: '/login',    label: 'Logout', isLogout: true },
]

// ─── Tooltip ───────────────────────────────────────────────────────────────────
const Tooltip = ({ label, children }) => (
  <div className="relative group flex justify-center w-full">
    {children}
    <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs font-medium rounded-md px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
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
            `w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-150 ${
              isActive
                ? 'text-[#E8431A]  '
                : 'text-gray-500  hover:text-[#E8431A]'
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
        className="sticky top-0 h-screen bg-white flex flex-col items-center py-4 z-20"
        style={{
          width: 64,
          borderRight: '1px solid #f0f0f0',
          boxShadow: '1px 0 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Main Nav */}
        <nav className="flex-1 w-full flex flex-col items-center pt-2">
          <ul className="flex flex-col items-center gap-2 w-full px-2">
            {NAV_ITEMS.map(item => (
              <NavItem key={item.id} item={item} />
            ))}
          </ul>
        </nav>

        {/* Bottom – Settings + Logout + Avatar */}
        <div className="flex flex-col items-center gap-2 px-2 w-full pt-3" style={{ borderTop: '1px solid #f3f4f6' }}>

        {/* Settings & Logout */}
          {BOTTOM_ITEMS.map(item =>
            item.isLogout ? (
              <Tooltip key={item.id} label={item.label}>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.8} />
                </button>
              </Tooltip>
            ) : (
              <NavItem key={item.id} item={item} />
            )
          )}

          {/* Avatar */}
          <div className="mt-2 relative cursor-pointer">
            <div
              className="w-10 h-10 rounded-full overflow-hidden"
              style={{ border: '2px solid #f0f0f0' }}
            >
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80"
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow"
              style={{ border: '1px solid #e5e7eb' }}
            >
              <ChevronDown className="w-2.5 h-2.5 text-gray-500" strokeWidth={2.5} />
            </span>
          </div>
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