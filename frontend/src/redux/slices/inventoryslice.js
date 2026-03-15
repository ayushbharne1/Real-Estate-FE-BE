// src/redux/slices/inventorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchProperties       as apiFetchProperties,
  fetchProperty         as apiFetchProperty,
  fetchSimilarProperties as apiFetchSimilar,
  createProperty        as apiCreateProperty,
  updateProperty        as apiUpdateProperty,
  deleteProperty        as apiDeleteProperty,
   fetchAssetTypeCounts as apiFetchAssetTypeCounts,
} from  '../../api/inventoryApi'

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchProperties = createAsyncThunk(
  'inventory/fetchProperties',
  async (params = {}, { rejectWithValue }) => {
    try { return await apiFetchProperties(params) }
    catch (err) { return rejectWithValue(err) }
  }
)

export const fetchProperty = createAsyncThunk(
  'inventory/fetchProperty',
  async (id, { rejectWithValue }) => {
    try { return await apiFetchProperty(id) }
    catch (err) { return rejectWithValue(err) }
  }
)

export const fetchSimilar = createAsyncThunk(
  'inventory/fetchSimilar',
  async (id, { rejectWithValue }) => {
    try { return await apiFetchSimilar(id) }
    catch (err) { return rejectWithValue(err) }
  }
)

export const createProperty = createAsyncThunk(
  'inventory/createProperty',
  async (formData, { rejectWithValue }) => {
    try { return await apiCreateProperty(formData) }
    catch (err) { return rejectWithValue(err) }
  }
)

export const updateProperty = createAsyncThunk(
  'inventory/updateProperty',
  async ({ id, formData }, { rejectWithValue }) => {
    try { return await apiUpdateProperty(id, formData) }
    catch (err) { return rejectWithValue(err) }
  }
)

export const deleteProperty = createAsyncThunk(
  'inventory/deleteProperty',
  async (id, { rejectWithValue }) => {
    try { await apiDeleteProperty(id); return id }
    catch (err) { return rejectWithValue(err) }
  }
)

export const fetchAssetTypeCounts = createAsyncThunk(
  'inventory/fetchAssetTypeCounts',
  async (params, { rejectWithValue }) => {
    try { return await apiFetchAssetTypeCounts(params) }
    catch (err) { return rejectWithValue(err) }
  }
)

// ─── Slice ────────────────────────────────────────────────────────────────────

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    // list
    items:       [],
    total:       0,
    page:        1,
    limit:       20,
    totalPages:  0,
    listLoading: false,
    listError:   null,

    // single property (detail / edit)
    current:       null,
    detailLoading: false,
    detailError:   null,

    // similar properties
    similar:        [],
    similarLoading: false,
    similarError:   null,

    // create / update / delete
    saving:      false,
    saveError:   null,
    saveSuccess: false,

    deleting:    false,
    deleteError: null,

    // asset type counts
    assetCounts: {},
  },
  reducers: {
    clearSaveState(state) {
      state.saving      = false
      state.saveError   = null
      state.saveSuccess = false
    },
    clearDeleteState(state) {
      state.deleting    = false
      state.deleteError = null
    },
    clearCurrent(state) {
      state.current       = null
      state.detailError   = null
      state.detailLoading = false
      state.similar       = []
      state.similarError  = null
    },
    clearErrors(state) {
      state.listError    = null
      state.detailError  = null
      state.saveError    = null
      state.deleteError  = null
      state.similarError = null
    },
  },
  extraReducers: builder => {

    // ── fetchProperties ────────────────────────────────────────
    builder
      .addCase(fetchProperties.pending, state => {
        state.listLoading = true
        state.listError   = null
      })
      .addCase(fetchProperties.fulfilled, (state, { payload }) => {
        state.listLoading = false
        state.items       = payload.items
        state.total       = payload.total
        state.page        = payload.page
        state.limit       = payload.limit
        state.totalPages  = payload.totalPages
      })
      .addCase(fetchProperties.rejected, (state, { payload }) => {
        state.listLoading = false
        state.listError   = payload?.message || 'Failed to load properties'
      })

    // ── fetchProperty ──────────────────────────────────────────
    builder
      .addCase(fetchProperty.pending, state => {
        state.detailLoading = true
        state.detailError   = null
        state.current       = null
      })
      .addCase(fetchProperty.fulfilled, (state, { payload }) => {
        state.detailLoading = false
        state.current       = payload
      })
      .addCase(fetchProperty.rejected, (state, { payload }) => {
        state.detailLoading = false
        state.detailError   = payload?.message || 'Failed to load property'
      })

    // ── fetchSimilar ───────────────────────────────────────────
    builder
      .addCase(fetchSimilar.pending, state => {
        state.similarLoading = true
        state.similarError   = null
      })
      .addCase(fetchSimilar.fulfilled, (state, { payload }) => {
        state.similarLoading = false
        state.similar        = payload
      })
      .addCase(fetchSimilar.rejected, (state, { payload }) => {
        state.similarLoading = false
        state.similarError   = payload?.message || 'Failed to load similar properties'
      })

    // ── createProperty ─────────────────────────────────────────
    builder
      .addCase(createProperty.pending, state => {
        state.saving      = true
        state.saveError   = null
        state.saveSuccess = false
      })
      .addCase(createProperty.fulfilled, (state, { payload }) => {
        state.saving      = false
        state.saveSuccess = true
        state.items       = [payload, ...state.items]
        state.total       += 1
      })
      .addCase(createProperty.rejected, (state, { payload }) => {
        state.saving    = false
        state.saveError = payload?.message || 'Failed to create property'
      })

    // ── updateProperty ─────────────────────────────────────────
    builder
      .addCase(updateProperty.pending, state => {
        state.saving      = true
        state.saveError   = null
        state.saveSuccess = false
      })
      .addCase(updateProperty.fulfilled, (state, { payload }) => {
        state.saving      = false
        state.saveSuccess = true
        state.current     = payload
        const idx = state.items.findIndex(i => i._id === payload._id)
        if (idx !== -1) state.items[idx] = payload
      })
      .addCase(updateProperty.rejected, (state, { payload }) => {
        state.saving    = false
        state.saveError = payload?.message || 'Failed to update property'
      })

    // ── deleteProperty ─────────────────────────────────────────
    builder
      .addCase(deleteProperty.pending, state => {
        state.deleting    = true
        state.deleteError = null
      })
      .addCase(deleteProperty.fulfilled, (state, { payload: id }) => {
        state.deleting = false
        state.items    = state.items.filter(i => i._id !== id)
        state.total    = Math.max(0, state.total - 1)
        if (state.current?._id === id) state.current = null
      })
      .addCase(deleteProperty.rejected, (state, { payload }) => {
        state.deleting    = false
        state.deleteError = payload?.message || 'Failed to delete property'
      })

    // assets counts
    builder
      .addCase(fetchAssetTypeCounts.fulfilled, (state, { payload }) => {
        state.assetCounts = payload
      })
  },
})

export const {
  clearSaveState, clearDeleteState, clearCurrent, clearErrors,
} = inventorySlice.actions

export default inventorySlice.reducer

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectInventoryList    = s => s.inventory.items
export const selectInventoryTotal   = s => s.inventory.total
export const selectInventoryPage    = s => s.inventory.page
export const selectInventoryPages   = s => s.inventory.totalPages
export const selectListLoading      = s => s.inventory.listLoading
export const selectListError        = s => s.inventory.listError

export const selectCurrentProperty  = s => s.inventory.current
export const selectDetailLoading    = s => s.inventory.detailLoading
export const selectDetailError      = s => s.inventory.detailError

export const selectSimilar          = s => s.inventory.similar
export const selectSimilarLoading   = s => s.inventory.similarLoading
export const selectSimilarError     = s => s.inventory.similarError

export const selectSaving           = s => s.inventory.saving
export const selectSaveError        = s => s.inventory.saveError
export const selectSaveSuccess      = s => s.inventory.saveSuccess

export const selectDeleting         = s => s.inventory.deleting
export const selectDeleteError      = s => s.inventory.deleteError

export const selectAssetCounts = s => s.inventory.assetCounts