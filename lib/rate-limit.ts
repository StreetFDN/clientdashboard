import { NextRequest, NextResponse } from 'next/server'

/**
 * Rate limiting configuration
 * 
 * This implements rate limiting to prevent brute force attacks.
 * Uses in-memory storage (for production, consider Redis)
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitOptions {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

/**
 * Rate limit middleware
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param options - Rate limit options
 * @returns Object with allowed status and remaining requests
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number; reset: number } {
  const now = Date.now()
  const key = identifier

  // Get or create rate limit entry
  const record = store[key] || { count: 0, resetTime: now + options.interval }

  // Reset if time window has passed
  if (now > record.resetTime) {
    record.count = 0
    record.resetTime = now + options.interval
  }

  // Check if limit exceeded
  if (record.count >= options.uniqueTokenPerInterval) {
    store[key] = record
    return {
      allowed: false,
      remaining: 0,
      reset: record.resetTime,
    }
  }

  // Increment count
  record.count++
  store[key] = record

  return {
    allowed: true,
    remaining: options.uniqueTokenPerInterval - record.count,
    reset: record.resetTime,
  }
}

/**
 * Get client IP address from request
 */
export function getClientIP(request: NextRequest): string {
  // Check various headers for IP (in order of preference)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIP) {
    return realIP
  }
  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fallback (shouldn't happen in production with proper proxy)
  return 'unknown'
}

/**
 * Rate limit middleware for Next.js API routes
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions
) {
  return async (req: NextRequest) => {
    const ip = getClientIP(req)
    const limit = rateLimit(ip, options)

    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((limit.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((limit.reset - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': options.uniqueTokenPerInterval.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limit.reset.toString(),
          },
        }
      )
    }

    // Add rate limit headers to response
    const response = await handler(req)
    response.headers.set('X-RateLimit-Limit', options.uniqueTokenPerInterval.toString())
    response.headers.set('X-RateLimit-Remaining', limit.remaining.toString())
    response.headers.set('X-RateLimit-Reset', limit.reset.toString())

    return response
  }
}

// Pre-configured rate limiters for common use cases
export const loginRateLimit = {
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 login attempts per 15 minutes
}

export const apiRateLimit = {
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 60, // 60 requests per minute
}

export const passwordResetRateLimit = {
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 3, // 3 password reset requests per hour
}

