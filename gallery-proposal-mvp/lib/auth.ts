import { getIronSession, IronSession, SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import bcrypt from 'bcrypt'
import { db } from './db'

export interface SessionData {
  userId: string
  userEmail: string
  userName: string
  userRole: string
  galleryId: string
  isLoggedIn: boolean
}

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'gallery_crm_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), sessionOptions)
}

export async function login(email: string, password: string) {
  // Find user in mock data
  const user = db.users.find((u) => u.email === email)

  if (!user) {
    return { success: false, error: 'Invalid email or password' }
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash)

  if (!passwordMatch) {
    return { success: false, error: 'Invalid email or password' }
  }

  const session = await getSession()
  session.userId = user.id
  session.userEmail = user.email
  session.userName = user.name
  session.userRole = user.role
  session.galleryId = user.galleryId
  session.isLoggedIn = true

  await session.save()

  return { success: true, user }
}

export async function logout() {
  const session = await getSession()
  session.destroy()
}

export async function requireAuth() {
  const session = await getSession()

  if (!session.isLoggedIn) {
    return null
  }

  return {
    userId: session.userId,
    userEmail: session.userEmail,
    userName: session.userName,
    userRole: session.userRole,
    galleryId: session.galleryId,
  }
}
