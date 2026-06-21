import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { nanoid } from 'nanoid'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search') || ''
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'))
    const skip = (page - 1) * limit

    // Build Prisma where clause
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (search) {
      where.OR = [
        { passengerName: { contains: search } },
        { mobileNumber: { contains: search } },
        { fromCity: { contains: search } },
        { toCity: { contains: search } },
        { email: { contains: search } },
      ]
    }

    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(new Date(to).setHours(23, 59, 59, 999))
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ])

    return NextResponse.json({
      bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Bookings fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      tripType,
      journeyType,
      fromCity,
      toCity,
      journeyDate,
      journeyTime,
      returnDate,
      carType,
      passengerName,
      mobileNumber,
      alternatePhone,
      email,
      estimatedFare,
      status,
      adminNotes,
    } = body

    if (!passengerName || !mobileNumber || !fromCity || !toCity) {
      return NextResponse.json(
        { error: 'Missing required fields: passengerName, mobileNumber, fromCity, toCity' },
        { status: 400 }
      )
    }

    const journeyDateTime = journeyDate && journeyTime
      ? new Date(`${journeyDate}T${journeyTime}:00`)
      : journeyDate
        ? new Date(`${journeyDate}T00:00:00`)
        : new Date()

    const booking = await prisma.booking.create({
      data: {
        id: nanoid(10),
        tripType: tripType || 'outstation',
        journeyType: journeyType || 'one-way',
        fromCity,
        toCity,
        journeyDate: journeyDateTime,
        journeyTime: journeyTime || '00:00',
        returnDate: returnDate ? new Date(`${returnDate}T00:00:00`) : null,
        carType: carType || 'Sedan',
        passengerName,
        mobileNumber,
        alternatePhone: alternatePhone || null,
        email: email || null,
        estimatedFare: estimatedFare ? parseFloat(estimatedFare) : null,
        status: status || 'pending',
        adminNotes: adminNotes || null,
      },
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Create booking error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
