import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Security headers for production
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const secret = process.env.NEXTAUTH_SECRET

  // Create response with security headers
  const response = NextResponse.next()
  
  // Apply security headers in production
  if (process.env.NODE_ENV === 'production') {
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  if (!secret) {
    console.error("NEXTAUTH_SECRET is not configured")
    return response
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request, secret })

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    // Check admin role
    if (token.role !== "admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  // Protect profile route
  if (pathname.startsWith("/profile")) {
    const token = await getToken({ req: request, secret })

    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Block sensitive file access
  const sensitivePatterns = [
    /\.env/,
    /\.git/,
    /prisma\/schema\.prisma/,
    /node_modules/,
  ]
  
  if (sensitivePatterns.some(pattern => pattern.test(pathname))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  return response
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ]
}
