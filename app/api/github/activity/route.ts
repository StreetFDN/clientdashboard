import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This endpoint fetches GitHub activity from the street-client backend
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
    const period = searchParams.get('period') || 'week'
    const repository = searchParams.get('repository')

    // Fetch from street-client backend
    const backendUrl = GITHUB_BACKEND_URL.startsWith('http') 
      ? GITHUB_BACKEND_URL 
      : `https://${GITHUB_BACKEND_URL}`
    
    // Get Supabase JWT token to send to backend
    const { data: { session } } = await supabase.auth.getSession()
    const supabaseToken = session?.access_token
    
    // Forward cookies for backward compatibility (session auth)
    const cookieHeader = request.headers.get('cookie') || ''
    
    // Step 1: Get user's clients
    // Try Supabase JWT first, fallback to session cookies
    const clientsResponse = await fetch(`${backendUrl}/api/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(supabaseToken ? { 'Authorization': `Bearer ${supabaseToken}` } : {}),
        'Cookie': cookieHeader,
      },
      credentials: 'include',
      next: { revalidate: 300 },
    })
    
    if (!clientsResponse.ok) {
      if (clientsResponse.status === 401) {
        // Backend authentication failed - could be missing Supabase env vars or token issue
        const errorText = await clientsResponse.text().catch(() => clientsResponse.statusText)
        return NextResponse.json({
          error: 'Backend authentication failed',
          message: 'Unable to authenticate with backend. Please check that Supabase credentials are configured in the backend.',
          activities: [],
          summary: {
            total_activities: 0,
            commits: 0,
            pull_requests: 0,
            issues: 0,
            releases: 0,
          },
        }, { status: 401 })
      }
      throw new Error(`Failed to fetch clients: ${clientsResponse.status}`)
    }
    
    const clients = await clientsResponse.json()
    
    if (!clients || clients.length === 0) {
      return NextResponse.json({
        error: 'No clients found',
        message: 'Please install the GitHub App first',
        activities: [],
        summary: {
          total_activities: 0,
          commits: 0,
          pull_requests: 0,
          issues: 0,
          releases: 0,
        },
      }, { status: 200 })
    }
    
    // Use the first client (or you could let user choose)
    const clientId = clients[0].id
    
    // Step 2: Get summary for the client
    // The backend has /api/clients/:clientId/summary/7days endpoint
    const summaryUrl = `${backendUrl}/api/clients/${clientId}/summary/7days`
    
    console.log('[GitHub Activity] Fetching summary from:', summaryUrl)

    const summaryResponse = await fetch(summaryUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(supabaseToken ? { 'Authorization': `Bearer ${supabaseToken}` } : {}),
        'Cookie': cookieHeader,
      },
      credentials: 'include',
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    })

    if (!summaryResponse.ok) {
      const errorText = await summaryResponse.text().catch(() => summaryResponse.statusText)
      throw new Error(`Backend API error (${summaryResponse.status}): ${errorText}`)
    }

    const backendData = await summaryResponse.json()
    
    // Transform backend response to frontend format
    // Backend returns: { summary, stats, period }
    // Frontend expects: { activities: [], summary: { ... } }
    
    const transformedData = {
      period: {
        start: backendData.period?.from || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: backendData.period?.to || new Date().toISOString(),
        label: period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time',
      },
      total_activities: backendData.stats?.commits || 0,
      commits: backendData.stats?.commits || 0,
      pull_requests: backendData.stats?.mergedPRs || 0,
      issues: 0, // Backend doesn't provide this in summary
      releases: backendData.stats?.releases || 0,
      activities: [], // Backend summary doesn't include individual activities
      summary: backendData.summary || '',
    }
    
    return NextResponse.json(transformedData, { status: 200 })
  } catch (error) {
    console.error('Error fetching GitHub activity:', error)
    
    let errorMessage = 'Failed to fetch GitHub activity'
    if (error instanceof Error) {
      if (error.message.includes('fetch failed') || error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Cannot connect to backend. Check GITHUB_BACKEND_URL in Railway variables.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Backend request timed out. Check if backend is running.'
      } else if (error.message.includes('404')) {
        errorMessage = 'Backend endpoint not found. Check if the endpoint path is correct in your backend.'
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
