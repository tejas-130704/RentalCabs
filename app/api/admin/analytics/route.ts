import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 6)

    // Run all counts in parallel
    const [
      todayCount,
      pendingCount,
      confirmedThisWeek,
      completedCount,
      cancelledCount,
      totalCount,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      // Today's bookings
      prisma.booking.count({
        where: { createdAt: { gte: todayStart } },
      }),
      // Pending bookings
      prisma.booking.count({ where: { status: 'pending' } }),
      // Confirmed this week
      prisma.booking.count({
        where: { status: 'confirmed', createdAt: { gte: weekStart } },
      }),
      // Completed total
      prisma.booking.count({ where: { status: 'completed' } }),
      // Cancelled total
      prisma.booking.count({ where: { status: 'cancelled' } }),
      // All time total
      prisma.booking.count(),
      // Total estimated revenue
      prisma.booking.aggregate({
        _sum: { estimatedFare: true },
        where: { status: { in: ['confirmed', 'completed'] } },
      }),
      // Recent 5 bookings for dashboard
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          passengerName: true,
          mobileNumber: true,
          fromCity: true,
          toCity: true,
          carType: true,
          status: true,
          createdAt: true,
          estimatedFare: true,
        },
      }),
    ])

    // Build last-7-days chart data
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const day = new Date(todayStart)
      day.setDate(day.getDate() - i)
      const nextDay = new Date(day)
      nextDay.setDate(nextDay.getDate() + 1)

      const count = await prisma.booking.count({
        where: {
          createdAt: { gte: day, lt: nextDay },
        },
      })

      last7Days.push({
        date: day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        count,
      })
    }

    // Status breakdown
    const statusBreakdown = [
      { status: 'pending', count: pendingCount },
      { status: 'confirmed', count: confirmedThisWeek },
      { status: 'completed', count: completedCount },
      { status: 'cancelled', count: cancelledCount },
    ]

    return NextResponse.json({
      todayCount,
      pendayCount: pendingCount,
      confirmedThisWeek,
      completedCount,
      cancelledCount,
      totalCount,
      totalRevenue: revenueResult._sum.estimatedFare || 0,
      last7Days,
      statusBreakdown,
      recentBookings,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
