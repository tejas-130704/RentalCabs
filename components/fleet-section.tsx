'use client'

import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

interface FleetCar {
  id: string
  name: string
  capacity: string
  ratePerKm: number | string
  imageUrl: string
  rating: number | string
  reviewCount: number
  isActive: boolean
}

const staticFleet: FleetCar[] = [
  {
    id: 'fleet-ertiga',
    name: 'Ertiga or similar (6+1)',
    capacity: '6+1',
    ratePerKm: '15.00',
    imageUrl: '/cabs/ertiga.png',
    rating: '5.0',
    reviewCount: 194,
    isActive: true,
  },
  {
    id: 'fleet-dzire',
    name: 'Dzire or similar (4+1)',
    capacity: '4+1',
    ratePerKm: '12.00',
    imageUrl: '/cabs/swift_dzire.png',
    rating: '5.0',
    reviewCount: 194,
    isActive: true,
  },
  {
    id: 'fleet-innova-crysta',
    name: 'INNOVA CRYSTA (6+1)',
    capacity: '6+1',
    ratePerKm: '19.00',
    imageUrl: '/cabs/innova_crysta.png',
    rating: '5.0',
    reviewCount: 194,
    isActive: true,
  },
  {
    id: 'fleet-innova-ac',
    name: 'INNOVA AC (6+1)',
    capacity: '6+1',
    ratePerKm: '16.00',
    imageUrl: '/cabs/innova_ac.png',
    rating: '5.0',
    reviewCount: 194,
    isActive: true,
  },
  {
    id: 'fleet-etios',
    name: 'Etios or similar (4+1)',
    capacity: '4+1',
    ratePerKm: '12.00',
    imageUrl: '/cabs/etios.png',
    rating: '5.0',
    reviewCount: 194,
    isActive: true,
  },
  {
    id: 'fleet-indigo',
    name: 'Indigo or Similar (4+1)',
    capacity: '4+1',
    ratePerKm: '12.00',
    imageUrl: '/cabs/indigo.png',
    rating: '5.0',
    reviewCount: 194,
    isActive: true,
  }
]

export function FleetSection() {
  const vehicles = staticFleet.filter((v: FleetCar) => v.isActive)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Our Fleet
          </h2>
          <p className="text-lg text-text-muted">
            Premium vehicles for your comfortable journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <Card
              key={vehicle.id}
              className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer"
            >
              {/* Image */}
              {vehicle.imageUrl && (
                <div className="h-48 bg-muted overflow-hidden">
                  <img
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-primary mb-2">{vehicle.name}</h3>

                {/* Capacity */}
                <p className="text-sm text-text-muted mb-4">
                  <span className="font-medium text-foreground">Capacity:</span> {vehicle.capacity}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(Number(vehicle.rating))
                            ? 'fill-accent text-accent'
                            : 'text-text-muted'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {vehicle.rating} ({vehicle.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-text-muted mb-3">
                    Starting from
                  </p>
                  <p className="text-2xl font-bold text-accent">
                    ₹{vehicle.ratePerKm}/km
                  </p>
                </div>

                {/* CTA Button */}
                <button className="w-full mt-4 bg-accent text-primary font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Book Now
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
