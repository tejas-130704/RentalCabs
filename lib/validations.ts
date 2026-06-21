import { z } from 'zod'

export const BookingFormSchema = z.object({
  tripType: z.enum(['outstation', 'local']),
  journeyType: z.enum(['one-way', 'round-trip']),
  fromCity: z.string().min(2, 'From city is required'),
  toCity: z.string().min(2, 'To city is required'),
  journeyDate: z.string().min(1, 'Journey date is required'),
  journeyTime: z.string().min(1, 'Journey time is required'),
  returnDate: z.string().optional(),
  carType: z.string().min(1, 'Car type is required'),
  passengerName: z.string().min(2, 'Name must be at least 2 characters'),
  mobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
  alternatePhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
})

export type BookingFormInput = z.infer<typeof BookingFormSchema>
