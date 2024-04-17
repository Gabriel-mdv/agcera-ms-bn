import jwt from 'jsonwebtoken'

export const generateToken = (payload: Record<string, unknown>) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' })

export const verifyToken = (token: string): Record<string, unknown> =>
  jwt.verify(token, process.env.JWT_SECRET!) as Record<string, unknown>
