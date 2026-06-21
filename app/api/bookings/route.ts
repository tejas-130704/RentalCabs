import { NextRequest, NextResponse } from 'next/server'
import { BookingFormSchema } from '@/lib/validations'
import { db } from '@/lib/db'
import { cabBooking } from '@/lib/db/schema'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = BookingFormSchema.parse(body)

    const journeyDateTime = new Date(
      validatedData.journeyDate + 'T' + validatedData.journeyTime + ':00'
    )
    const returnDateTime = validatedData.returnDate
      ? new Date(validatedData.returnDate + 'T00:00:00')
      : null

    const bookingId = nanoid(10)

    await db.insert(cabBooking).values({
      id: bookingId,
      tripType: validatedData.tripType,
      journeyType: validatedData.journeyType,
      fromCity: validatedData.fromCity,
      toCity: validatedData.toCity,
      journeyDate: journeyDateTime,
      journeyTime: validatedData.journeyTime,
      returnDate: returnDateTime,
      carType: validatedData.carType,
      passengerName: validatedData.passengerName,
      mobileNumber: validatedData.mobileNumber,
      alternatePhone: validatedData.alternatePhone || null,
      email: validatedData.email || null,
      status: 'pending',
    })

    return NextResponse.json(
      {
        success: true,
        bookingId,
        message: 'Booking confirmed! Our team will call you shortly.',
        data: {
          bookingId,
          fromCity: validatedData.fromCity,
          toCity: validatedData.toCity,
          journeyDate: validatedData.journeyDate,
          carType: validatedData.carType,
          passengerName: validatedData.passengerName,
          mobileNumber: validatedData.mobileNumber,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Booking API Error]', error)
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 })
  }
}
