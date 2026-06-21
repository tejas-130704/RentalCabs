import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cabBooking } from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin-auth'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [booking] = await db.select().from(cabBooking).where(eq(cabBooking.id, id)).limit(1)

    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    return NextResponse.json(booking)
  } catch (error) {
    console.error('Fetch booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, any> = { updatedAt: new Date() }

    if (body.status !== undefined) updateData.status = body.status
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes
    if (body.estimatedFare !== undefined)
      updateData.estimatedFare = body.estimatedFare !== '' ? parseFloat(body.estimatedFare) : null
    if (body.passengerName !== undefined) updateData.passengerName = body.passengerName
    if (body.mobileNumber !== undefined) updateData.mobileNumber = body.mobileNumber
    if (body.alternatePhone !== undefined) updateData.alternatePhone = body.alternatePhone || null
    if (body.email !== undefined) updateData.email = body.email || null
    if (body.fromCity !== undefined) updateData.fromCity = body.fromCity
    if (body.toCity !== undefined) updateData.toCity = body.toCity
    if (body.carType !== undefined) updateData.carType = body.carType
    if (body.tripType !== undefined) updateData.tripType = body.tripType
    if (body.journeyType !== undefined) updateData.journeyType = body.journeyType
    if (body.journeyTime !== undefined) updateData.journeyTime = body.journeyTime
    if (body.journeyDate !== undefined) updateData.journeyDate = new Date(body.journeyDate)
    if (body.returnDate !== undefined)
      updateData.returnDate = body.returnDate ? new Date(body.returnDate) : null

    if (Object.keys(updateData).length <= 1) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const [updated] = await db
      .update(cabBooking)
      .set(updateData)
      .where(eq(cabBooking.id, id))
      .returning()

    if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await params
    const [deleted] = await db
      .delete(cabBooking)
      .where(eq(cabBooking.id, id))
      .returning()

    if (!deleted) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Booking deleted' })
  } catch (error) {
    console.error('Delete booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
