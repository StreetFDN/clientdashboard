import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This endpoint fetches GitHub activity from the street-client backend
// You'll need to configure the backend URL in your environment variables
const GITHUB_BACKEND_URL = process.env.GITHUB_BACKEND_URL || 'https://api.streetlabs.dev/github'

export async function GET(request: NextRequest) {
  try {
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
    const url = new URL(`${GITHUB_BACKEND_URL}/activity`)
    url.searchParams.set('period', period)
    if (repository) {
      url.searchParams.set('repository', repository)
    }

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

