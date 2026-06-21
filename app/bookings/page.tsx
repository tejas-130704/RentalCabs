import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getMyBookings, cancelBooking } from '@/app/actions/bookings'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, DollarSign, X } from 'lucide-react'
import BookingsList from '@/components/bookings-list'

export default async function BookingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const bookings = await getMyBookings()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage and track your ride bookings
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No bookings yet
              </h2>
              <p className="text-muted-foreground mb-6">
                You haven&apos;t made any ride bookings. Start your journey with us today!
              </p>
              <Button
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Book a Ride
              </Button>
            </div>
          ) : (
            <BookingsList initialBookings={bookings} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
