'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { getAuthRedirectUrl } from '@/lib/auth-utils'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl('/auth/callback'),
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data.user) {
        setMessage(
          'Account created successfully! Check your email to verify your account, or sign in if email confirmation is disabled.'
        )
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push('/auth/signin')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
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
            Let's get you started.
          </h1>
          <p className="text-sm text-[#d4d4d1]">
            Create your account to begin your journey.
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="card p-6 mb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-[#FAF9F6] mb-1">
              Create your account
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

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
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
                placeholder="Password (min 8 characters)"
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4d4d1]" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d4d4d1] hover:text-[#FAF9F6]"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-[#FAF9F6] text-[#262624] rounded-lg font-medium hover:bg-[#e8e7e4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

        </div>

        {/* Sign In Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-[#d4d4d1]">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#0066cc] hover:text-[#0080ff] hover:underline">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
