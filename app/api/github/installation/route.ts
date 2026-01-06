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
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: authError?.message || 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get Supabase JWT token to send to backend
    const { data: { session } } = await supabase.auth.getSession()
    const supabaseToken = session?.access_token
    
    // Check installation from backend (street-client) instead of Supabase
    // The backend stores installations in its own database
    const backendUrl = process.env.GITHUB_BACKEND_URL?.startsWith('http') 
      ? process.env.GITHUB_BACKEND_URL 
      : `https://${process.env.GITHUB_BACKEND_URL || 'street-client-production.up.railway.app'}`
    
    const cookieHeader = request.headers.get('cookie') || ''
    
    try {
      // Step 1: Get user's clients from backend
      const clientsResponse = await fetch(`${backendUrl}/api/clients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(supabaseToken ? { 'Authorization': `Bearer ${supabaseToken}` } : {}),
          'Cookie': cookieHeader,
        },
        credentials: 'include',
      })
      
      if (!clientsResponse.ok) {
        // If can't get clients, return not installed
        return NextResponse.json({
          installed: false,
          install_url: GITHUB_APP_INSTALL_URL || `https://github.com/apps/${GITHUB_APP_ID}/installations/new`,
        }, { status: 200 })
      }
      
      const clients = await clientsResponse.json()
      
      if (!clients || clients.length === 0) {
        // No clients = no installation
        return NextResponse.json({
          installed: false,
          install_url: GITHUB_APP_INSTALL_URL || `https://github.com/apps/${GITHUB_APP_ID}/installations/new`,
        }, { status: 200 })
      }
      
      // Step 2: Check installations for all clients (installations might be on any client)
      let allInstallations: any[] = []
      
      for (const client of clients) {
        try {
          const installationsResponse = await fetch(`${backendUrl}/api/clients/${client.id}/installations`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(supabaseToken ? { 'Authorization': `Bearer ${supabaseToken}` } : {}),
              'Cookie': cookieHeader,
            },
            credentials: 'include',
          })
          
          if (installationsResponse.ok) {
            const clientInstallations = await installationsResponse.json()
            if (clientInstallations && Array.isArray(clientInstallations)) {
              allInstallations = allInstallations.concat(clientInstallations)
            }
          }
        } catch (err) {
          console.error(`Error checking installations for client ${client.id}:`, err)
          // Continue checking other clients
        }
      }
      
      const hasInstallation = allInstallations.length > 0
      const firstInstallation = hasInstallation ? allInstallations[0] : null
      
      return NextResponse.json({
        installed: hasInstallation,
        installation_id: firstInstallation?.installationId,
        account: firstInstallation ? {
          login: firstInstallation.accountLogin,
          type: 'User', // Default, could be enhanced
        } : undefined,
        install_url: GITHUB_APP_INSTALL_URL || `https://github.com/apps/${GITHUB_APP_ID}/installations/new`,
      }, { status: 200 })
      
    } catch (error) {
      console.error('Error checking installation from backend:', error)
      // On error, return not installed (graceful degradation)
      return NextResponse.json({
        installed: false,
        install_url: GITHUB_APP_INSTALL_URL || `https://github.com/apps/${GITHUB_APP_ID}/installations/new`,
      }, { status: 200 })
    }
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

