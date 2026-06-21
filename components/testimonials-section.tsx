import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Business Executive',
      rating: 5,
      text: 'This cab service has been my go-to choice for airport transfers. Always on time, professional drivers, and clean vehicles. Highly recommended!',
    },
    {
      name: 'Priya Singh',
      role: 'Student',
      rating: 5,
      text: 'Great service! The app is easy to use and drivers are courteous. Perfect for college commute. Love the safety features!',
    },
    {
      name: 'Amit Patel',
      role: 'Software Engineer',
      rating: 5,
      text: 'Reliable and affordable. I use this service daily for my commute. Never disappointed with the service quality.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Consultant',
      rating: 5,
      text: 'Best ride service in the city! Great customer support and the drivers know the routes well. Worth every penny!',
    },
  ]

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of happy customers who trust Chh. Sambhajinagar (Aurangabad) Tour & Travel for their transportation needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="bg-background border border-border rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {getInitials(testimonial.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                {testimonial.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
