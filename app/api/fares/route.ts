import { NextResponse } from 'next/server'
import { getFareRates } from '@/lib/fare-db'

export async function GET() {
  try {
    const fares = await getFareRates()
    const activeFares = fares.filter((f) => f.isActive === 1 || f.isActive === true)
    return NextResponse.json(activeFares)
  } catch (error: any) {
    console.error('Fetch fares error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
