import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, hashPassword, setAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Auto-sync database password with .env ADMIN_PASSWORD if defined
    const envAdminPassword = process.env.ADMIN_PASSWORD
    if (envAdminPassword && username === 'admin') {
      const user = await prisma.admin.findUnique({
        where: { username: 'admin' },
      })
      if (user) {
        const isMatch = await verifyPassword(envAdminPassword, user.passwordHash)
        if (!isMatch) {
          const newHash = await hashPassword(envAdminPassword)
          await prisma.admin.update({
            where: { id: user.id },
            data: { passwordHash: newHash },
          })
          console.log('✅ Admin password updated to match .env')
        }
      } else {
        const newHash = await hashPassword(envAdminPassword)
        await prisma.admin.create({
          data: {
            id: 'admin_' + Math.random().toString(36).substr(2, 9),
            username: 'admin',
            passwordHash: newHash,
          }
        })
        console.log('✅ Admin user created matching .env password')
      }
    }

    // Find admin user in Prisma (SQLite)
    const user = await prisma.admin.findUnique({
      where: { username },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Set session
    await setAdminSession({
      adminId: user.id,
      username: user.username,
    })

    return NextResponse.json(
      { success: true, message: 'Logged in successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Login error:', error?.message || error)
    console.error('Stack:', error?.stack)
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

