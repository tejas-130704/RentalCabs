import { NextRequest, NextResponse } from 'next/server'
import { clearAdminSession } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    await clearAdminSession()
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
