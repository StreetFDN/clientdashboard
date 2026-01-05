'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
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
