// frontend/src/redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { searchQuery: '' },
  reducers: {
    setSearchQuery(state, action) { state.searchQuery = action.payload },
  },
})

export const { setSearchQuery } = uiSlice.actions
export const selectSearchQuery = s => s.ui.searchQuery
export default uiSlice.reducer