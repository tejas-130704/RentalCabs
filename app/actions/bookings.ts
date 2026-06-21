'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { cabBooking } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function createBooking(data: {
  vehicleId: string
  pickupLocation: string
  dropoffLocation: string
  pickupTime: Date
  distance?: number
  fare?: number
  passengerName: string
  passengerPhone: string
  notes?: string
}) {
  const user = await getUserId()
  
  const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await db.insert(cabBooking).values({
    id: bookingId,
    tripType: 'outstation',
    journeyType: 'one-way',
    fromCity: data.pickupLocation,
    toCity: data.dropoffLocation,
    journeyDate: data.pickupTime,
    journeyTime: data.pickupTime.toLocaleTimeString(),
    carType: data.vehicleId,
    passengerName: data.passengerName,
    mobileNumber: data.passengerPhone,
    email: user.email,
    estimatedFare: data.fare ? data.fare : null,
    status: 'pending',
    adminNotes: data.notes || null,
  })
  
  revalidatePath('/bookings')
  return { success: true, bookingId }
}

export async function getMyBookings() {
  const user = await getUserId()
  if (!user.email) return []
  
  const results = await db
    .select()
    .from(cabBooking)
    .where(eq(cabBooking.email, user.email))
    .orderBy(desc(cabBooking.createdAt))
    
  return results.map(booking => ({
    id: booking.id,
    pickupLocation: booking.fromCity,
    dropoffLocation: booking.toCity,
    pickupTime: booking.journeyDate,
    status: booking.status,
    fare: booking.estimatedFare,
    distance: null,
    passengerName: booking.passengerName,
    passengerPhone: booking.mobileNumber,
    vehicleId: booking.carType,
  }))
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
) {
  const user = await getUserId()
  if (!user.email) throw new Error('Unauthorized')
  
  await db
    .update(cabBooking)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(cabBooking.id, bookingId), eq(cabBooking.email, user.email)))
  
  revalidatePath('/bookings')
  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const user = await getUserId()
  if (!user.email) throw new Error('Unauthorized')
  
  await db
    .update(cabBooking)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(and(eq(cabBooking.id, bookingId), eq(cabBooking.email, user.email)))
  
  revalidatePath('/bookings')
  return { success: true }
}
