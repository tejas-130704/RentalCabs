import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Admin Dashboard - Chh. Sambhajinagar (Aurangabad) Tour&Travel',
  description: 'Admin panel for managing Chh. Sambhajinagar (Aurangabad) Tour&Travel bookings and operations',
  robots: 'noindex, nofollow',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  )
}
