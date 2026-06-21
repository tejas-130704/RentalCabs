'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { bookings, vehicles } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
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
  const userId = await getUserId()
  
  const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  await db.insert(bookings).values({
    id: bookingId,
    userId,
    vehicleId: data.vehicleId,
    pickupLocation: data.pickupLocation,
    dropoffLocation: data.dropoffLocation,
    pickupTime: data.pickupTime,
    distance: data.distance ? data.distance.toString() : null,
    fare: data.fare ? data.fare.toString() : null,
    passengerName: data.passengerName,
    passengerPhone: data.passengerPhone,
    notes: data.notes,
    status: 'pending',
  })
  
  revalidatePath('/bookings')
  return { success: true, bookingId }
}

export async function getMyBookings() {
  const userId = await getUserId()
  return db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt))
}

export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
) {
  const userId = await getUserId()
  
  await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)))
  
  revalidatePath('/bookings')
  return { success: true }
}

export async function cancelBooking(bookingId: string) {
  const userId = await getUserId()
  
  await db
    .update(bookings)
    .set({ status: 'cancelled', updatedAt: new Date() })
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)))
  
  revalidatePath('/bookings')
  return { success: true }
}
