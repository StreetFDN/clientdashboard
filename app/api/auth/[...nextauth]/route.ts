/**
 * Authentication API Routes
 * 
 * Note: With Supabase, authentication is handled directly through
 * the Supabase client. This file can be removed or used for
 * custom authentication endpoints if needed.
 * 
 * Use Supabase Auth directly in your components:
 * - Sign up: supabase.auth.signUp()
 * - Sign in: supabase.auth.signInWithPassword()
 * - Sign out: supabase.auth.signOut()
 * - Get user: supabase.auth.getUser()
 */

export async function GET() {
  return new Response('Supabase Auth is used directly. See lib/supabase.ts', {
    status: 200,
  })
}

export async function POST() {
  return new Response('Supabase Auth is used directly. See lib/supabase.ts', {
    status: 200,
  })
}

