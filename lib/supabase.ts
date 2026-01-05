import { createBrowserClient } from '@supabase/ssr'

/**
 * Supabase Client for Client-Side
 * 
 * Use this in React components and client-side code.
 * Safe to use in browser - uses anon key.
 * Automatically handles session cookies.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Only throw error at runtime, not during build
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

/**
 * Supabase Admin Client for Server-Side
 * 
 * Use this ONLY in API routes and server components.
 * ⚠️ NEVER expose this to client-side code!
 * 
 * This client has admin privileges and bypasses Row Level Security.
 */
export function createServerClient() {
  const { createClient } = require('@supabase/supabase-js')
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  
  return createClient(supabaseUrl!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

