import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fleetCar } from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin-auth'
import { eq } from 'drizzle-orm'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [deleted] = await db.delete(fleetCar).where(eq(fleetCar.id, id)).returning()
    if (!deleted) return NextResponse.json({ error: 'Fleet car not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Fleet delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
