import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginApi } from '../../api/authApi'

// ── Async Thunk ───────────────────────────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginApi({ email, password })
      // Persist token to localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('admin', JSON.stringify(data.admin))
      return data  // { token, admin: { id, name, email } }
    } catch (err) {
      // err is already shaped by authApi: { message, errors? }
      return rejectWithValue(err)
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('admin')
})

// ── Initial State ─────────────────────────────────────────────────────────────
const storedAdmin = localStorage.getItem('admin')
const initialState = {
  admin:      storedAdmin ? JSON.parse(storedAdmin) : null,
  token:      localStorage.getItem('token') || null,
  loading:    false,
  error:      null,    // string — general error message
  fieldErrors: {},     // { email?: string[], password?: string[] }
  isAuthenticated: !!localStorage.getItem('token'),
}

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors(state) {
      state.error      = null
      state.fieldErrors = {}
    },
  },
  extraReducers: (builder) => {
    // ── Login ──────────────────────────────────────────────────────────────
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading     = true
        state.error       = null
        state.fieldErrors = {}
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading         = false
        state.token           = action.payload.token
        state.admin           = action.payload.admin
        state.isAuthenticated = true
        state.error           = null
        state.fieldErrors     = {}
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading     = false
        state.token       = null
        state.admin       = null
        state.isAuthenticated = false
        // action.payload comes from rejectWithValue
        const payload = action.payload
        if (payload?.errors) {
          state.fieldErrors = payload.errors   // e.g. { password: ['Password must be at least 6 characters'] }
        }
        state.error = payload?.message || 'Login failed. Please try again.'
      })

    // ── Logout ─────────────────────────────────────────────────────────────
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.token           = null
        state.admin           = null
        state.isAuthenticated = false
        state.error           = null
        state.fieldErrors     = {}
      })
  },
})

export const { clearErrors } = authSlice.actions
export default authSlice.reducer

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectAuth            = (state) => state.auth
export const selectAdmin           = (state) => state.auth.admin
export const selectToken           = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading     = (state) => state.auth.loading
export const selectAuthError       = (state) => state.auth.error
export const selectFieldErrors     = (state) => state.auth.fieldErrors