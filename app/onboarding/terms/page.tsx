'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function TermsPage() {
  const router = useRouter()
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleContinue = async () => {
    if (!termsAccepted || !policyAccepted) return

    setLoading(true)
    try {
      // Store onboarding progress
      localStorage.setItem('onboarding_step', 'terms')
      router.push('/onboarding/startup-info')
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
            Let's get you started.
          </h1>
          <p className="text-sm text-[#d4d4d1]">
            A few things for you to review.
          </p>
        </div>

        {/* Terms Card */}
        <div className="card p-6 mb-6">
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
              />
              <span className="text-sm text-[#FAF9F6]">
                I agree to{' '}
                <Link href="/terms" className="underline hover:text-[#d4d4d1]">
                  Street Labs Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-[#d4d4d1]">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
              />
              <span className="text-sm text-[#FAF9F6]">
                I agree to Street Labs Client Policy.
              </span>
            </label>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!termsAccepted || !policyAccepted || loading}
          className="w-full px-6 py-3 bg-[#FAF9F6] text-[#262624] rounded-lg font-medium hover:bg-[#e8e7e4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </div>
    </div>
  )
}

