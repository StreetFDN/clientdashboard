'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { X, Plus } from 'lucide-react'

interface TeamMember {
  email: string
  role: 'viewer' | 'admin'
}

export default function TeamAccessPage() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'viewer' | 'admin'>('viewer')
  const [loading, setLoading] = useState(false)

  const addTeamMember = () => {
    if (!newEmail || !newEmail.includes('@')) return
    
    // Get current user's email domain
    const getCurrentUserDomain = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const domain = user.email.split('@')[1]
        const newMemberDomain = newEmail.split('@')[1]
        
        if (domain !== newMemberDomain) {
          alert('Team members must have the same email domain')
          return
        }
      }
      
      setTeamMembers([...teamMembers, { email: newEmail, role: newRole }])
      setNewEmail('')
    }
    
    getCurrentUserDomain()
  }

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index))
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user?.email) {
        router.push('/auth/signin')
        return
      }

      // Get onboarding data
      const startupName = localStorage.getItem('startup_name') || ''
      const hasLaunchedToken = localStorage.getItem('has_launched_token') === 'true'

      // Save onboarding data and invite team members
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startupName,
          hasLaunchedToken,
          teamMembers,
        }),
      })

      if (response.ok) {
        localStorage.setItem('onboarding_complete', 'true')
        router.push('/dashboard')
      } else {
        throw new Error('Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#262624]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/Branding/street-logo.png"
            alt="Street Labs"
            width={120}
            height={42}
            className="object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="serif-heading text-3xl text-[#FAF9F6] mb-2">
            Team Access
          </h1>
          <p className="text-sm text-[#d4d4d1]">
            Who of your team do you want to have access to the client dashboard and what role should they have?
          </p>
        </div>

        {/* Team Members Card */}
        <div className="card p-6 mb-6 space-y-4">
          {/* Existing Members */}
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#262624] rounded-lg">
              <div className="flex-1">
                <p className="text-sm text-[#FAF9F6]">{member.email}</p>
                <p className="text-xs text-[#d4d4d1] capitalize">{member.role}</p>
              </div>
              <button
                onClick={() => removeTeamMember(index)}
                className="card p-1 hover:bg-[#3a3a38] transition-colors"
              >
                <X className="w-4 h-4 text-[#d4d4d1]" />
              </button>
            </div>
          ))}

          {/* Add Member Form */}
          <div className="space-y-3 pt-3 border-t border-[#3a3a38]">
            <div>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter email address"
                className="input w-full mb-3"
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    checked={newRole === 'viewer'}
                    onChange={() => setNewRole('viewer')}
                    className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                  />
                  <span className="text-sm text-[#FAF9F6]">Viewer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    checked={newRole === 'admin'}
                    onChange={() => setNewRole('admin')}
                    className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                  />
                  <span className="text-sm text-[#FAF9F6]">Admin</span>
                </label>
              </div>
            </div>
            <button
              onClick={addTeamMember}
              className="w-full card px-4 py-2 flex items-center justify-center gap-2 hover:bg-[#3a3a38] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#FAF9F6]" />
              <span className="text-sm text-[#FAF9F6]">Add Email</span>
            </button>
          </div>
        </div>

        {/* Finish Button */}
        <button
          onClick={handleFinish}
          disabled={loading}
          className="w-full px-6 py-3 bg-[#FAF9F6] text-[#262624] rounded-lg font-medium hover:bg-[#e8e7e4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Finish'}
        </button>
      </div>
    </div>
  )
}

