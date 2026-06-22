'use client'

import { Button } from '@/components/ui/button'
import { Mail, Phone, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }

      toast.success('Message sent successfully!')
      setSuccessOpen(true)
      setFormData({ name: '', whatsapp: '', message: '' })
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                  <p className="text-muted-foreground">
                    <a href="tel:+917774887006" className="hover:underline">+91-7774887006</a>{/* / <a href="tel:+918421684040" className="hover:underline">+91-8421684040</a> */}
                  </p>
                  <p className="text-sm text-muted-foreground">Available 24/7 for bookings</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">
                    <a href="mailto:aurangabadtoursandtraveles@gmail.com" className="hover:underline">aurangabadtoursandtraveles@gmail.com</a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    We respond within 2 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">WhatsApp Chat</h3>
                  <p className="text-muted-foreground">
                    <a
                      href="https://wa.me/917774887006?text=Hi,%20I%20have%20a%20question%20about%20booking%20a%20cab"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline text-green-600 font-medium"
                    >
                      Chat with support team
                    </a>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Instant response on WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                  placeholder="e.g., +91 94229 80970"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Your message..."
                  rows={5}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none disabled:opacity-50"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground flex items-center justify-center gap-2 cursor-pointer dark:bg-secondary dark:text-white dark:hover:bg-secondary/80"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-sm overflow-hidden bg-card text-card-foreground border border-border rounded-2xl sm:rounded-2xl p-6 text-center">
          <DialogHeader className="text-center mb-4 space-y-1">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle size={36} className="text-green-500 animate-bounce" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-primary">
              Message Sent!
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-6">
            Thank you for reaching out. We have received your query and will contact you shortly.
          </p>
          <Button
            onClick={() => setSuccessOpen(false)}
            className="w-full bg-[#1A3263] hover:bg-[#233F78] text-white cursor-pointer"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  )
}
