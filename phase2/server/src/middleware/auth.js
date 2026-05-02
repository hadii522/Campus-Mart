import { verifyToken } from '../utils/jwt.js'

export function authRequired(req, res, next) {
  const h = req.headers.authorization || ''
  const m = h.match(/^Bearer\s+(.+)$/i)
  if (!m) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }
  try {
    const payload = verifyToken(m[1])
    req.userId = payload.sub
    req.userRole = payload.role || 'user'
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function adminOnly(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }
  next()
}
