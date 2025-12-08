/**
 * Simple in-memory rate limiter for API endpoints
 * 
 * For production, consider using Redis-based rate limiting
 * or a service like Upstash Rate Limit
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  limit: number
  /** Time window in seconds */
  windowSeconds: number
  /** Optional prefix for the key (e.g., "wizard", "auth") */
  prefix?: string
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number // seconds until reset
  limit: number
}

/**
 * Check if the request should be rate limited
 * 
 * @param identifier - Unique identifier for the client (usually IP address or user ID)
 * @param config - Rate limit configuration
 * @returns RateLimitResult indicating if the request is allowed
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const { limit, windowSeconds, prefix = "default" } = config
  const key = `${prefix}:${identifier}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  
  const entry = rateLimitStore.get(key)
  
  // If no entry or window has expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: limit - 1,
      resetIn: windowSeconds,
      limit,
    }
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetIn,
      limit,
    }
  }
  
  // Increment count
  entry.count++
  const resetIn = Math.ceil((entry.resetTime - now) / 1000)
  
  return {
    success: true,
    remaining: limit - entry.count,
    resetIn,
    limit,
  }
}

/**
 * Get IP address from request headers
 * Handles various proxy scenarios (Cloudflare, Vercel, etc.)
 */
export function getClientIP(request: Request): string {
  // Cloudflare
  const cfConnectingIp = request.headers.get("cf-connecting-ip")
  if (cfConnectingIp) return cfConnectingIp
  
  // Standard X-Forwarded-For
  const xForwardedFor = request.headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim())
    return ips[0] || "unknown"
  }
  
  // Vercel
  const xRealIp = request.headers.get("x-real-ip")
  if (xRealIp) return xRealIp
  
  return "unknown"
}

/**
 * Pre-configured rate limit configurations for common use cases
 */
export const RateLimitPresets = {
  /** Auth endpoints: 5 requests per minute */
  auth: { limit: 5, windowSeconds: 60, prefix: "auth" } as RateLimitConfig,
  
  /** Wizard endpoints: 10 requests per minute */
  wizard: { limit: 10, windowSeconds: 60, prefix: "wizard" } as RateLimitConfig,
  
  /** Public API: 30 requests per minute */
  public: { limit: 30, windowSeconds: 60, prefix: "public" } as RateLimitConfig,
  
  /** Admin API: 60 requests per minute */
  admin: { limit: 60, windowSeconds: 60, prefix: "admin" } as RateLimitConfig,
  
  /** Strict: 3 requests per minute (for sensitive operations) */
  strict: { limit: 3, windowSeconds: 60, prefix: "strict" } as RateLimitConfig,
}

/**
 * Creates rate limit headers for the response
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetIn.toString(),
  }
}
