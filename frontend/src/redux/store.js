// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer      from './slices/authSlice'
import inventoryReducer from './slices/inventoryslice'
import profileReducer from './slices/profileSlice'
import buyerReducer from './slices/buyerSlice'

export const store = configureStore({
  reducer: {
    auth:      authReducer,
    inventory: inventoryReducer,
    profile:   profileReducer, 
    buyers:    buyerReducer,   
  },
})

export default store