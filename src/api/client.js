import { API_BASE, TOKEN_KEY } from '../config.js'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const h = { ...headers }
  const token = getToken()
  if (token) h.Authorization = `Bearer ${token}`

  let reqBody = body
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    h['Content-Type'] = 'application/json'
    reqBody = JSON.stringify(body)
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: h,
    body: reqBody,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data.error || data.message || res.statusText || 'Request failed'
    throw new Error(msg)
  }
  return data
}
