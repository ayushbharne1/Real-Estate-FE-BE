const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

/**
 * POST /api/auth/login
 * Body: { email, password }
 * 200 → { token, admin: { id, name, email } }
 * 400 → { status: 'ERROR', message, errors: { password: [...] } }
 * 409 → { status: 'ERROR', message: 'Email already exists' }
 */
export async function loginApi({ email, password }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email, password }),
  })

  const json = await res.json()

  if (!res.ok) {
    // Normalise error shape for the slice
    // API returns: { status: 'ERROR', message, errors?: { field: [string] } }
    throw {
      message: json.message || `Error ${res.status}`,
      errors:  json.errors  || {},
    }
  }

  // 200 shape: { status: 'SUCCESS', data: { token, admin } }
  return json.data
}