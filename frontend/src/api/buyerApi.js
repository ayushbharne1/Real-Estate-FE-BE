// src/api/buyerApi.js
// All buyer / customer API calls — JSON body (no multipart)
import api from "./axiosInstance";
// ─── helpers ──────────────────────────────────────────────────────────────────

function _normalise(err) {
  const json = err.response?.data || {}
  return {
    message: json.message || `Error ${err.response?.status ?? 'Unknown'}`,
    errors:  json.errors  || {},
  }
}

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * GET /api/buyers
 * Params: { search?, listingType?, assetType?, status?, page?, limit? }
 * Returns: { items, total, page, limit, totalPages }
 */
export async function fetchBuyers(params = {}) {
  try {
    const { data } = await api.get('/buyers', { params })
    return data.data   // { items, total, page, limit, totalPages }
  } catch (err) {
    throw _normalise(err)
  }
}

/**
 * GET /api/buyers/:id
 * Returns a single buyer object
 */
export async function fetchBuyer(id) {
  try {
    const { data } = await api.get(`/buyers/${id}`)
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/**
 * POST /api/buyers
 * Body shape (mirrors the API schema):
 * {
 *   name, countryCode, contact, email, propertyId,
 *   assetType, listingType,
 *   askPrice, askPriceUnit, pricePaid, pricePaidUnit,   // Resale
 *   rent, rentUnit, deposit, depositUnit,               // Rental
 *   status
 * }
 * Returns the created buyer object
 */
export async function createBuyer(payload) {
  try {
    const { data } = await api.post('/buyers', payload)
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/**
 * PUT /api/buyers/:id   (partial update — send only changed fields)
 * Body shape: same optional fields as POST
 * Returns the updated buyer object
 */
export async function updateBuyer(id, payload) {
  try {
    const { data } = await api.put(`/buyers/${id}`, payload)
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}

/**
 * PATCH /api/buyers/:id/status
 * Body: { status: 'IN_PROGRESS' | 'ACTIVE' | 'CANCELLED' }
 * Returns the updated buyer object
 */
export async function updateBuyerStatus(id, status) {
  try {
    const { data } = await api.patch(`/buyers/${id}/status`, { status })
    return data.data
  } catch (err) {
    throw _normalise(err)
  }
}