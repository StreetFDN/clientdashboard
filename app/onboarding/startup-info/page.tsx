'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { MessageCircle } from 'lucide-react'

export default function StartupInfoPage() {
  const router = useRouter()
  const [startupName, setStartupName] = useState('')
  const [hasLaunchedToken, setHasLaunchedToken] = useState<boolean | null>(null)
  const [hasLiveToken, setHasLiveToken] = useState<boolean | null>(null)
  const [tokenContract, setTokenContract] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [confirmed, setConfirmed] = useState<boolean | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/whitelist/user-data')
        const data = await response.json()

        if (response.ok) {
          setStartupName(data.startupName || '')
          setHasLaunchedToken(data.hasLaunchedToken)
          setHasLiveToken(data.hasLiveToken)
          setTokenContract(data.tokenContract || '')
        } else {
          console.error('Error fetching user data:', data.error)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setFetching(false)
      }
    }

    fetchUserData()
  }, [])

  const handleContinue = async () => {
    if (confirmed === null) return

    if (confirmed) {
      setLoading(true)
      try {
        localStorage.setItem('onboarding_step', 'startup-info')
        router.push('/onboarding/team-access')
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    // If confirmed is false, show Telegram link (handled in UI)
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#262624]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FAF9F6] mx-auto"></div>
          <p className="mt-4 text-[#d4d4d1]">Loading...</p>
        </div>
      </div>
    )
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
            Did we get this right?
          </h1>
        </div>

        {/* Info Card */}
        <div className="card p-6 mb-6 space-y-6">
          <div>
            <p className="text-sm text-[#d4d4d1] mb-1">Your Startup's Name is</p>
            <p className="text-lg font-medium text-[#FAF9F6]">{startupName || 'Not set'}</p>
          </div>

          <div>
            <p className="text-sm text-[#d4d4d1] mb-1">You {hasLaunchedToken ? 'have' : "haven't"} launched an ERC-S token yet.</p>
          </div>

          <div>
            <p className="text-sm text-[#d4d4d1] mb-1">Live token: <span className="text-[#FAF9F6]">{hasLiveToken ? 'Yes' : hasLiveToken === false ? 'No' : 'Not set'}</span></p>
            {hasLiveToken === true && tokenContract && (
              <p className="text-sm text-[#d4d4d1] mt-1">
                Token Contract: <span className="text-[#FAF9F6] font-mono text-xs">{tokenContract}</span>
              </p>
            )}
          </div>

          <div>
            <p className="text-sm text-[#d4d4d1] mb-3">Is this information correct?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="confirm"
                  checked={confirmed === true}
                  onChange={() => setConfirmed(true)}
                  className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                />
                <span className="text-sm text-[#FAF9F6]">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="confirm"
                  checked={confirmed === false}
                  onChange={() => setConfirmed(false)}
                  className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                />
                <span className="text-sm text-[#FAF9F6]">No</span>
              </label>
            </div>
          </div>

          {/* Telegram Link - Show if No is selected */}
          {confirmed === false && (
            <div className="pt-4 border-t border-[#3a3a38]">
              <a
                href="https://t.me/gruberlukas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FAF9F6] hover:text-[#d4d4d1] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm">Reach Out</span>
              </a>
            </div>
          )}
        </div>

        {/* Continue Button - Only show if Yes is selected */}
        {confirmed === true && (
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full px-6 py-3 bg-[#FAF9F6] text-[#262624] rounded-lg font-medium hover:bg-[#e8e7e4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Continue'}
          </button>
        )}
      </div>
    </div>
  )
}
