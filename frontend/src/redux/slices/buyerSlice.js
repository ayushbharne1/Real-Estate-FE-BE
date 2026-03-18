// src/redux/slices/buyerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchBuyers       as apiFetchBuyers,
  fetchBuyer        as apiFetchBuyer,
  createBuyer       as apiCreateBuyer,
  updateBuyer       as apiUpdateBuyer,
  updateBuyerStatus as apiUpdateBuyerStatus,
} from '../../api/buyerApi'

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/**
 * Fetch paginated + filtered buyer list.
 * params: { search?, listingType?, assetType?, status?, page?, limit? }
 */
export const fetchBuyers = createAsyncThunk(
  'buyers/fetchBuyers',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await apiFetchBuyers(params)   // { items, total, page, limit, totalPages }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

/**
 * Fetch a single buyer by MongoDB _id.
 */
export const fetchBuyer = createAsyncThunk(
  'buyers/fetchBuyer',
  async (id, { rejectWithValue }) => {
    try {
      return await apiFetchBuyer(id)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

/**
 * Create a new buyer.
 * payload: full buyer body as expected by POST /api/buyers
 */
export const createBuyer = createAsyncThunk(
  'buyers/createBuyer',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiCreateBuyer(payload)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

/**
 * Partial update of a buyer (all fields optional).
 * { id: string, payload: Partial<BuyerBody> }
 */
export const updateBuyer = createAsyncThunk(
  'buyers/updateBuyer',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await apiUpdateBuyer(id, payload)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

/**
 * Quick status-only update (PATCH /api/buyers/:id/status).
 * { id: string, status: 'IN_PROGRESS' | 'ACTIVE' | 'CANCELLED' }
 */
export const updateBuyerStatus = createAsyncThunk(
  'buyers/updateBuyerStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await apiUpdateBuyerStatus(id, status)
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const buyerSlice = createSlice({
  name: 'buyers',
  initialState: {
    // ── list ──────────────────────────────────────────────────
    items:       [],
    total:       0,
    page:        1,
    limit:       20,
    totalPages:  0,
    listLoading: false,
    listError:   null,

    // ── single buyer (detail / edit) ──────────────────────────
    current:       null,
    detailLoading: false,
    detailError:   null,

    // ── create / update ───────────────────────────────────────
    saving:      false,
    saveError:   null,
    saveSuccess: false,

    // ── status patch ──────────────────────────────────────────
    statusUpdating: false,
    statusError:    null,
  },

  reducers: {
    clearSaveState(state) {
      state.saving      = false
      state.saveError   = null
      state.saveSuccess = false
    },
    clearStatusState(state) {
      state.statusUpdating = false
      state.statusError    = null
    },
    clearCurrent(state) {
      state.current       = null
      state.detailError   = null
      state.detailLoading = false
    },
    clearErrors(state) {
      state.listError   = null
      state.detailError = null
      state.saveError   = null
      state.statusError = null
    },
  },

  extraReducers: builder => {

    // ── fetchBuyers ────────────────────────────────────────────
    builder
      .addCase(fetchBuyers.pending, state => {
        state.listLoading = true
        state.listError   = null
      })
      .addCase(fetchBuyers.fulfilled, (state, { payload }) => {
        state.listLoading = false
        state.items       = payload.items
        state.total       = payload.total
        state.page        = payload.page
        state.limit       = payload.limit
        state.totalPages  = payload.totalPages
      })
      .addCase(fetchBuyers.rejected, (state, { payload }) => {
        state.listLoading = false
        state.listError   = payload?.message || 'Failed to load buyers'
      })

    // ── fetchBuyer ─────────────────────────────────────────────
    builder
      .addCase(fetchBuyer.pending, state => {
        state.detailLoading = true
        state.detailError   = null
      })
      .addCase(fetchBuyer.fulfilled, (state, { payload }) => {
        state.detailLoading = false
        state.current       = payload
      })
      .addCase(fetchBuyer.rejected, (state, { payload }) => {
        state.detailLoading = false
        state.detailError   = payload?.message || 'Failed to load buyer'
      })

    // ── createBuyer ────────────────────────────────────────────
    builder
      .addCase(createBuyer.pending, state => {
        state.saving      = true
        state.saveError   = null
        state.saveSuccess = false
      })
      .addCase(createBuyer.fulfilled, (state, { payload }) => {
        state.saving      = false
        state.saveSuccess = true
        state.items.unshift(payload)          // prepend to list
        state.total       = state.total + 1
      })
      .addCase(createBuyer.rejected, (state, { payload }) => {
        state.saving    = false
        state.saveError = payload?.message || 'Failed to create buyer'
      })

    // ── updateBuyer ────────────────────────────────────────────
    builder
      .addCase(updateBuyer.pending, state => {
        state.saving      = true
        state.saveError   = null
        state.saveSuccess = false
      })
      .addCase(updateBuyer.fulfilled, (state, { payload }) => {
        state.saving      = false
        state.saveSuccess = true
        state.current     = payload
        // Sync the updated record inside the list too
        const idx = state.items.findIndex(i => i._id === payload._id)
        if (idx !== -1) state.items[idx] = payload
      })
      .addCase(updateBuyer.rejected, (state, { payload }) => {
        state.saving    = false
        state.saveError = payload?.message || 'Failed to update buyer'
      })

    // ── updateBuyerStatus ──────────────────────────────────────
    builder
      .addCase(updateBuyerStatus.pending, state => {
        state.statusUpdating = true
        state.statusError    = null
      })
      .addCase(updateBuyerStatus.fulfilled, (state, { payload }) => {
        state.statusUpdating = false
        // Update the list in-place so the table re-renders instantly
        const idx = state.items.findIndex(i => i._id === payload._id)
        if (idx !== -1) state.items[idx] = payload
        // Also update current if it matches
        if (state.current?._id === payload._id) state.current = payload
      })
      .addCase(updateBuyerStatus.rejected, (state, { payload }) => {
        state.statusUpdating = false
        state.statusError    = payload?.message || 'Failed to update status'
      })
  },
})

export const {
  clearSaveState,
  clearStatusState,
  clearCurrent,
  clearErrors,
} = buyerSlice.actions

export default buyerSlice.reducer

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectBuyerList     = s => s.buyers.items
export const selectBuyerTotal    = s => s.buyers.total
export const selectBuyerPage     = s => s.buyers.page
export const selectBuyerPages    = s => s.buyers.totalPages
export const selectListLoading   = s => s.buyers.listLoading
export const selectListError     = s => s.buyers.listError

export const selectCurrentBuyer  = s => s.buyers.current
export const selectDetailLoading = s => s.buyers.detailLoading
export const selectDetailError   = s => s.buyers.detailError

export const selectSaving        = s => s.buyers.saving
export const selectSaveError     = s => s.buyers.saveError
export const selectSaveSuccess   = s => s.buyers.saveSuccess

export const selectStatusUpdating = s => s.buyers.statusUpdating
export const selectStatusError    = s => s.buyers.statusError