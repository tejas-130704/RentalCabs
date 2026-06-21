import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { getFareRates, saveFareRates } from '@/lib/fare-db'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const fares = await getFareRates()
    return NextResponse.json(fares)
  } catch (error: any) {
    console.error('Admin fetch fares error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { fares } = await request.json()
    if (!Array.isArray(fares)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    await saveFareRates(fares)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin save fares error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
