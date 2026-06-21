import { Shield, Clock, DollarSign, Users, MapPin, Zap } from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'All drivers are verified and vehicles are regularly inspected for safety.',
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Book a ride anytime, day or night. Always available for your convenience.',
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden charges. Know your fare before you book a ride.',
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Courteous, experienced drivers trained in customer service.',
    },
    {
      icon: MapPin,
      title: 'GPS Tracking',
      description: 'Real-time tracking of your ride with live location updates.',
    },
    {
      icon: Zap,
      title: 'Quick Booking',
      description: 'Book in seconds with our simple and intuitive mobile app.',
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose Chh. Sambhajinagar (Aurangabad) Tour & Travel?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience premium transportation with our commitment to safety, reliability, and customer satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div key={idx} className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition">
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
