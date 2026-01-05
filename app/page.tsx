'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { redrawGlass } from '@/lib/liquid-glass'

export default function Home() {
  const glassCardRef = useRef<HTMLDivElement>(null)
  const glassBoxRef = useRef<HTMLDivElement>(null)
  const glassContentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Initialize liquid glass effect
  useEffect(() => {
    if (!glassCardRef.current || !glassBoxRef.current || !glassContentRef.current) return

    const glassCard = glassCardRef.current
    const glassBox = glassBoxRef.current
    const glassContent = glassContentRef.current

    // Set initial values
    glassBox.dataset.blur = '4.0'
    glassBox.dataset.strength = '150'
    glassBox.dataset.saturate = '0.7'
    glassBox.dataset.brightness = '1.6'
    glassBox.dataset.cab = '0'
    glassBox.dataset.depth = '10'

    const overlayBg = glassCard.querySelector('.lg-overlay-bg') as HTMLElement
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

    updateGlass()

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
    const video = videoRef.current
    if (video) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Video autoplay prevented:', err)
        })
      }
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
        <div ref={glassCardRef} className="liquid-glass-card w-full max-w-[600px] rounded-[48px] relative overflow-hidden">
          {/* Liquid Glass Overlay Background */}
          <div className="lg-overlay-bg" />

          {/* Liquid Glass Content */}
          <div ref={glassContentRef} className="lg-content p-12 md:p-16">
            <div className="text-center space-y-8">
              <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
                Client Dashboard
              </h1>
              <p className="text-white text-lg leading-relaxed">
                Welcome to your secure client dashboard
              </p>
              <div className="flex justify-center space-x-4 pt-4">
                <Link
                  href="/auth/signin"
                  className="bg-[#0F172A] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#1E293B] transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-[0_20px_40px_rgba(15,23,42,0.25)] hover:shadow-[0_25px_50px_rgba(15,23,42,0.35)]"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
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
