import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    // Redirect to sign in with error message
    const signInUrl = new URL('/auth/signin', requestUrl.origin)
    signInUrl.searchParams.set('error', error)
    if (errorDescription) {
      signInUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(signInUrl)
  }

  if (!code) {
    // No code provided, redirect to sign in
    return NextResponse.redirect(new URL('/auth/signin?error=no_code', requestUrl.origin))
  }

  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    // Exchange code for session
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      
      // Handle specific errors
      if (exchangeError.message.includes('flow_state_not_found') || exchangeError.message.includes('expired')) {
        // Flow state expired - redirect to sign in with helpful message
        const signInUrl = new URL('/auth/signin', requestUrl.origin)
        signInUrl.searchParams.set('error', 'session_expired')
        signInUrl.searchParams.set('message', 'Your login session expired. Please try signing in again.')
        return NextResponse.redirect(signInUrl)
      }
      
      // Other errors - redirect to sign in
      const signInUrl = new URL('/auth/signin', requestUrl.origin)
      signInUrl.searchParams.set('error', exchangeError.message)
      return NextResponse.redirect(signInUrl)
    }

    // Success - redirect to onboarding check
    return NextResponse.redirect(new URL('/onboarding/check', requestUrl.origin))
  } catch (err) {
    console.error('Unexpected error in callback:', err)
    // Redirect to sign in on any unexpected error
    const signInUrl = new URL('/auth/signin', requestUrl.origin)
    signInUrl.searchParams.set('error', 'unexpected_error')
    return NextResponse.redirect(signInUrl)
  }
}

