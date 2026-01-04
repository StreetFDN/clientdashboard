import { createServerClient } from '@supabase/ssr'
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware for route protection
 * 
 * Checks if user is authenticated using Supabase.
 * Protects routes that require authentication.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If no user and trying to access protected route, redirect to sign in
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/signin"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  return response
}

// Protect these routes - users must be authenticated
export const config = {
  matcher: [
    // Temporarily disabled for design/testing purposes
    // "/dashboard/:path*",
    "/account/:path*",
    // Add other protected routes here
  ],
}
