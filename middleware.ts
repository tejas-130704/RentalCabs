import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'

const COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE_NAME || 'admin_session'
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'your-secret-key-change-in-production'

async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jose.jwtVerify(token, secret)
    return true
  } catch (error) {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Allow API login/logout routes
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next()
  }

  // Only protect admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value
    const isValid = token ? await verifyToken(token) : false

    const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/'

    if (isLoginPage) {
      if (isValid) {
        // If already logged in, redirect to dashboard
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      // If not logged in, allow viewing login page
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      })
    }

    // For other admin routes, redirect if not logged in
    if (!isValid) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
