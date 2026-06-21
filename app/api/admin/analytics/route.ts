import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cabBooking } from '@/lib/db/schema'
import { getAdminSession } from '@/lib/admin-auth'
import { eq, gte, inArray, count, sum, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const last7Start = new Date(todayStart)
    last7Start.setDate(last7Start.getDate() - 6)

    const [
      [{ todayCount }],
      [{ pendingCount }],
      [{ confirmedThisWeek }],
      [{ completedCount }],
      [{ cancelledCount }],
      [{ totalCount }],
      [revenueRow],
      recentBookings,
      last7Raw,
    ] = await Promise.all([
      db.select({ todayCount: count() }).from(cabBooking).where(gte(cabBooking.createdAt, todayStart)),
      db.select({ pendingCount: count() }).from(cabBooking).where(eq(cabBooking.status, 'pending')),
      db.select({ confirmedThisWeek: count() }).from(cabBooking).where(eq(cabBooking.status, 'confirmed')),
      db.select({ completedCount: count() }).from(cabBooking).where(eq(cabBooking.status, 'completed')),
      db.select({ cancelledCount: count() }).from(cabBooking).where(eq(cabBooking.status, 'cancelled')),
      db.select({ totalCount: count() }).from(cabBooking),
      db.select({ total: sum(cabBooking.estimatedFare) }).from(cabBooking).where(
        inArray(cabBooking.status, ['confirmed', 'completed'])
      ),
      db
        .select({
          id: cabBooking.id,
          passengerName: cabBooking.passengerName,
          mobileNumber: cabBooking.mobileNumber,
          fromCity: cabBooking.fromCity,
          toCity: cabBooking.toCity,
          carType: cabBooking.carType,
          status: cabBooking.status,
          createdAt: cabBooking.createdAt,
          estimatedFare: cabBooking.estimatedFare,
        })
        .from(cabBooking)
        .orderBy(desc(cabBooking.createdAt))
        .limit(5),
      // Fetch all bookings in last 7 days, group by date in JS (avoids 7 DB round-trips)
      db.select({ createdAt: cabBooking.createdAt }).from(cabBooking).where(gte(cabBooking.createdAt, last7Start)),
    ])

    // Build day-by-day chart from in-memory grouping
    const dayMap: Record<string, number> = {}
    for (const row of last7Raw) {
      const label = new Date(row.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
      dayMap[label] = (dayMap[label] || 0) + 1
    }
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date(todayStart)
      day.setDate(day.getDate() - i)
      const label = day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
      last7Days.push({ date: label, count: dayMap[label] || 0 })
    }

    return NextResponse.json({
      todayCount,
      pendayCount: pendingCount,
      confirmedThisWeek,
      completedCount,
      cancelledCount,
      totalCount,
      totalRevenue: parseFloat(revenueRow?.total ?? '0'),
      last7Days,
      statusBreakdown: [
        { status: 'pending', count: pendingCount },
        { status: 'confirmed', count: confirmedThisWeek },
        { status: 'completed', count: completedCount },
        { status: 'cancelled', count: cancelledCount },
      ],
      recentBookings,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
