'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import FloatingCTA from '@/components/floating-cta'
import { BookingWidget } from '@/components/booking-widget'
import { FleetSection } from '@/components/fleet-section'
import { RoutesSection } from '@/components/routes-section'
import { FeaturesSection } from '@/components/features-section'
import WhyChooseUs from '@/components/why-choose-us'
import FareChartSection from '@/components/fare-chart-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { ContactSection } from '@/components/contact-section'
import { useEffect } from 'react'
import { Phone, MessageCircle, MapPin } from 'lucide-react'

export default function Home() {
  useEffect(() => {
    // Prevent auth pages from showing unless user navigates there
    fetch('/api/visitors/track', { method: 'POST' }).catch((err) =>
      console.error('Error tracking visit:', err)
    )
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <FloatingCTA />

      {/* Hero Section */}
      <section className="relative pt-10 pb-32 overflow-hidden bg-background border-b border-border">
        {/* Subtle dot/diagonal pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, #1A3263 35px, #1A3263 36px)`,
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-foreground">
              <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full font-bold text-sm mb-6 font-poppins">
                Quick & Safe & Budget Cab
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight font-poppins text-foreground">
                Best Cab Booking & Taxi Service
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Affordable outstation cabs, local city rides, and airport transfers in Chh. Sambhajinagar (Aurangabad), Maharashtra — Available 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a
                  href="#booking-widget"
                  className="bg-accent hover:bg-accent/95 text-accent-foreground px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 shadow-sm"
                >
                  Book Now
                </a>

                <a
                  href="tel:+917774887006"
                  className="border-2 border-border text-foreground hover:bg-muted px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  Call Now
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-3xl font-bold text-accent font-poppins">50K+</p>
                  <p className="text-sm text-muted-foreground">Happy Riders</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent font-poppins">24/7</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-accent font-poppins">₹5</p>
                  <p className="text-sm text-muted-foreground">Min Fare</p>
                </div>
              </div>
            </div>

            {/* Right Side - Generated Hero Image */}
            <div className="relative w-full h-[320px] md:h-[550px] flex items-start justify-center">
              <img
                src="/hero-cab.png"
                alt="Chh. Sambhajinagar (Aurangabad) Tour&Travel Vehicle"
                className="w-full h-full object-contain rounded-2xl drop-shadow-xl select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <BookingWidget />
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Fleet Section */}
      <FleetSection />

      {/* Fare Chart Section */}
      <FareChartSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Routes Section */}
      <RoutesSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Banner CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
                Ready to Book Your Ride?
              </h2>
              <p className="text-lg opacity-85 mb-4">
                Quick booking, transparent pricing, and professional drivers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+917774887006"
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/95 text-accent-foreground font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                <Phone size={20} />
                Call Now
              </a>

              <a
                href="https://wa.me/917774887006?text=Hi, I want to book a cab"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA58] text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105"
              >
                <MessageCircle size={20} />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />

      <Footer />
    </div>
  )
}
