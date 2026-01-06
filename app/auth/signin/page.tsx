'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { getAuthRedirectUrl } from '@/lib/auth-utils'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        return
      }

      if (data.user) {
        setMessage('Successfully signed in! Redirecting...')
        setTimeout(() => {
          router.push('/onboarding/check')
        }, 500)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setLoading(true)
    setError(null)

    try {
      const redirectUrl = getAuthRedirectUrl('/auth/callback')
      console.log('[OAuth] Redirect URL:', redirectUrl)
      console.log('[OAuth] Current origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A')
      console.log('[OAuth] Env vars:', {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      })
      
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (oauthError) {
        setError(oauthError.message)
        setLoading(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 page-transition bg-[#262624]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="/Branding/street-logo.png"
              alt="Street Labs"
              width={120}
              height={42}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="serif-heading text-3xl text-[#FAF9F6] mb-2">
            Welcome back.
          </h1>
          <p className="text-sm text-[#d4d4d1]">
            Sign in to continue to your dashboard.
          </p>
        </div>

        {/* Sign In Card */}
        <div className="card p-6 mb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-[#FAF9F6] mb-1">
              Sign in with email
            </h2>
            <p className="text-xs text-[#d4d4d1]">
              Deploy compliant, equity-anchored tokens and supercharge your startup's growth
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-800/50 rounded-md text-sm text-red-400">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-800/50 rounded-md text-sm text-green-400">
              {message}
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4d4d1]" />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4d4d1]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4d4d1] hover:text-[#FAF9F6]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-right">
              <Link href="/auth/reset" className="text-sm text-[#0066cc] hover:text-[#0080ff] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#FAF9F6] text-[#262624] rounded-lg font-medium hover:bg-[#e8e7e4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Get Started'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-[#3a3a38]"></div>
            <span className="px-4 text-xs text-[#d4d4d1]">Or sign in with</span>
            <div className="flex-1 border-t border-[#3a3a38]"></div>
          </div>

          {/* Social Buttons */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="card px-4 py-2 flex items-center justify-center gap-2 hover:bg-[#3a3a38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span className="text-xs text-[#FAF9F6]">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('apple')}
              disabled={loading}
              className="card px-4 py-2 flex items-center justify-center gap-2 hover:bg-[#3a3a38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AppleIcon />
              <span className="text-xs text-[#FAF9F6]">Apple</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-[#d4d4d1]">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#0066cc] hover:text-[#0080ff] hover:underline">
              Sign up →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

// Icon Components
const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const AppleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)

