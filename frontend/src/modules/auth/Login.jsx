import { useEffect } from 'react'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import {
  loginUser,
  clearErrors,
  selectAuthLoading,
  selectAuthError,
  selectFieldErrors,
  selectIsAuthenticated,
} from '../../redux/slices/authSlice'
import companyLogo from '../../assets/logo.svg'
import { loginSchema } from 'shared/schemas/index.js'

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
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Redux state
  const loading         = useSelector(selectAuthLoading)
  const serverError     = useSelector(selectAuthError)
  const fieldErrors     = useSelector(selectFieldErrors)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const formik = useFormik({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    validateOnBlur: true,
    validateOnChange: false, // only validate on blur / submit to avoid noise while typing
    onSubmit: async (values) => {
      // Clear any lingering Redux errors before a fresh attempt
      dispatch(clearErrors())

      const result = await dispatch(loginUser(values))

      if (loginUser.fulfilled.match(result)) {
        toast.success(`Welcome back, ${result.payload.admin?.name || 'Admin'}!`)
        navigate('/', { replace: true })
      } else {
        const msg = result.payload?.message
        if (msg) toast.error(msg)
      }
    },
  })

  // Clear Redux field errors when the user starts editing a field
  const handleFieldChange = (e) => {
    formik.handleChange(e)
    if (serverError || fieldErrors?.[e.target.name]) dispatch(clearErrors())
  }

  // Merge Formik + server-side field errors (server errors take lower priority)
  const identifierError =
    (formik.touched.identifier && formik.errors.identifier) ||
    fieldErrors?.identifier?.[0] ||
    ''

  const passwordError =
    (formik.touched.password && formik.errors.password) ||
    fieldErrors?.password?.[0] ||
    ''

  // Show a general banner only for non-field server errors
  const showServerBanner =
    serverError && !fieldErrors?.identifier && !fieldErrors?.password

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

          {/* General server error banner */}
          {showServerBanner && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>

            {/* Identifier */}
            <div className="space-y-1">
              <label htmlFor="identifier" className="text-sm font-medium text-gray-700">
                Email or Username <span className="text-[#E8431A]">*</span>
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={formik.values.identifier}
                onChange={handleFieldChange}
                onBlur={formik.handleBlur}
                placeholder="admin@example.com or admin123"
                autoComplete="username"
                className={`w-full px-0 py-2 border-0 border-b-2 text-gray-800 text-sm focus:outline-none transition-colors bg-transparent ${
                  identifierError
                    ? 'border-red-400'
                    : 'border-gray-200 focus:border-[#E8431A]'
                }`}
              />
              <FieldError message={identifierError} />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password <span className="text-[#E8431A]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={formik.values._showPass ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={handleFieldChange}
                  onBlur={formik.handleBlur}
                  autoComplete="current-password"
                  className={`w-full px-0 py-2 border-0 border-b-2 text-gray-800 text-sm focus:outline-none transition-colors bg-transparent pr-8 ${
                    passwordError
                      ? 'border-red-400'
                      : 'border-gray-200 focus:border-[#E8431A]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    formik.setFieldValue('_showPass', !formik.values._showPass)
                  }
                  className="absolute right-0 bottom-2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={formik.values._showPass ? 'Hide password' : 'Show password'}
                >
                  {formik.values._showPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
              <FieldError message={passwordError} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || formik.isSubmitting}
              className="w-full bg-[#E8431A] hover:bg-[#d03b15] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-3.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 text-sm mt-10"
            >
              {loading || formik.isSubmitting ? (
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