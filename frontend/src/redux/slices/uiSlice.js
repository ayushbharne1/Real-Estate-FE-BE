import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { searchQuery: '', debouncedSearchQuery: '' },
  reducers: {
    setSearchQuery(state, action) { state.searchQuery = action.payload },
    setDebouncedSearchQuery(state, action) { state.debouncedSearchQuery = action.payload },
  },
})

export const { setSearchQuery, setDebouncedSearchQuery } = uiSlice.actions
export const selectSearchQuery = s => s.ui.searchQuery
export const selectDebouncedSearchQuery = s => s.ui.debouncedSearchQuery
export default uiSlice.reducer