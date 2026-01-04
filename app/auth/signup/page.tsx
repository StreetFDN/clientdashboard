'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { redrawGlass } from '@/lib/liquid-glass'

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
  // Locked values for liquid glass effect
  const blur = 4.0
  const refractionLevel = 150
  const [focusedField, setFocusedField] = useState<'email' | 'password' | 'confirmPassword' | null>(null)
  
  const glassCardRef = useRef<HTMLDivElement>(null)
  const glassBoxRef = useRef<HTMLDivElement>(null)
  const glassContentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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

  // Initialize liquid glass effect for sign-up box (matching login page implementation)
  useEffect(() => {
    if (!glassCardRef.current || !glassBoxRef.current || !glassContentRef.current) return

    const glassCard = glassCardRef.current
    const glassBox = glassBoxRef.current
    const glassContent = glassContentRef.current

    // Set initial values from user's specifications
    glassBox.dataset.blur = blur.toString()
    glassBox.dataset.strength = refractionLevel.toString() // Refraction Level
    glassBox.dataset.saturate = '0.7' // Specular Saturation
    glassBox.dataset.brightness = '1.6'
    glassBox.dataset.cab = '0'
    glassBox.dataset.depth = '10'

    const overlayBg = glassCard.querySelector('.lg-overlay-bg') as HTMLElement
    // Set opacity: -0.15 becomes Math.max(0, Math.min(1, -0.15 + 0.1)) = 0
    const opacityValue = -0.15
    const clampedOpacity = Math.max(0, Math.min(1, opacityValue + 0.1))
    if (overlayBg) {
      overlayBg.style.background = `rgba(255, 255, 255, ${clampedOpacity})`
    }

    const updateGlass = () => {
      const rect = glassContent.getBoundingClientRect()
      const width = Math.round(rect.width)
      const height = Math.round(rect.height)

      const currentBlur = parseFloat(glassBox.dataset.blur || '0')
      const chromaticAberration = parseFloat(glassBox.dataset.cab || '0')
      const depth = parseFloat(glassBox.dataset.depth || '10')
      const strength = parseFloat(glassBox.dataset.strength || '100')
      const saturate = parseFloat(glassBox.dataset.saturate || '1.2')
      const brightness = parseFloat(glassBox.dataset.brightness || '1.6')
      const radius = parseFloat(getComputedStyle(glassCard).borderRadius || '0')

      glassBox.style.height = `${height}px`
      glassBox.style.width = `${width}px`

      if (typeof window !== 'undefined') {
        const testEl = document.createElement('div')
        testEl.style.cssText = 'backdrop-filter: url(#test)'
        const supportsBackdropFilterUrl = testEl.style.backdropFilter === 'url(#test)' || testEl.style.backdropFilter === 'url("#test")'

        if (supportsBackdropFilterUrl) {
          redrawGlass(glassCard, glassBox, glassContent, {
            blur: currentBlur,
            strength,
            saturate,
            brightness,
            chromaticAberration,
            depth,
          })
        } else {
          ;(glassBox.style as any).webkitBackdropFilter = `blur(${width / 10}px) saturate(180%)`
        }
      }
    }

    // Initial draw
    updateGlass()

    // Redraw on resize
    const resizeObserver = new ResizeObserver(() => {
      updateGlass()
    })
    resizeObserver.observe(glassCard)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  // Ensure video plays
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay prevented:', err)
      })
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden page-transition bg-black">
      {/* Traffic Video Background */}
      <div className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/traffic1-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
      </div>

      {/* Top-left Logo Container */}
      <div className="absolute top-10 left-10 z-20">
        <Image
          src="/Branding/street-logo.svg"
          alt="Logo"
          width={150}
          height={52}
          className="drop-shadow-lg"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* Content Container - Centered */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {/* The Liquid Glass Card */}
        <div ref={glassCardRef} className="liquid-glass-card w-full max-w-[500px] rounded-[48px] relative overflow-hidden">
        
        {/* Liquid Glass Overlay Background */}
        <div className="lg-overlay-bg" />

        {/* Liquid Glass Content - ALL content goes here */}
        <div ref={glassContentRef} className="lg-content p-12 md:p-14">
          {/* Top Arrow Icon */}
          <div className="flex justify-center mb-10">
            <div className="w-16 h-16 bg-white/90 rounded-[22px] flex items-center justify-center shadow-[0_12px_24px_rgba(99,102,241,0.12)] border border-white">
              <ArrowRight className="w-7 h-7 text-black" strokeWidth={2.5} />
            </div>
          </div>

          {/* Header Text */}
          <div className="text-center mb-10">
            <h1 className="text-[34px] font-bold text-white tracking-tight mb-3">
              Create your account
            </h1>
            <div className="text-white text-[16px] leading-relaxed max-w-[450px] mx-auto text-center">
              <div>Deploy compliant, equity-anchored tokens</div>
              <div>and supercharge your startups growth</div>
            </div>
          </div>

          {/* Messages */}
          {error && <p className="text-white text-sm text-center mb-4 font-semibold">{error}</p>}
          {message && <p className="text-white text-sm text-center mb-4 font-semibold">{message}</p>}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'email' ? 'text-black' : 'text-white'}`} style={{ opacity: 1, isolation: 'isolate', zIndex: 10 }} />
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`glass-input w-full pl-12 pr-4 py-4 rounded-2xl ${focusedField === 'email' ? 'text-black placeholder-black/70' : 'text-white placeholder-white/70'}`}
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'password' ? 'text-black' : 'text-white'}`} style={{ opacity: 1, isolation: 'isolate', zIndex: 10 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`glass-input w-full pl-12 pr-12 py-4 rounded-2xl ${focusedField === 'password' ? 'text-black placeholder-black/70' : 'text-white placeholder-white/70'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${focusedField === 'password' ? 'text-black' : 'text-white'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${focusedField === 'confirmPassword' ? 'text-black' : 'text-white'}`} style={{ opacity: 1, isolation: 'isolate', zIndex: 10 }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className={`glass-input w-full pl-12 pr-12 py-4 rounded-2xl ${focusedField === 'confirmPassword' ? 'text-black placeholder-black/70' : 'text-white placeholder-white/70'}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${focusedField === 'confirmPassword' ? 'text-black' : 'text-white'}`}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-[20px] shadow-[0_20px_40px_rgba(15,23,42,0.25)] hover:shadow-[0_25px_50px_rgba(15,23,42,0.35)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Dotted Separator */}
          <div className="flex items-center my-10">
            <div className="flex-1 border-t border-dashed border-white/50"></div>
            <span className="px-4 text-[13px] font-medium text-white">
              Already have an account?
            </span>
            <div className="flex-1 border-t border-dashed border-white/50"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link href="/auth/signin" className="text-sm font-semibold text-white hover:text-white/80 transition-colors">
              Sign in instead →
            </Link>
          </div>
        </div>
        {/* Liquid Glass Filter Layer */}
        <div className="lg-filter-layer">
          <div 
            ref={glassBoxRef}
            id="liquid-glass" 
            className="glass-box"
          />
        </div>
      </div>
      </div>
    </div>
  )
}
