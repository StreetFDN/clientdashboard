import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This endpoint fetches GitHub activity from the street-client backend
// You'll need to configure the backend URL in your environment variables
const GITHUB_BACKEND_URL = process.env.GITHUB_BACKEND_URL || 'https://api.streetlabs.dev/github'

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
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'week' // week, month, all
    const repository = searchParams.get('repository') // optional filter

    // Fetch from street-client backend
    // Ensure URL has protocol
    const backendUrl = GITHUB_BACKEND_URL.startsWith('http') 
      ? GITHUB_BACKEND_URL 
      : `https://${GITHUB_BACKEND_URL}`
    
    // Try different endpoint paths - your backend might use a different path
    const endpointPath = '/github/activity' // Try this first, or '/api/github/activity', or '/activity'
    const url = new URL(`${backendUrl}${endpointPath}`)
    url.searchParams.set('period', period)
    if (repository) {
      url.searchParams.set('repository', repository)
    }

    console.log('[GitHub Activity] Fetching from:', url.toString())
    console.log('[GitHub Activity] Backend URL env:', GITHUB_BACKEND_URL)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers needed for your backend
        // 'Authorization': `Bearer ${token}`,
      },
      // Add cache revalidation
      next: { revalidate: 300 }, // Cache for 5 minutes
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Backend API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error fetching GitHub activity:', error)
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to fetch GitHub activity'
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot connect to backend. Check GITHUB_BACKEND_URL in .env.local'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Backend request timed out. Check if backend is running.'
      } else {
        errorMessage = error.message
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch GitHub activity',
        message: errorMessage
      },
      { status: 500 }
    )
  }
}

