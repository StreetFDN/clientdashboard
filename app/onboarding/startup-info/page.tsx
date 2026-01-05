'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function StartupInfoPage() {
  const router = useRouter()
  const [startupName, setStartupName] = useState('')
  const [hasLaunchedToken, setHasLaunchedToken] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!startupName || hasLaunchedToken === null) return

    setLoading(true)
    try {
      // Store onboarding data
      localStorage.setItem('onboarding_step', 'startup-info')
      localStorage.setItem('startup_name', startupName)
      localStorage.setItem('has_launched_token', String(hasLaunchedToken))
      
      router.push('/onboarding/team-access')
    } catch (error) {
      console.error('Error:', error)
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
            Did we get this right?
          </h1>
        </div>

        {/* Info Card */}
        <div className="card p-6 mb-6 space-y-6">
          <div>
            <label className="block text-sm text-[#FAF9F6] mb-2">
              Your Startup's Name is
            </label>
            <input
              type="text"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              placeholder="Enter startup name"
              className="input w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-[#FAF9F6] mb-3">
              You {hasLaunchedToken === true ? 'have' : hasLaunchedToken === false ? "haven't" : ''} launched an ERC-S token yet.
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="token"
                  checked={hasLaunchedToken === true}
                  onChange={() => setHasLaunchedToken(true)}
                  className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                />
                <span className="text-sm text-[#FAF9F6]">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="token"
                  checked={hasLaunchedToken === false}
                  onChange={() => setHasLaunchedToken(false)}
                  className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                />
                <span className="text-sm text-[#FAF9F6]">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!startupName || hasLaunchedToken === null || loading}
          className="w-full px-6 py-3 bg-[#FAF9F6] text-[#262624] rounded-lg font-medium hover:bg-[#e8e7e4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

