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

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { startupName, hasLaunchedToken, teamMembers } = body

    // Get user's email domain
    const userDomain = user.email.split('@')[1]

    // Save onboarding data to user profile or a separate table
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        startup_name: startupName,
        has_launched_token: hasLaunchedToken,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      })

    if (profileError) {
      console.error('Error saving profile:', profileError)
    }

    // Update whitelist to mark onboarding as complete
    const { error: whitelistError } = await supabase
      .from('whitelist')
      .update({ onboarding_complete: true })
      .eq('email', user.email)

    if (whitelistError) {
      console.error('Error updating whitelist:', whitelistError)
    }

    // Invite team members (only same domain)
    for (const member of teamMembers) {
      const memberDomain = member.email.split('@')[1]
      
      if (memberDomain === userDomain) {
        // Create invitation
        const { error: inviteError } = await supabase
          .from('team_invitations')
          .insert({
            email: member.email,
            role: member.role,
            invited_by: user.id,
            domain: memberDomain,
            status: 'pending',
          })

        if (inviteError) {
          console.error('Error creating invitation:', inviteError)
        }

        // Send invitation email (you'll need to set up email service)
        // For now, we'll just log it
        console.log(`Invitation sent to ${member.email} with role ${member.role}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing onboarding:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

