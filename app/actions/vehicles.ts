'use server'

import { db } from '@/lib/db'
import { vehicles, routes } from '@/lib/db/schema'

export async function getVehicles() {
  return db.select().from(vehicles)
}

export async function getVehicleById(id: string) {
  const result = await db
    .select()
    .from(vehicles)
    .where((v) => v.id === id)
  return result[0] || null
}

export async function getRoutes() {
  return db.select().from(routes)
}

export async function getRouteById(id: string) {
  const result = await db
    .select()
    .from(routes)
    .where((r) => r.id === id)
  return result[0] || null
}

export async function seedVehicles() {
  const existingVehicles = await getVehicles()
  if (existingVehicles.length > 0) return

  const vehicleData = [
    {
      id: 'vehicle_sedan',
      name: 'Sedan',
      category: 'Sedan',
      capacity: 4,
      pricePerKm: '15.00',
      baseFare: '50.00',
      description: 'Comfortable sedan for city rides',
      image: '/vehicles/sedan.jpg',
    },
    {
      id: 'vehicle_suv',
      name: 'SUV',
      category: 'SUV',
      capacity: 6,
      pricePerKm: '25.00',
      baseFare: '75.00',
      description: 'Spacious SUV for families',
      image: '/vehicles/suv.jpg',
    },
    {
      id: 'vehicle_bus',
      name: 'Bus',
      category: 'Bus',
      capacity: 20,
      pricePerKm: '12.00',
      baseFare: '100.00',
      description: 'Affordable group transport',
      image: '/vehicles/bus.jpg',
    },
    {
      id: 'vehicle_tempo',
      name: 'Tempo Traveller',
      category: 'Tempo',
      capacity: 12,
      pricePerKm: '18.00',
      baseFare: '80.00',
      description: 'Comfortable group travel',
      image: '/vehicles/tempo.jpg',
    },
  ]

  for (const vehicle of vehicleData) {
    await db.insert(vehicles).values(vehicle)
  }
}

export async function seedRoutes() {
  const existingRoutes = await getRoutes()
  if (existingRoutes.length > 0) return

  const routeData = [
    {
      id: 'route_airport',
      name: 'Airport Route',
      fromLocation: 'City Center',
      toLocation: 'International Airport',
      distance: '35.00',
      estimatedTime: 60,
      description: 'Quick airport transfer service',
    },
    {
      id: 'route_station',
      name: 'Railway Station',
      fromLocation: 'Downtown',
      toLocation: 'Central Railway Station',
      distance: '12.00',
      estimatedTime: 25,
      description: 'Convenient railway station access',
    },
    {
      id: 'route_university',
      name: 'University Campus',
      fromLocation: 'City Center',
      toLocation: 'University Campus',
      distance: '18.00',
      estimatedTime: 35,
      description: 'Student transport service',
    },
    {
      id: 'route_business',
      name: 'Business District',
      fromLocation: 'Residential Area',
      toLocation: 'Business District',
      distance: '22.00',
      estimatedTime: 40,
      description: 'Corporate commute service',
    },
  ]

  for (const route of routeData) {
    await db.insert(routes).values(route)
  }
}
