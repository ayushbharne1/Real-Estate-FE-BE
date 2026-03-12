// src/redux/slices/profileSlice.js
// Manages the /api/auth/me fetch — keeps profile state separate from auth state

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMeApi } from '../../api/profileApi'

// ── Async Thunk ───────────────────────────────────────────────────────────────

/**
 * Fetches the current admin's profile from GET /api/auth/me
 * Returns: { id, userName, email, imageUrl }
 */
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await getMeApi()
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  data:    null,   // { id, userName, email, imageUrl }
  loading: false,
  error:   null,   // string
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile(state) {
      state.data    = null
      state.loading = false
      state.error   = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error   = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data    = action.payload   // { id, userName, email, imageUrl }
        state.error   = null
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error   = action.payload?.message || 'Failed to load profile'
        // data stays as-is so stale cache is still shown
      })
  },
})

export const { clearProfile } = profileSlice.actions
export default profileSlice.reducer

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectProfile        = (state) => state.profile.data
export const selectProfileLoading = (state) => state.profile.loading
export const selectProfileError   = (state) => state.profile.error