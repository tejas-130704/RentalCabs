import { db } from './index'
import { adminUser, fareRate, fleetCar, popularRoute } from './schema'
import bcryptjs from 'bcryptjs'
import { nanoid } from 'nanoid'

const ADMIN_USERNAME = process.env.ADMIN_DEFAULT_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'

async function main() {
  console.log('🌱 Seeding Drizzle database on Neon...')

  // Create admin user
  const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10)
  try {
    const existing = await db
      .select()
      .from(adminUser)
      .limit(1)

    if (existing.length === 0) {
      await db.insert(adminUser).values({
        id: 'admin_' + nanoid(9),
        username: ADMIN_USERNAME,
        passwordHash: hashedPassword,
      })
      console.log('✅ Admin user created')
    } else {
      console.log('ℹ️  Admin user already exists')
    }
  } catch (error) {
    console.error('Error creating admin user:', error)
  }

  // Seed fare rates
  const fareData = [
    {
      id: nanoid(),
      carType: 'Hatchback',
      capacity: '4+1',
      ratePerKm: '12',
      driverAllowance: 250,
      displayOrder: 0,
      isActive: true,
    },
    {
      id: nanoid(),
      carType: 'Sedan',
      capacity: '4+1',
      ratePerKm: '15',
      driverAllowance: 300,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: nanoid(),
      carType: 'SUV',
      capacity: '6+1',
      ratePerKm: '18',
      driverAllowance: 350,
      displayOrder: 2,
      isActive: true,
    },
    {
      id: nanoid(),
      carType: 'Innova Crysta',
      capacity: '6+1',
      ratePerKm: '20',
      driverAllowance: 400,
      displayOrder: 3,
      isActive: true,
    },
    {
      id: nanoid(),
      carType: 'Tempo Traveller',
      capacity: '13 Seater',
      ratePerKm: '25',
      driverAllowance: 500,
      displayOrder: 4,
      isActive: true,
    },
  ]

  for (const fare of fareData) {
    try {
      await db.insert(fareRate).values(fare).onConflictDoNothing()
    } catch (error) {
      console.error(`Error seeding fare rate ${fare.carType}:`, error)
    }
  }
  console.log('✅ Fare rates seeded')

  // Seed fleet cars
  const fleetData = [
    {
      id: nanoid(),
      name: 'Hatchback',
      capacity: '4+1',
      ratePerKm: '12',
      imageUrl: '/cars/hatchback.jpg',
      rating: '4.8',
      reviewCount: 250,
      displayOrder: 0,
      isActive: true,
    },
    {
      id: nanoid(),
      name: 'Sedan',
      capacity: '4+1',
      ratePerKm: '15',
      imageUrl: '/cars/sedan.jpg',
      rating: '4.9',
      reviewCount: 380,
      displayOrder: 1,
      isActive: true,
    },
    {
      id: nanoid(),
      name: 'SUV Compact',
      capacity: '6+1',
      ratePerKm: '18',
      imageUrl: '/cars/suv.jpg',
      rating: '4.7',
      reviewCount: 420,
      displayOrder: 2,
      isActive: true,
    },
    {
      id: nanoid(),
      name: 'Innova Crysta',
      capacity: '6+1',
      ratePerKm: '20',
      imageUrl: '/cars/innova.jpg',
      rating: '4.9',
      reviewCount: 1200,
      displayOrder: 3,
      isActive: true,
    },
    {
      id: nanoid(),
      name: 'Tempo Traveller',
      capacity: '13 Seater',
      ratePerKm: '25',
      imageUrl: '/cars/tempo.jpg',
      rating: '4.6',
      reviewCount: 580,
      displayOrder: 4,
      isActive: true,
    },
  ]

  for (const car of fleetData) {
    try {
      await db.insert(fleetCar).values(car).onConflictDoNothing()
    } catch (error) {
      console.error(`Error seeding fleet car ${car.name}:`, error)
    }
  }
  console.log('✅ Fleet cars seeded')

  // Seed popular routes
  const routeData = [
    { id: nanoid(), category: 'from-(Aurangabad)', label: '(Aurangabad) to Pune Cab Service', slug: 'arangabad-pune', displayOrder: 0, isActive: true },
    { id: nanoid(), category: 'from-(Aurangabad)', label: '(Aurangabad) to Nasik Cab', slug: '(Aurangabad)-nasik', displayOrder: 1, isActive: true },
    { id: nanoid(), category: 'from-(Aurangabad)', label: '(Aurangabad) to Indore Taxi', slug: '(Aurangabad)-indore', displayOrder: 2, isActive: true },
    { id: nanoid(), category: 'outstation', label: 'Pune to (Aurangabad) Round Trip', slug: 'pune-(Aurangabad)-roundtrip', displayOrder: 0, isActive: true },
    { id: nanoid(), category: 'outstation', label: 'Mumbai to (Aurangabad) Round Trip', slug: 'mumbai-(Aurangabad)-roundtrip', displayOrder: 1, isActive: true },
    { id: nanoid(), category: 'outstation', label: 'Nashik to (Aurangabad) Round Trip', slug: 'nashik-(Aurangabad)-roundtrip', displayOrder: 2, isActive: true },
    { id: nanoid(), category: 'one-way', label: 'One-Way Cab From (Aurangabad)', slug: 'oneway-from-(Aurangabad)', displayOrder: 0, isActive: true },
    { id: nanoid(), category: 'one-way', label: 'One-Way Cab To (Aurangabad)', slug: 'oneway-to-(Aurangabad)', displayOrder: 1, isActive: true },
    { id: nanoid(), category: 'one-way', label: 'One-Way Airport Transfer', slug: 'oneway-airport-transfer', displayOrder: 2, isActive: true },
  ]

  for (const route of routeData) {
    try {
      await db.insert(popularRoute).values(route).onConflictDoNothing()
    } catch (error) {
      console.error(`Error seeding route ${route.label}:`, error)
    }
  }
  console.log('✅ Popular routes seeded')

  console.log('✅ Database seeded successfully!')
}

main().catch(console.error)
