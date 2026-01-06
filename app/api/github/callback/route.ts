import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// This route handles the callback from GitHub App installation
// GitHub will redirect here after installation with installation_id and setup_action
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const installation_id = searchParams.get('installation_id')
    const setup_action = searchParams.get('setup_action')
    const code = searchParams.get('code')

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      // Redirect to sign in if not authenticated
      return NextResponse.redirect(
        new URL(`/auth/signin?redirect=${encodeURIComponent(request.url)}`, request.url)
      )
    }

    // If installation_id is provided, save it
    if (installation_id) {
      // Fetch installation details from GitHub API
      // You'll need to implement this based on your GitHub App configuration
      const githubToken = process.env.GITHUB_APP_PRIVATE_KEY
      
      if (!githubToken) {
        console.warn('GITHUB_APP_PRIVATE_KEY not configured')
      }

      // Store installation in database
      const { error: upsertError } = await supabase
        .from('github_installations')
        .upsert({
          user_id: user.id,
          installation_id,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        })

      if (upsertError) {
        console.error('Error saving installation:', upsertError)
        return NextResponse.redirect(
          new URL('/dev-update?error=installation_failed', request.url)
        )
      }

      // Redirect to dev-update page with success message
      return NextResponse.redirect(
        new URL('/dev-update?installed=true', request.url)
      )
    }

    // If setup_action is 'install', redirect to installation page
    if (setup_action === 'install') {
      const installUrl = process.env.GITHUB_APP_INSTALL_URL || ''
      if (installUrl) {
        return NextResponse.redirect(installUrl)
      }
    }

    // Default redirect to dev-update page
    return NextResponse.redirect(new URL('/dev-update', request.url))
  } catch (error) {
    console.error('Error handling GitHub callback:', error)
    return NextResponse.redirect(
      new URL('/dev-update?error=callback_failed', request.url)
    )
  }
}

