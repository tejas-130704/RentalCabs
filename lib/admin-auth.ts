import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'
const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE_NAME || 'admin_session'
const COOKIE_MAX_AGE = 8 * 60 * 60 // 8 hours in seconds

export interface AdminSession {
  adminId: string
  username: string
}

export async function signJWT(payload: AdminSession): Promise<string> {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '8h',
  })
}

export async function verifyJWT(token: string): Promise<AdminSession | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession
    return decoded
  } catch (error) {
    return null
  }
}

export async function setAdminSession(payload: AdminSession): Promise<void> {
  const token = await signJWT(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  return await verifyJWT(token)
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}
