import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
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

    // Use service role for admin operations
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

    const body = await request.json()
    const { email, is_whitelisted, onboarding_complete, startup_name, has_launched_token, has_live_token, token_contract } = body

    const updateData: any = {
      email,
      updated_at: new Date().toISOString(),
    }

    if (is_whitelisted !== undefined) updateData.is_whitelisted = is_whitelisted
    if (onboarding_complete !== undefined) updateData.onboarding_complete = onboarding_complete
    if (startup_name !== undefined) updateData.startup_name = startup_name
    if (has_launched_token !== undefined) updateData.has_launched_token = has_launched_token
    if (has_live_token !== undefined) updateData.has_live_token = has_live_token
    if (token_contract !== undefined) updateData.token_contract = token_contract

    const { data, error } = await adminClient
      .from('whitelist')
      .upsert(updateData, {
        onConflict: 'email'
      })

    if (error) {
      console.error('Error updating whitelist:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in admin whitelist route:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Use service role for admin operations
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

    const { data, error } = await adminClient
      .from('whitelist')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching whitelist:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error in admin whitelist GET route:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Use service role for admin operations
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

    const body = await request.json()
    const { email, is_whitelisted } = body

    const { data, error } = await adminClient
      .from('whitelist')
      .update({ is_whitelisted, updated_at: new Date().toISOString() })
      .eq('email', email)
      .select()

    if (error) {
      console.error('Error updating whitelist:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Error in admin whitelist PATCH route:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

