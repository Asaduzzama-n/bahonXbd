import { NextRequest, NextResponse } from 'next/server'
import { AuthUtils } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }

    const payload = AuthUtils.verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  // Protected API routes
  if (pathname.startsWith('/api/admin') || 
      (pathname.startsWith('/api/bikes') && request.method !== 'GET')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = AuthUtils.verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // For admin API routes, check admin role
    if (pathname.startsWith('/api/admin') && payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/bikes/:path*',
  ],
}