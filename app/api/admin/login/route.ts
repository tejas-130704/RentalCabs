import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { adminUser } from '@/lib/db/schema'
import { verifyPassword, hashPassword, setAdminSession } from '@/lib/admin-auth'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    // Auto-sync database password with .env ADMIN_PASSWORD if defined
    const envAdminPassword = process.env.ADMIN_PASSWORD
    if (envAdminPassword && username === 'admin') {
      const [existingUser] = await db
        .select()
        .from(adminUser)
        .where(eq(adminUser.username, 'admin'))
        .limit(1)

      if (existingUser) {
        const isMatch = await verifyPassword(envAdminPassword, existingUser.passwordHash)
        if (!isMatch) {
          const newHash = await hashPassword(envAdminPassword)
          await db.update(adminUser).set({ passwordHash: newHash }).where(eq(adminUser.id, existingUser.id))
          console.log('✅ Admin password updated to match .env')
        }
      } else {
        const newHash = await hashPassword(envAdminPassword)
        await db.insert(adminUser).values({
          id: 'admin_' + nanoid(9),
          username: 'admin',
          passwordHash: newHash,
        })
        console.log('✅ Admin user created matching .env password')
      }
    }

    // Find admin user
    const [user] = await db
      .select()
      .from(adminUser)
      .where(eq(adminUser.username, username))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    await setAdminSession({ adminId: user.id, username: user.username })
    return NextResponse.json({ success: true, message: 'Logged in successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Login error:', error?.message || error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
