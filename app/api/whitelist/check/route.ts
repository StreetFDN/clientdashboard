import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
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

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      return NextResponse.json({ whitelisted: false }, { status: 401 })
    }

    // Use service role to bypass RLS for whitelist check
    const { createClient } = require('@supabase/supabase-js')
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Check whitelist table using service role
    const { data: whitelistEntry, error } = await adminClient
      .from('whitelist')
      .select('*')
      .eq('email', user.email)
      .single()

    if (error || !whitelistEntry) {
      return NextResponse.json({ whitelisted: false })
    }

    return NextResponse.json({ 
      whitelisted: whitelistEntry.is_whitelisted,
      onboarding_complete: whitelistEntry.onboarding_complete 
    })
  } catch (error) {
    console.error('Error checking whitelist:', error)
    return NextResponse.json({ whitelisted: false }, { status: 500 })
  }
}

