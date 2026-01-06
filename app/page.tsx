'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code = searchParams.get('code')

  // Handle OAuth callback if code is present
  useEffect(() => {
    if (code) {
      // Redirect to the proper callback route
      router.replace(`/auth/callback?code=${code}`)
    }
  }, [code, router])

  // Show loading state while redirecting
  if (code) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#262624]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
          <p className="text-sm text-[#d4d4d1]">Completing sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative page-transition bg-[#f8f9fa]">
      {/* Top-left Logo */}
      <div className="absolute top-8 left-8 z-20">
        <Image
          src="/Branding/street-logo.png"
          alt="Logo"
          width={120}
          height={42}
          className="object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto text-center">
        <div className="card p-12 md:p-16">
          <div className="space-y-8">
            <h1 className="serif-heading text-5xl md:text-6xl text-[#212529] mb-6">
              Client Dashboard
            </h1>
            <p className="text-lg text-[#6c757d] leading-relaxed max-w-md mx-auto">
              Welcome to your secure client dashboard
            </p>
            <div className="flex justify-center gap-3 pt-6">
              <Link
                href="/auth/signin"
                className="btn btn-primary"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="btn btn-secondary"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#262624]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
          <p className="text-sm text-[#d4d4d1]">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
