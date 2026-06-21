import { pgTable, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- Admin table -------------------------------------------------------------

export const adminUser = pgTable('admin_user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- Cab Booking (main booking form) ----------------------------------------

export const cabBooking = pgTable('cab_booking', {
  id: text('id').primaryKey(),
  tripType: text('tripType').notNull().default('outstation'),
  journeyType: text('journeyType').notNull().default('one-way'),
  fromCity: text('fromCity').notNull(),
  toCity: text('toCity').notNull(),
  journeyDate: timestamp('journeyDate').notNull(),
  journeyTime: text('journeyTime').notNull(),
  returnDate: timestamp('returnDate'),
  carType: text('carType').notNull(),
  passengerName: text('passengerName').notNull(),
  mobileNumber: text('mobileNumber').notNull(),
  alternatePhone: text('alternatePhone'),
  email: text('email'),
  estimatedFare: real('estimatedFare'),
  status: text('status').notNull().default('pending'),
  adminNotes: text('adminNotes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Fare Rates --------------------------------------------------------------

export const fareRate = pgTable('fare_rate', {
  id: text('id').primaryKey(),
  carType: text('carType').notNull().unique(),
  capacity: text('capacity').notNull(),
  ratePerKm: text('ratePerKm'),
  rateNonAc: text('rateNonAc'),
  rateAc: text('rateAc'),
  driverAllowance: integer('driverAllowance').notNull().default(300),
  displayOrder: integer('displayOrder').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Fleet Cars --------------------------------------------------------------

export const fleetCar = pgTable('fleet_car', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  capacity: text('capacity').notNull(),
  ratePerKm: text('ratePerKm').notNull(),
  imageUrl: text('imageUrl').notNull(),
  rating: text('rating').notNull().default('4.5'),
  reviewCount: integer('reviewCount').notNull().default(0),
  displayOrder: integer('displayOrder').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Popular Routes ----------------------------------------------------------

export const popularRoute = pgTable('popular_route', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  label: text('label').notNull(),
  slug: text('slug'),
  displayOrder: integer('displayOrder').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- Contact Messages --------------------------------------------------------

export const contactMessage = pgTable('contact_message', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  whatsapp: text('whatsapp').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// --- Visitor Tracking --------------------------------------------------------

export const visitorLog = pgTable('visitor_log', {
  id: text('id').primaryKey(),
  ipHash: text('ip_hash').notNull(),
  userAgent: text('user_agent'),
  visitedAt: timestamp('visited_at').notNull().defaultNow(),
})

