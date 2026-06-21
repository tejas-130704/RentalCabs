'use client'

import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface FareItem {
  id: string
  carType: string
  capacity: string
  ratePerKm?: string | number
  rateNonAc?: string | number
  rateAc?: string | number
  driverAllowance: number
  isActive: boolean
}

export default function FareChartSection() {
  const [dbFares, setDbFares] = useState<FareItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFares() {
      try {
        const res = await fetch('/api/fares', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setDbFares(data.map((f: any) => ({
            ...f,
            isActive: f.isActive === 1 || f.isActive === true
          })))
        }
      } catch (err) {
        console.error('Failed to load fares', err)
      } finally {
        setLoading(false)
      }
    }
    loadFares()
  }, [])

  const fares = dbFares

  const formatCarType = (carType: string) => {
    return carType.replace(/\s+\d+$/, '')
  }

  const formatPrice = (fare: FareItem) => {
    if (fare.ratePerKm) {
      const rateStr = String(fare.ratePerKm).replace(/\.00$/, '')
      return `${rateStr} per km`
    }
    if (fare.rateNonAc && fare.rateAc) {
      const nonAcStr = String(fare.rateNonAc).replace(/\.00$/, '')
      const acStr = String(fare.rateAc).replace(/\.00$/, '')
      if (fare.capacity === '17 Seater' || fare.carType.includes('17')) {
        return `Non-A/c-${nonAcStr} A/c-${acStr}`
      }
      return `Non-A/C-${nonAcStr}, A/C-${acStr}`
    }
    return '—'
  }

  const handleBookNow = () => {
    const bookingWidget = document.getElementById('booking-widget')
    if (bookingWidget) {
      bookingWidget.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground mt-3 font-poppins">Loading cab fares...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-left mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground font-poppins">
            Cab Fare
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted text-primary border-b border-border">
                <th className="px-6 py-4 font-bold text-sm text-primary border-r border-border last:border-r-0">Type of Car</th>
                <th className="px-6 py-4 font-bold text-sm text-primary border-r border-border last:border-r-0">CAPACITY</th>
                <th className="px-6 py-4 font-bold text-sm text-primary border-r border-border last:border-r-0">PER DAY 300 km OUTSTATION PACKAGES</th>
                <th className="px-6 py-4 font-bold text-sm text-primary border-r border-border last:border-r-0">PER DAY DRIVER ALLOWANCE</th>
                <th className="px-6 py-4 font-bold text-sm text-primary last:border-r-0">BOOK</th>
              </tr>
            </thead>
            <tbody>
              {fares.map((fare, idx) => (
                <tr
                  key={fare.id}
                  className={`border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/10'
                    }`}
                >
                  <td className="px-6 py-4 text-sm text-foreground border-r border-border last:border-r-0 font-normal">{formatCarType(fare.carType)}</td>
                  <td className="px-6 py-4 text-sm text-foreground border-r border-border last:border-r-0 font-normal">{fare.capacity}</td>
                  <td className="px-6 py-4 text-sm text-foreground border-r border-border last:border-r-0 font-normal">{formatPrice(fare)}</td>
                  <td className="px-6 py-4 text-sm text-foreground border-r border-border last:border-r-0 font-normal">{fare.driverAllowance}</td>
                  <td className="px-6 py-4 text-sm border-r border-border last:border-r-0 text-center">
                    <button
                      onClick={handleBookNow}
                      className="bg-accent hover:bg-accent/95 text-accent-foreground font-bold py-2 px-6 rounded text-xs transition-all duration-300 active:scale-95 cursor-pointer"
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {fares.map((fare) => (
            <Card key={fare.id} className="p-6 border border-border shadow-sm bg-card text-card-foreground">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-primary">{formatCarType(fare.carType)}</h3>
                <span className="text-xs font-bold bg-accent/20 text-primary px-3 py-1 rounded-full">
                  {fare.capacity}
                </span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">300km Package:</span>
                  <span className="font-semibold text-foreground">{formatPrice(fare)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-muted-foreground">Driver Allowance:</span>
                  <span className="font-semibold text-foreground">{fare.driverAllowance}</span>
                </div>
              </div>
              <button
                onClick={handleBookNow}
                className="w-full bg-accent hover:bg-accent/95 text-accent-foreground font-bold py-2 rounded text-sm transition-all duration-300 cursor-pointer"
              >
                Book Now
              </button>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>* Toll charges & driver meals extra. All prices are per day for outstation trips with 300km limit.</p>
        </div>
      </div>
    </section>
  )
}
