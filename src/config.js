/** Base URL for REST API (no trailing slash). Example: http://localhost:5000/api */
export const API_BASE =
  (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export const TOKEN_KEY = 'campusMart.jwt'
