'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { redrawGlass } from '@/lib/liquid-glass'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  // Locked values for liquid glass effect
  const blur = 4.0
  const refractionLevel = 150
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null)
  
  const glassCardRef = useRef<HTMLDivElement>(null)
  const glassBoxRef = useRef<HTMLDivElement>(null)
  const glassContentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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
          window.location.href = '/dashboard'
        }, 500)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Initialize liquid glass effect for sign-in box (matching button implementation)
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
          src="/Branding/street-logo.png"
          alt="Logo"
          width={150}
          height={52}
          className="drop-shadow-lg"
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
              Sign in with email
            </h1>
            <div className="text-white text-[16px] leading-relaxed max-w-[450px] mx-auto text-center">
              <div>Deploy compliant, equity-anchored tokens</div>
              <div>and supercharge your startups growth</div>
            </div>
          </div>

          {/* Messages */}
          {error && <p className="text-white text-sm text-center mb-4 font-semibold">{error}</p>}
          {message && <p className="text-white text-sm text-center mb-4 font-semibold">{message}</p>}

          <form onSubmit={handleSignIn} className="space-y-4">
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
                placeholder="Password"
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

            <div className="text-right">
              <Link href="/auth/reset" className="text-sm font-semibold text-white hover:text-white/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-[20px] shadow-[0_20px_40px_rgba(15,23,42,0.25)] hover:shadow-[0_25px_50px_rgba(15,23,42,0.35)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Get Started'}
            </button>
          </form>

          {/* Dotted Separator */}
          <div className="flex items-center my-10">
            <div className="flex-1 border-t border-dashed border-white/50"></div>
            <span className="px-4 text-[13px] font-medium text-white">
              Or sign in with
            </span>
            <div className="flex-1 border-t border-dashed border-white/50"></div>
          </div>

          {/* Blue-Themed Social Buttons */}
          <div className="flex justify-center gap-5">
            {[
              { id: 'google', icon: <GoogleIcon /> },
              { id: 'apple', icon: <AppleIcon /> }
            ].map((social) => (
              <button
                key={social.id}
                type="button"
                className="w-16 h-16 bg-white/60 rounded-[24px] flex items-center justify-center border border-white shadow-[0_8px_16px_rgba(0,0,0,0.03)] hover:bg-white hover:shadow-[0_12px_24px_rgba(99,102,241,0.08)] hover:-translate-y-1 transition-all duration-300"
              >
                {social.icon}
              </button>
            ))}
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

// Icon Components
const GoogleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const AppleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#000000">
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
)
