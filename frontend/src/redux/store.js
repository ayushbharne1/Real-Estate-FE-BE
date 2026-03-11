// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer      from './slices/authSlice'
import inventoryReducer from './slices/inventoryslice'
import profileReducer from './slices/profileSlice'

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    inventory: inventoryReducer,
    profile:   profileReducer,   
  },
})

export default store