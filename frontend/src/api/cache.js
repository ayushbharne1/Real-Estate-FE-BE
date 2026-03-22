const cache = new Map()
const TTL = 60_000 // 1 minute

export function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.time > TTL) { cache.delete(key); return null }
  return entry.data
}

export function setCached(key, data) {
  cache.set(key, { data, time: Date.now() })
}

export function clearCache() {
  cache.clear()
}