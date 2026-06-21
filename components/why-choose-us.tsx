'use client'

import { Shield, DollarSign, Clock, Globe } from 'lucide-react'

function WhyChooseUs() {
  const reasons = [
    {
      icon: Shield,
      title: 'Safe & Reliable',
      description: 'Professional, verified drivers',
    },
    {
      icon: DollarSign,
      title: 'Best Fares',
      description: 'Transparent pricing, no hidden charges',
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Round-the-clock service',
    },
    {
      icon: Globe,
      title: 'Pan India Routes',
      description: '(Aurangabad), Pune, Mumbai & beyond',
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Choose Chh. Sambhajinagar (Aurangabad) Tour & Travel?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the best cab service with professional drivers and transparent pricing
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, idx) => {
            const Icon = reason.icon
            return (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card border border-border"
              >
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
                  <Icon size={32} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2">{reason.title}</h3>
                <p className="text-muted-foreground">{reason.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { WhyChooseUs }
export default WhyChooseUs
