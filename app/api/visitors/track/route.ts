import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { visitorLog } from '@/lib/db/schema'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Extract IP address from headers safely
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Hash IP + User-Agent to create a unique signature for this device
    const ipHash = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}`)
      .digest('hex')

    // Insert visitor record
    await db.insert(visitorLog).values({
      id: 'visit_' + nanoid(),
      ipHash,
      userAgent,
      visitedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to log visitor track:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
