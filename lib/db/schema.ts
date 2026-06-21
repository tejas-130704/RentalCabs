import { pgTable, text, timestamp, boolean, integer, decimal, float } from 'drizzle-orm/pg-core'

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

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// ---  Cabs App Tables ---

export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  capacity: integer('capacity').notNull(),
  pricePerKm: decimal('pricePerKm', { precision: 10, scale: 2 }).notNull(),
  baseFare: decimal('baseFare', { precision: 10, scale: 2 }).notNull(),
  image: text('image'),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  vehicleId: text('vehicleId').notNull(),
  pickupLocation: text('pickupLocation').notNull(),
  dropoffLocation: text('dropoffLocation').notNull(),
  pickupTime: timestamp('pickupTime').notNull(),
  dropoffTime: timestamp('dropoffTime'),
  distance: decimal('distance', { precision: 10, scale: 2 }),
  fare: decimal('fare', { precision: 10, scale: 2 }),
  status: text('status').notNull().default('pending'),
  passengerName: text('passengerName').notNull(),
  passengerPhone: text('passengerPhone').notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const routes = pgTable('routes', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  fromLocation: text('fromLocation').notNull(),
  toLocation: text('toLocation').notNull(),
  distance: decimal('distance', { precision: 10, scale: 2 }).notNull(),
  estimatedTime: integer('estimatedTime').notNull(),
  description: text('description'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  bookingId: text('bookingId').notNull(),
  userId: text('userId').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- Admin Panel Tables ---

export const adminUser = pgTable('admin_user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('passwordHash').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const fareRate = pgTable('fare_rate', {
  id: text('id').primaryKey(),
  carType: text('carType').notNull().unique(),
  capacity: text('capacity').notNull(),
  ratePerKm: decimal('ratePerKm', { precision: 10, scale: 2 }),
  rateNonAc: decimal('rateNonAc', { precision: 10, scale: 2 }),
  rateAc: decimal('rateAc', { precision: 10, scale: 2 }),
  driverAllowance: integer('driverAllowance').notNull().default(300),
  displayOrder: integer('displayOrder').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const fleetCar = pgTable('fleet_car', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  capacity: text('capacity').notNull(),
  ratePerKm: decimal('ratePerKm', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('imageUrl').notNull(),
  rating: decimal('rating', { precision: 3, scale: 1 }).notNull().default('5.0'),
  reviewCount: integer('reviewCount').notNull().default(0),
  displayOrder: integer('displayOrder').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const popularRoute = pgTable('popular_route', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  label: text('label').notNull(),
  slug: text('slug'),
  displayOrder: integer('displayOrder').notNull().default(0),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
