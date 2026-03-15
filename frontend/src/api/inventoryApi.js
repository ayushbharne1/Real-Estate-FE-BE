// src/api/inventoryApi.js
// All inventory / property API calls — multipart for create & update

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({ baseURL: BASE_URL })

// Attach auth token on every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ─── helpers ──────────────────────────────────────────────────────────────────

export function buildFormData(values, imageFiles = [], videoFile = null, existingImages = null) {
  const fd = new FormData()
  Object.entries(values).forEach(([key, val]) => {
    if (val === undefined || val === null || val === '') return
    if (Array.isArray(val)) fd.append(key, JSON.stringify(val))
    else fd.append(key, val)
  })
  imageFiles.forEach(f => fd.append('images', f))
  if (videoFile) fd.append('video', videoFile)
  if (existingImages !== null) fd.append('existingImages', JSON.stringify(existingImages))
  return fd
}

// ─── API functions ────────────────────────────────────────────────────────────

/** GET /api/inventory?page&limit&...filters */
export async function fetchProperties(params = {}) {
  try {
    const { data } = await api.get('/api/inventory', { params })
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/** GET /api/inventory/:id */
export async function fetchProperty(id) {
  try {
    const { data } = await api.get(`/api/inventory/${id}`)
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/** GET /api/inventory/:id/similar */
export async function fetchSimilarProperties(id) {
  try {
    const { data } = await api.get(`/api/inventory/${id}/similar`)
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/** POST /api/inventory (multipart) */
export async function createProperty(formData) {
  try {
    const { data } = await api.post('/api/inventory', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/** PUT /api/inventory/:id (multipart) */
export async function updateProperty(id, formData) {
  try {
    const { data } = await api.put(`/api/inventory/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/** DELETE /api/inventory/:id (soft delete) */
export async function deleteProperty(id) {
  try {
    const { data } = await api.delete(`/api/inventory/${id}`)
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

export async function fetchAssetTypeCounts(params) {
  try {
    const { data } = await api.get('/api/inventory/asset-type-counts', {
       params: params || {},
    });
    return data.data;
  } catch (err) {
    throw _normalise(err);
  }
}

function _normalise(err) {
  const json = err.response?.data || {}
  return {
    message: json.message || `Error ${err.response?.status ?? 'Unknown'}`,
    errors:  json.errors  || {},
  }
}