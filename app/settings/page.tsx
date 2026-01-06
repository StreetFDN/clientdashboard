'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardSidebar from '@/components/DashboardSidebar'
import NavigationBox from '@/components/NavigationBox'
import { Settings, X, Trash2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import GitHubAppInstall from '@/components/GitHubAppInstall'

interface TeamMember {
  id: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        
        if (!currentUser) {
          router.push('/auth/signin')
          return
        }

        // Fetch team members
        const response = await fetch('/api/user/team-members')
        if (response.ok) {
          const data = await response.json()
          setTeamMembers(data.teamMembers || [])
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleRemoveMember = async (invitationId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) {
      return
    }

    setRemoving(invitationId)
    try {
      const response = await fetch('/api/user/team-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId }),
      })

      if (response.ok) {
        setTeamMembers(teamMembers.filter(m => m.id !== invitationId))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to remove team member')
      }
    } catch (error) {
      console.error('Error removing team member:', error)
      alert('An error occurred while removing the team member')
    } finally {
      setRemoving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#262624]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAF9F6] mx-auto"></div>
          <p className="mt-4 text-[#d4d4d1]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen relative page-transition bg-[#262624]">
      <DashboardSidebar isOpen={sidebarOpen} />
      <NavigationBox />
      <DashboardNavbar 
        pageTitle="Settings" 
        user={user} 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div 
        className="relative transition-all duration-300 ease-in-out overflow-y-auto"
        style={{
          marginLeft: sidebarOpen ? '256px' : '0',
          maxWidth: sidebarOpen ? 'calc(100% - 256px)' : '100%',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
        }}
      >
        <div className="w-full px-6 py-5">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-[#FAF9F6]" />
                <h1 className="serif-heading text-3xl text-[#FAF9F6]">Settings</h1>
              </div>
              <p className="text-sm text-[#d4d4d1]">Manage your team members and account settings</p>
            </div>

            {/* GitHub Integration Section */}
            <div className="card p-6 mb-6">
              <h2 className="text-lg font-medium text-[#FAF9F6] mb-4">GitHub Integration</h2>
              <p className="text-sm text-[#d4d4d1] mb-4">
                Connect your GitHub account to track development activity and contributions in the Dev Update dashboard.
              </p>
              <GitHubAppInstall />
            </div>

            {/* Team Members Section */}
            <div className="card p-6">
              <h2 className="text-lg font-medium text-[#FAF9F6] mb-4">Team Members</h2>
              <p className="text-sm text-[#d4d4d1] mb-4">
                Manage team members you've invited to access the dashboard.
              </p>

              {teamMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[#d4d4d1]">No team members invited yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 bg-[#262624] rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#FAF9F6]">{member.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-[#d4d4d1] capitalize">
                            Role: {member.role}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              member.status === 'accepted'
                                ? 'bg-green-500/20 text-green-400'
                                : member.status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {member.status}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={removing === member.id}
                        className="card p-2 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        aria-label="Remove team member"
                      >
                        {removing === member.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

