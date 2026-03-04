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
} from 'lucide-react'
import ConfirmModal from '../common/ConfirmModal'

// ─── Nav Config ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'dashboard',  icon: Home,          path: '/',          label: 'Properties' },
  { id: 'listings',   icon: ClipboardList, path: '/listings',  label: 'Listings' },
  { id: 'orders',     icon: ShoppingCart,  path: '/orders',    label: 'Orders' },
  { id: 'tags',       icon: Tag,           path: '/tags',      label: 'Tags' },
  // use relative path for nested routing
  { id: 'add',        icon: PlusCircle,    path: 'add',        label: 'Add Inventory' },
]

const BOTTOM_ITEMS = [
  { id: 'settings', icon: Settings, path: '/settings', label: 'Settings' },
  { id: 'logout',   icon: LogOut,   path: '/login',    label: 'Logout', isLogout: true },
]

// ─── Tooltip wrapper ───────────────────────────────────────────────────────────
const TooltipIcon = ({ label, children }) => (
  <div className="relative group flex justify-center">
    {children}
    <span className="pointer-events-none absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
      {label}
    </span>
  </div>
)

// ─── Nav Item ──────────────────────────────────────────────────────────────────
const NavItem = ({ item }) => {
  const Icon = item.icon
  return (
    <li>
      <TooltipIcon label={item.label}>
        <NavLink
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-150 ${
              isActive
                ? 'bg-[#E8431A] text-white shadow-md'
                : 'text-gray-500 hover:bg-orange-50 hover:text-[#E8431A]'
            }`
          }
        >
          <Icon className="w-5 h-5" strokeWidth={1.8} />
        </NavLink>
      </TooltipIcon>
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
      <aside className="sticky top-0 w-16 h-screen bg-white border-r border-gray-300 flex flex-col items-center shadow-md shadow-olive-400 py-4 z-20 rounded-tr-md rounded-br-md">

        

        {/* Main Nav */}
        <nav className="flex-1 w-full flex flex-col items-center">
          <ul className="flex flex-col items-center gap-2 w-full px-3">
            {NAV_ITEMS.map((item) => (
              <NavItem key={item.id} item={item} />
            ))}
          </ul>
        </nav>

        {/* Bottom – Settings, Logout, Avatar */}
        <div className="flex flex-col items-center gap-2 px-3 w-full border-t border-gray-100 pt-3">
          {BOTTOM_ITEMS.map((item) =>
            item.isLogout ? (
              <TooltipIcon key={item.id} label={item.label}>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-red-50 hover:text-[#E8431A] transition-colors duration-150"
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.8} />
                </button>
              </TooltipIcon>
            ) : (
              <NavItem key={item.id} item={item} />
            )
          )}

          {/* User Avatar */}
          <div className="mt-2 relative cursor-pointer group">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <div className="w-full h-full bg-orange-300 flex items-center justify-center text-white text-sm font-bold">
                L
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm">
              <ChevronDown className="w-3 h-3 text-gray-500" strokeWidth={2.5} />
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