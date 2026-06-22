'use client'

import { MapPin } from 'lucide-react'

interface PopularRoute {
  id: string
  category: string
  label: string
  slug?: string
  displayOrder: number
  isActive: boolean
}

const CATEGORY_TITLES: Record<string, string> = {
  'from-(Aurangabad)': 'From (Aurangabad)',
  'outstation': 'Outstation / Round Trip',
  'one-way': 'One-Way Routes',
}

const staticRoutes: PopularRoute[] = [
  // From (Aurangabad)
  { id: 'route-corp-aur', category: 'from-(Aurangabad)', label: 'Corporate Taxi Service in (Aurangabad)', slug: 'corporate-taxi-service-(Aurangabad)', displayOrder: 0, isActive: true },
  { id: 'route-oneway-aur', category: 'from-(Aurangabad)', label: 'One-way Taxi Services in (Aurangabad)', slug: 'one-way-taxi-services-(Aurangabad)', displayOrder: 1, isActive: true },
  { id: 'route-local-aur', category: 'from-(Aurangabad)', label: 'Best Local Taxi Service in (Aurangabad)', slug: 'local-taxi-service-in-(Aurangabad)', displayOrder: 2, isActive: true },
  { id: 'route-taxi-aur', category: 'from-(Aurangabad)', label: 'Taxi Service in (Aurangabad)', slug: 'taxi-service-in-(Aurangabad)', displayOrder: 3, isActive: true },
  { id: 'route-out-aur', category: 'from-(Aurangabad)', label: 'Outstation Cab Service in (Aurangabad)', slug: 'outstation-cab-service-(Aurangabad)', displayOrder: 4, isActive: true },
  { id: 'route-ap-aur', category: 'from-(Aurangabad)', label: '(Aurangabad) Airport Taxi Service', slug: 'airport-taxi-service-(Aurangabad)', displayOrder: 5, isActive: true },
  { id: 'route-jyot-aur', category: 'from-(Aurangabad)', label: 'Jyotirlinga Tour Package from (Aurangabad)', slug: 'jyotirlinga-tour-package-from-(Aurangabad)', displayOrder: 6, isActive: true },
  { id: 'route-ashta-aur', category: 'from-(Aurangabad)', label: '(Aurangabad) to Ashtavinayak Taxi Service', slug: '(Aurangabad)-to-ashtavinayak-taxi-service', displayOrder: 7, isActive: true },

  // Outstation
  { id: 'route-pune-taxi', category: 'outstation', label: 'Taxi Service in Pune', slug: 'taxi-service-in-pune', displayOrder: 0, isActive: true },
  { id: 'route-pune-ap', category: 'outstation', label: 'Pune Airport Cab Service', slug: 'pune-airport-cab-service', displayOrder: 1, isActive: true },
  { id: 'route-pune-oneway', category: 'outstation', label: 'One Way Taxi Service in Pune', slug: 'one-way-cab-in-pune', displayOrder: 2, isActive: true },
  { id: 'route-mumbai-taxi', category: 'outstation', label: 'Mumbai Taxi Service', slug: 'taxi-service-in-mumbai', displayOrder: 3, isActive: true },
  { id: 'route-mumbai-local', category: 'outstation', label: 'Local Taxi Service in Mumbai', slug: 'mumbai-local-taxi', displayOrder: 4, isActive: true },
  { id: 'route-mumbai-oneway', category: 'outstation', label: 'One Way Cab Service in Mumbai', slug: 'one-way-cab-mumbai', displayOrder: 5, isActive: true },
  { id: 'route-mumbai-out', category: 'outstation', label: 'Outstation Taxi Service in Mumbai', slug: 'mumbai-outstation-taxi', displayOrder: 6, isActive: true },
  { id: 'route-mumbai-corp', category: 'outstation', label: 'Corporate Taxi Service in Mumbai', slug: 'mumbai-corporate-taxi', displayOrder: 7, isActive: true },
  { id: 'route-mumbai-ap', category: 'outstation', label: 'Mumbai Airport Taxi Service', slug: 'mumbai-airport-taxi', displayOrder: 8, isActive: true },
  { id: 'route-navi-ap', category: 'outstation', label: 'Navi Mumbai Airport Cab', slug: 'navi-mumbai-airport-cab-service', displayOrder: 9, isActive: true },
  { id: 'route-mumbai-ashta', category: 'outstation', label: 'Mumbai to Ashtavinayak Cab Service', slug: 'mumbai-to-ashtavinayak-cab', displayOrder: 10, isActive: true },
  { id: 'route-mumbai-imagica', category: 'outstation', label: 'Mumbai to Imagica Cab Service', slug: 'mumbai-to-imagica-cab', displayOrder: 11, isActive: true },

  // One-Way
  { id: 'route-aur-pune', category: 'one-way', label: '(Aurangabad) to Pune Cab Service', slug: '(Aurangabad)-to-pune-cab', displayOrder: 0, isActive: true },
  { id: 'route-aur-shirdi', category: 'one-way', label: '(Aurangabad) to Shirdi Cab', slug: '(Aurangabad)-to-shirdi-cab', displayOrder: 1, isActive: true },
  { id: 'route-aur-ellora', category: 'one-way', label: '(Aurangabad) to Ellora Cab Service', slug: '(Aurangabad)-to-ellora-cab', displayOrder: 2, isActive: true },
  { id: 'route-aur-ajanta', category: 'one-way', label: '(Aurangabad) to Ajanta Cab', slug: '(Aurangabad)-to-ajanta-cab', displayOrder: 3, isActive: true },
  { id: 'route-aur-mumbai', category: 'one-way', label: '(Aurangabad) to Mumbai Cab Service', slug: '(Aurangabad)-to-mumbai-cab', displayOrder: 4, isActive: true },
  { id: 'route-aur-nanded', category: 'one-way', label: '(Aurangabad) to Nanded Cab Service', slug: '(Aurangabad)-to-nanded-cab', displayOrder: 5, isActive: true },
  { id: 'route-aur-nashik', category: 'one-way', label: '(Aurangabad) to Nashik Taxi Service', slug: '(Aurangabad)-to-nashik-cab', displayOrder: 6, isActive: true },
  { id: 'route-aur-kolhapur', category: 'one-way', label: '(Aurangabad) to Kolhapur Cab on Rent', slug: '(Aurangabad)-to-kolhapur-cab', displayOrder: 7, isActive: true },
  { id: 'route-pune-mumbai', category: 'one-way', label: 'Pune to Mumbai Taxi Service', slug: 'pune-to-mumbai-taxi-service', displayOrder: 8, isActive: true },
  { id: 'route-pune-shirdi', category: 'one-way', label: 'Pune to Shirdi Cab Service', slug: 'pune-to-shirdi-cab', displayOrder: 9, isActive: true },
  { id: 'route-pune-nashik', category: 'one-way', label: 'Pune to Nashik Cab', slug: 'pune-to-nashik-taxi-service', displayOrder: 10, isActive: true },
  { id: 'route-aur-nagpur', category: 'one-way', label: '(Aurangabad) to Nagpur Taxi Service', slug: '(Aurangabad)-to-nagpur-taxi-service', displayOrder: 11, isActive: true },
  { id: 'route-pune-goa', category: 'one-way', label: 'Pune to Goa Taxi Service', slug: 'pune-to-goa-taxi-service', displayOrder: 12, isActive: true },
  { id: 'route-aur-kalyan', category: 'one-way', label: '(Aurangabad) to Kalyan Taxi Service', slug: '(Aurangabad)-to-kalyan-taxi-service', displayOrder: 13, isActive: true },
  { id: 'route-pune-aur', category: 'one-way', label: 'Pune to (Aurangabad) Taxi Service', slug: 'pune-to-(Aurangabad)-taxi', displayOrder: 14, isActive: true },
]

export function RoutesSection() {
  const routes = staticRoutes.filter((r: PopularRoute) => r.isActive)

  // Group routes by category
  const groupedRoutes: Record<string, PopularRoute[]> = {}
  routes.forEach((route) => {
    if (!groupedRoutes[route.category]) {
      groupedRoutes[route.category] = []
    }
    groupedRoutes[route.category].push(route)
  })

  return (
    <section id="routes" className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Popular Routes
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Explore our most frequently traveled routes and book your journey today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(CATEGORY_TITLES).map(([categoryKey, categoryTitle]) => {
            const categoryRoutes = groupedRoutes[categoryKey] || []

            return (
              <div key={categoryKey} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-primary mb-6">{categoryTitle}</h3>

                <div className="space-y-3">
                  {categoryRoutes.length > 0 ? (
                    categoryRoutes.map((route) => (
                      <div
                        key={route.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors group cursor-pointer"
                      >
                        <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                            {route.label}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-muted italic">No routes available</p>
                  )}
                </div>

                <button className="w-full mt-6 px-4 py-2 bg-accent text-primary font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm dark:bg-secondary dark:text-white dark:hover:bg-secondary/80">
                  Book Route
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
