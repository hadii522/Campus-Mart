import jwt from 'jsonwebtoken'

export function signToken(userId, role) {
  return jwt.sign({ sub: userId, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}
