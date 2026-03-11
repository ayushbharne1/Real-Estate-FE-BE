// src/api/profileApi.js
// Profile API — GET /api/auth/me

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token from localStorage on every request
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

/**
 * GET /api/auth/me
 * Requires: Bearer token in Authorization header
 * Returns:  { id, userName, email, imageUrl }
 */
export async function getMeApi() {
  try {
    const { data } = await api.get('/api/auth/me')
    // Response shape: { status: 'SUCCESS', data: { id, userName, email, imageUrl } }
    return data.data
  } catch (err) {
    const json = err.response?.data || {}
    throw {
      message: json.message || `Error ${err.response?.status ?? 'Unknown'}`,
    }
  }
}