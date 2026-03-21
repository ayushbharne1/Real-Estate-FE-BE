// src/modules/profile/Profile.jsx

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { User, AtSign, Mail, LogOut, Camera } from 'lucide-react'

import { logoutUser } from '../../redux/slices/authSlice'
import {
  fetchProfile,
  selectProfile,
  selectProfileLoading,
  selectProfileError,
} from '../../redux/slices/profileSlice'

import ConfirmModal from '../../components/common/ConfirmModal'

const RED = '#E8431A'


// ── Info Row ──────────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `${RED}12` }}
    >
      <Icon className="w-4 h-4" style={{ color: RED }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-semibold truncate">{value || '—'}</p>
    </div>
  </div>
)

// ── Skeleton Row (shown while loading) ───────────────────────────────────────
const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 animate-pulse">
    <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-2.5 bg-gray-100 rounded w-20" />
      <div className="h-3.5 bg-gray-200 rounded w-40" />
    </div>
  </div>
)

// ── Profile Page ──────────────────────────────────────────────────────────────
const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Profile state — from profileSlice (GET /api/auth/me)
  const profile = useSelector(selectProfile)
  const profileLoading = useSelector(selectProfileLoading)
  const profileError = useSelector(selectProfileError)

  const [showConfirm, setShowConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Fetch fresh profile from API on mount
  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  const handleConfirmLogout = async () => {
    setLoggingOut(true)
    await dispatch(logoutUser())
    setShowConfirm(false)
    toast.success('Logged out successfully')
    navigate('/login', { replace: true })
  }

  // API returns userName (not name) — derive display name + initials
  const displayName = profile?.userName || 'Admin'
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'AD'

  return (
    <div className="bg-gray-50" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── Top banner ── */}
      <div
        className="h-40 w-full relative"
        style={{ background: `linear-gradient(135deg, ${RED} 0%, #ff7a55 100%)` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-10">

        {/* ── Avatar + info card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 pt-0 pb-6 mb-5 relative">
          <div className="flex items-end gap-5 -mt-12 mb-4">

            {/* Avatar — Cloudinary image or initials fallback */}
            <div className="relative">
              <div
                className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white overflow-hidden flex items-center justify-center"
                style={{ background: `${RED}20` }}
              >
                {profile?.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black" style={{ color: RED }}>
                    {initials}
                  </span>
                )}
              </div>
              <button
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-md"
                style={{ background: RED }}
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="pb-1 flex-1">
              {profileLoading && !profile ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-36" />
                  <div className="h-3 bg-gray-100 rounded w-48" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-black text-gray-900">{displayName}</h1>
                  <p className="text-sm text-gray-400 font-medium">{profile?.email || ''}</p>
                </>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-1" />

          {/* Profile rows — skeleton while first load, error state, or real data */}
          {profileLoading && !profile ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : profileError && !profile ? (
            <div className="py-6 text-center">
              <p className="text-sm text-red-500 mb-3">{profileError}</p>
              <button
                onClick={() => dispatch(fetchProfile())}
                className="text-xs font-semibold px-4 py-1.5 rounded-lg border transition hover:bg-orange-50"
                style={{ borderColor: RED, color: RED }}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <InfoRow icon={User} label="Username" value={profile?.userName} />
              <InfoRow icon={Mail} label="Email Address" value={profile?.email} />
              <InfoRow icon={AtSign} label="Admin ID" value={profile?.id} />
            </>
          )}
        </div>

        {/* ── Logout button ── */}
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