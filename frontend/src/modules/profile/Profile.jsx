import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { User, Phone, AtSign, Mail, LogOut, Camera, ChevronRight } from 'lucide-react'
import { logoutUser, selectAdmin } from '../../redux/slices/authSlice'

const RED = '#E8431A'

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-80 rounded-2xl shadow-2xl p-7 text-center" style={{ border: `2px solid ${RED}40` }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${RED}15` }}>
          <LogOut className="w-6 h-6" style={{ color: RED }} />
        </div>
        <h2 className="text-xl font-black mb-2" style={{ color: RED }}>{title}</h2>
        <p className="text-gray-500 text-sm mb-7">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border text-sm font-semibold hover:bg-orange-50 transition"
            style={{ borderColor: RED, color: RED }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition hover:opacity-90"
            style={{ background: RED }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Info Row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${RED}12` }}>
      <Icon className="w-4 h-4" style={{ color: RED }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-semibold truncate">{value || '—'}</p>
    </div>
  </div>
)

// ── Profile Page ──────────────────────────────────────────────────────────────
const Profile = () => {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const admin      = useSelector(selectAdmin)   // { id, name, email } from Redux
  const [showConfirm, setShowConfirm] = useState(false)
  const [loggingOut, setLoggingOut]   = useState(false)

  const handleConfirmLogout = async () => {
    setLoggingOut(true)
    await dispatch(logoutUser())         // clears Redux state + localStorage
    setShowConfirm(false)
    setLoggingOut(false)
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }

  // Derive initials for avatar fallback
  const initials = admin?.name
    ? admin.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  return (
    <div className="bg-gray-50" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Top banner */}
      <div className="h-40 w-full relative" style={{ background: `linear-gradient(135deg, ${RED} 0%, #ff7a55 100%)` }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10">

        {/* Avatar + name card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 pt-0 pb-6 mb-5 relative">
          <div className="flex items-end gap-5 -mt-12 mb-4">

            {/* Avatar — shows photo or initials fallback */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white overflow-hidden flex items-center justify-center"
                style={{ background: `${RED}20` }}>
                <span className="text-2xl font-black" style={{ color: RED }}>{initials}</span>
              </div>
              <button
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-md"
                style={{ background: RED }}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pb-1 flex-1">
              <h1 className="text-2xl font-black text-gray-900">{admin?.name || 'Admin'}</h1>
              <p className="text-sm text-gray-400 font-medium">{admin?.email || ''}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-1" />

          {/* Real data from Redux / API */}
          <InfoRow icon={User}  label="Full Name"      value={admin?.name} />
          <InfoRow icon={Mail}  label="Email Address"  value={admin?.email} />
          <InfoRow icon={AtSign} label="Admin ID"      value={admin?.id} />
        </div>

        {/* Logout button */}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={loggingOut}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-white font-bold text-base transition hover:opacity-90 active:scale-[0.98] shadow-sm disabled:opacity-60"
          style={{ background: RED }}
        >
          {loggingOut ? (
            <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          {loggingOut ? 'Logging out…' : 'Log Out'}
        </button>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}

export default Profile