import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fareRate } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const fares = await db
      .select()
      .from(fareRate)
      .where(eq(fareRate.isActive, true))
      .orderBy(asc(fareRate.displayOrder))
    
    return NextResponse.json(fares, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
  } catch (error) {
    console.error('Error fetching fares:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
      }
    )
  }
}
