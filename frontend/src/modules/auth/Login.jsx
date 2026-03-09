import { useState, useEffect } from 'react'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  loginUser,
  clearErrors,
  selectAuthLoading,
  selectAuthError,
  selectFieldErrors,
  selectIsAuthenticated,
} from '../../redux/slices/authSlice'
import companyLogo from '../../assets/logo.svg'

// ── Inline field error ────────────────────────────────────────────────────────
const FieldError = ({ message }) =>
  message ? (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  ) : null

// ── Login Page ─────────────────────────────────────────────────────────────────
const Login = () => {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()

  // Redux state
  const loading         = useSelector(selectAuthLoading)
  const serverError     = useSelector(selectAuthError)
  const fieldErrors     = useSelector(selectFieldErrors)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Local form state
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  // Client-side validation errors
  const [localErrors, setLocalErrors] = useState({ email: '', password: '' })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  // Clear Redux errors when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setLocalErrors(prev => ({ ...prev, email: '' }))
    if (serverError || fieldErrors?.email) dispatch(clearErrors())
  }
  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setLocalErrors(prev => ({ ...prev, password: '' }))
    if (serverError || fieldErrors?.password) dispatch(clearErrors())
  }

  // Client-side validate before dispatching
  const validate = () => {
    const errors = { email: '', password: '' }
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Enter a valid email address'
    }
    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    setLocalErrors(errors)
    return !errors.email && !errors.password
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const result = await dispatch(loginUser({ email, password }))

    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.admin?.name || 'Admin'}!`)
      navigate('/', { replace: true })
    } else {
      // fieldErrors from slice will render inline; also show a toast for general errors
      const msg = result.payload?.message
      if (msg) toast.error(msg)
    }
  }

  // Merge server field errors on top of local ones
  const emailError    = localErrors.email    || fieldErrors?.email?.[0]    || ''
  const passwordError = localErrors.password || fieldErrors?.password?.[0] || ''

  return (
    <div className="min-h-screen flex bg-white font-sans">

      {/* ── Left: Image Panel ── */}
      <div className="relative w-1/2 hidden md:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
          alt="Building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* LOGIN badge */}
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[160px] h-[100px] bg-white rounded-l-full flex items-center justify-center z-10">
          <span className="text-[#E8431A] font-extrabold text-2xl tracking-widest">
            LOGIN
          </span>
        </div>
      </div>

      {/* ── Right: Form Panel ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="mb-10">
            <img src={companyLogo} alt="INFINITEREALTY" className="w-64 mb-4" />
            <p className="text-sm text-gray-500">
              Login with your email or username.
            </p>
          </div>

          <div className="mb-8">
            <span className="text-[#E8431A] font-bold text-xl">LOGIN</span>
          </div>

          {/* General server error banner (non-field errors) */}
          {serverError && !fieldErrors?.email && !fieldErrors?.password && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Email <span className="text-[#E8431A]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="admin@example.com"
                autoComplete="email"
                className={`w-full px-0 py-2 border-0 border-b-2 text-gray-800 text-sm focus:outline-none transition-colors bg-transparent ${
                  emailError ? 'border-red-400' : 'border-gray-200 focus:border-[#E8431A]'
                }`}
              />
              <FieldError message={emailError} />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-[#E8431A]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  autoComplete="current-password"
                  className={`w-full px-0 py-2 border-0 border-b-2 text-gray-800 text-sm focus:outline-none transition-colors bg-transparent pr-8 ${
                    passwordError ? 'border-red-400' : 'border-gray-200 focus:border-[#E8431A]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <FieldError message={passwordError} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8431A] hover:bg-[#d03b15] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm mt-10"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in…
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-xs text-gray-400 text-center">
            **{' '}
            <Link to="/privacy" className="hover:underline hover:text-gray-500">
              Privacy policy & Terms and conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login