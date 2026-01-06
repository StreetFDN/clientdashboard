import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// GitHub App configuration
const GITHUB_APP_ID = process.env.GITHUB_APP_ID || ''
const GITHUB_APP_INSTALL_URL = process.env.GITHUB_APP_INSTALL_URL || ''

export async function GET(request: NextRequest) {
  try {
    // Create server-side Supabase client
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

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Log cookie info for debugging
    const cookieNames = cookieStore.getAll().map(c => c.name)
    console.log('[GitHub Installation] Auth check:', {
      hasUser: !!user,
      authError: authError?.message,
      userId: user?.id,
      cookieCount: cookieNames.length,
      hasAuthCookies: cookieNames.some(name => name.includes('supabase') || name.includes('auth')),
    })
    
    if (authError || !user) {
      console.error('[GitHub Installation] Auth failed:', {
        error: authError?.message,
        code: authError?.status,
        cookies: cookieNames,
      })
      return NextResponse.json(
        { 
          error: 'Unauthorized', 
          message: authError?.message || 'Not authenticated. Please log in and try again.',
          hint: 'Make sure you are logged in and cookies are enabled.'
        },
        { status: 401 }
      )
    }

    // Check if user has GitHub installation stored
    console.log('[GitHub Installation] Checking database for user:', user.id)
    const { data: installation, error: dbError } = await supabase
      .from('github_installations')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Handle table doesn't exist error gracefully
    if (dbError) {
      if (dbError.code === 'PGRST116') {
        // No rows returned - this is fine, user hasn't installed yet
      } else if (dbError.code === '42P01' || dbError.message?.includes('does not exist')) {
        // Table doesn't exist - return helpful error
        return NextResponse.json(
          { 
            error: 'Database table not found',
            message: 'Please run the supabase-github-integration.sql migration in Supabase',
            installed: false,
            install_url: GITHUB_APP_INSTALL_URL || `https://github.com/apps/${GITHUB_APP_ID}/installations/new`,
          },
          { status: 200 } // Return 200 so UI can still show install button
        )
      } else {
        console.error('Database error:', dbError)
        throw dbError
      }
    }

    return NextResponse.json({
      installed: !!installation,
      installation_id: installation?.installation_id,
      account: installation?.account,
      install_url: GITHUB_APP_INSTALL_URL || `https://github.com/apps/${GITHUB_APP_ID}/installations/new`,
    }, { status: 200 })
  } catch (error) {
    console.error('Error checking GitHub installation:', error)
    return NextResponse.json(
      { 
        error: 'Failed to check GitHub installation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create server-side Supabase client
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

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { installation_id, account } = body

    if (!installation_id) {
      return NextResponse.json(
        { error: 'installation_id is required' },
        { status: 400 }
      )
    }

    // Store installation in database
    const { error: upsertError } = await supabase
      .from('github_installations')
      .upsert({
        user_id: user.id,
        installation_id,
        account,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      })

    if (upsertError) {
      throw upsertError
    }

    return NextResponse.json({
      success: true,
      message: 'GitHub installation saved successfully'
    }, { status: 200 })
  } catch (error) {
    console.error('Error saving GitHub installation:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save GitHub installation',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

