import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Cab Booking in Aurangabad | Taxi Service in Chh. Sambhajinagar | Tour & Travel',
  description: 'Book the best taxi & cab booking service in Chh. Sambhajinagar (Aurangabad), Maharashtra. Reliable car rentals for outstation trips, local sightseeing, and airport transfers. Available 24/7 with professional drivers and cheap rates.',
  keywords: 'cab booking aurangabad, taxi service in chh sambhajinagar, car rental aurangabad, outstation cabs aurangabad, pune to aurangabad taxi, mumbai to aurangabad cab, aurangabad to pune cab booking, best taxi service maharashtra, cidco aurangabad cab, cheap cab aurangabad',
  generator: 'v0.app',
  openGraph: {
    title: 'Cab Booking in Aurangabad | Taxi Service in Chh. Sambhajinagar',
    description: 'Book the best taxi & cab booking service in Chh. Sambhajinagar (Aurangabad), Maharashtra. Reliable outstation cabs, local city rides, and airport transfers available 24/7.',
    type: 'website',
    images: [{ url: '/logo-new.png' }],
  },
  icons: {
    icon: '/logo-new.png',
    apple: '/logo-new.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} bg-background`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })()
            `
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TaxiService",
              "name": "Chh. Sambhajinagar (Aurangabad) Tour & Travel",
              "description": "Premium cab booking and taxi service in Chh. Sambhajinagar (Aurangabad), Maharashtra. Reliable car rentals for local, airport transfer, and outstation trips.",
              "url": "https://cab-booking-app.vercel.app", 
              "telephone": "+917774887006",
              "provider": {
                "@type": "LocalBusiness",
                "name": "Chh. Sambhajinagar (Aurangabad) Tour & Travel",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "CM/5, Thakre Nagar, Maha Laxmi Chowk, N-2, Cidco",
                  "addressLocality": "Aurangabad",
                  "addressRegion": "Maharashtra",
                  "postalCode": "431001",
                  "addressCountry": "IN"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "19.8762",
                  "longitude": "75.3433"
                },
                "image": "https://cab-booking-app.vercel.app/logo-new.png",
                "priceRange": "₹"
              },
              "areaServed": [
                {
                  "@type": "AdministrativeArea",
                  "name": "Chh. Sambhajinagar (Aurangabad)"
                },
                {
                  "@type": "AdministrativeArea",
                  "name": "Maharashtra"
                }
              ]
            })
          }}
        />
      </body>
    </html>
  )
}
