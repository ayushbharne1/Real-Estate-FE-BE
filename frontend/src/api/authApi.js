import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/**
 * POST /api/auth/login
 * Body: { email, password }
 * 200 → { token, admin: { id, name, email } }
 * 400 → { status: 'ERROR', message, errors: { password: [...] } }
 * 409 → { status: 'ERROR', message: 'Email already exists' }
 */
export async function loginApi({ email, password }) {
  try {
    const { data } = await api.post('/api/auth/login', { email, password })
    // 200 shape: { status: 'SUCCESS', data: { token, admin } }
    return data.data
  } catch (err) {
    const json = err.response?.data || {}
    // Normalise error shape for the slice
    throw {
      message: json.message || `Error ${err.response?.status ?? 'Unknown'}`,
      errors:  json.errors  || {},
    }
  }
}