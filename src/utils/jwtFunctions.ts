import jwt from 'jsonwebtoken';

export const defaultTokenExpirySeconds = 24 * 60 * 60;

export const generateToken = (payload: Record<string, unknown>, expiresIn?: number | string) =>
  jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: expiresIn || defaultTokenExpirySeconds });

export const verifyToken = (token: string): Record<string, unknown> =>
  jwt.verify(token, process.env.JWT_SECRET!) as Record<string, unknown>;
