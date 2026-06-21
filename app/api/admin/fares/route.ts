import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fareRate } from '@/lib/db/schema'
import { eq, inArray, asc } from 'drizzle-orm'
import { getAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const fares = await db
      .select()
      .from(fareRate)
      .orderBy(asc(fareRate.displayOrder))
    
    return NextResponse.json(fares)
  } catch (error) {
    console.error('Error fetching admin fares:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    const incomingFares = await request.json()

    if (!Array.isArray(incomingFares)) {
      return new NextResponse('Invalid payload format. Expected an array.', { status: 400 })
    }

    // Basic validation
    for (const fare of incomingFares) {
      if (!fare.id || !fare.carType || !fare.capacity) {
        return new NextResponse('Each fare item must have id, carType, and capacity.', { status: 400 })
      }
    }

    // Get existing fares from DB
    const existingFares = await db.select().from(fareRate)
    const existingIds = existingFares.map((f) => f.id)
    const incomingIds = incomingFares.map((f) => f.id)

    // 1. Process inserts & updates sequentially on db
    for (const fare of incomingFares) {
      const isExisting = existingIds.includes(fare.id)

      const values = {
        carType: fare.carType,
        capacity: fare.capacity,
        ratePerKm: fare.ratePerKm ? String(fare.ratePerKm) : null,
        rateNonAc: fare.rateNonAc ? String(fare.rateNonAc) : null,
        rateAc: fare.rateAc ? String(fare.rateAc) : null,
        driverAllowance: fare.driverAllowance !== undefined && fare.driverAllowance !== null && !isNaN(Number(fare.driverAllowance))
          ? Number(fare.driverAllowance) 
          : 300,
        displayOrder: fare.displayOrder !== undefined && fare.displayOrder !== null && !isNaN(Number(fare.displayOrder))
          ? Number(fare.displayOrder) 
          : 0,
        isActive: fare.isActive !== undefined ? Boolean(fare.isActive) : true,
        updatedAt: new Date(),
      }

      if (isExisting) {
        await db
          .update(fareRate)
          .set(values)
          .where(eq(fareRate.id, fare.id))
      } else {
        await db
          .insert(fareRate)
          .values({
            id: fare.id,
            ...values,
          })
      }
    }

    // 2. Process deletions on db
    const idsToDelete = existingIds.filter((id) => !incomingIds.includes(id))
    if (idsToDelete.length > 0) {
      await db
        .delete(fareRate)
        .where(inArray(fareRate.id, idsToDelete))
    }


    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving admin fares:', error)
    if (error.code === '23505' || error.message?.includes('unique constraint')) {
      return new NextResponse('Car Type must be unique. A car type with this name already exists.', { status: 400 })
    }
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
