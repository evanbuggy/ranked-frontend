/**
 * Backend origin (no trailing slash).
 * - Prod (files served from Spring on 8080): same origin → ''.
 * - Dev: default http://localhost:8080, or set VITE_API_BASE.
 * - Dev + Vite proxy: set VITE_API_RELATIVE=1 so requests use '' and vite.config.js proxies /api → backend.
 */
const envBase = import.meta.env.VITE_API_BASE
const useRelativeDev =
  import.meta.env.VITE_API_RELATIVE === 'true' || import.meta.env.VITE_API_RELATIVE === '1'

export const API_BASE = useRelativeDev && !import.meta.env.PROD
  ? ''
  : envBase !== undefined && envBase !== ''
    ? envBase
    : import.meta.env.PROD
      ? ''
      : 'http://localhost:8080'

export function setAuthToken(token) {
  if (!token) localStorage.removeItem('token')
  else localStorage.setItem('token', token)
}

export function getAuthToken() {
  return localStorage.getItem('token')
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const auth = token || getAuthToken()
  if (auth) headers['Authorization'] = `Bearer ${auth}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${text || res.statusText}`)
  }

  // If the backend returns CSV/plain text, caller should request text explicitly.
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function escapeCsvCell(v) {
  if (v === null || v === undefined) return ''
  const s = String(v).replaceAll('"', '""')
  if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s}"`
  return s
}

