'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function OnboardingCheckPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkWhitelist = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user?.email) {
          router.push('/auth/signin')
          return
        }

        const response = await fetch('/api/whitelist/check')
        const data = await response.json()

        if (data.whitelisted) {
          if (data.onboarding_complete) {
            router.push('/dashboard')
          } else {
            router.push('/onboarding/terms')
          }
        } else {
          router.push('/onboarding/not-whitelisted')
        }
      } catch (error) {
        console.error('Error checking whitelist:', error)
        router.push('/onboarding/not-whitelisted')
      } finally {
        setLoading(false)
      }
    }

    checkWhitelist()
  }, [router])

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

  return null
}

