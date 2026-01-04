'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'
import { redrawGlass } from '@/lib/liquid-glass'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ChevronLeft } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

interface DashboardNavbarProps {
  pageTitle: string
  user?: User | null
  logoSize?: number
  sidebarOpen: boolean
  onToggleSidebar: () => void
  logoX?: number
  logoY?: number
  titleX?: number
  navbarBlur?: number
  navbarRefraction?: number
}

export default function DashboardNavbar({ pageTitle, user, logoSize = 42, sidebarOpen, onToggleSidebar, logoX = 0, logoY = 0, titleX = 0, navbarBlur = 1.0, navbarRefraction = 20 }: DashboardNavbarProps) {
  const router = useRouter()

  const titleTextRef = useRef<HTMLHeadingElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  
  // Refs for navbar liquid glass effect
  const navbarCardRef = useRef<HTMLDivElement>(null)
  const navbarBoxRef = useRef<HTMLDivElement>(null)
  const navbarContentRef = useRef<HTMLDivElement>(null)

  // Initialize liquid glass effect for navbar
  useEffect(() => {
    if (!navbarCardRef.current || !navbarBoxRef.current || !navbarContentRef.current) return

    const navbarCard = navbarCardRef.current
    const navbarBox = navbarBoxRef.current
    const navbarContent = navbarContentRef.current

    // Set values from props
    navbarBox.dataset.blur = navbarBlur.toString()
    navbarBox.dataset.strength = navbarRefraction.toString()
    navbarBox.dataset.saturate = '0.7'
    navbarBox.dataset.brightness = '1.6'
    navbarBox.dataset.cab = '0'
    navbarBox.dataset.depth = '10'

    const overlayBg = navbarCard.querySelector('.lg-overlay-bg') as HTMLElement
    const opacityValue = -0.15
    const clampedOpacity = Math.max(0, Math.min(1, opacityValue + 0.1))
    if (overlayBg) {
      overlayBg.style.background = `rgba(255, 255, 255, ${clampedOpacity})`
    }

    const updateGlass = () => {
      const rect = navbarContent.getBoundingClientRect()
      const width = Math.round(rect.width)
      const height = Math.round(rect.height)

      const currentBlur = parseFloat(navbarBox.dataset.blur || '0')
      const chromaticAberration = parseFloat(navbarBox.dataset.cab || '0')
      const depth = parseFloat(navbarBox.dataset.depth || '10')
      const strength = parseFloat(navbarBox.dataset.strength || '100')
      const saturate = parseFloat(navbarBox.dataset.saturate || '1.2')
      const brightness = parseFloat(navbarBox.dataset.brightness || '1.6')

      navbarBox.style.height = `${height}px`
      navbarBox.style.width = `${width}px`

      if (typeof window !== 'undefined') {
        const testEl = document.createElement('div')
        testEl.style.cssText = 'backdrop-filter: url(#test)'
        const supportsBackdropFilterUrl = testEl.style.backdropFilter === 'url(#test)' || testEl.style.backdropFilter === 'url("#test")'

        if (supportsBackdropFilterUrl) {
          redrawGlass(navbarCard, navbarBox, navbarContent, {
            blur: currentBlur,
            strength,
            saturate,
            brightness,
            chromaticAberration,
            depth,
          })
        } else {
          ;(navbarBox.style as any).webkitBackdropFilter = `blur(${width / 10}px) saturate(180%)`
        }
      }
    }

    updateGlass()

    const resizeObserver = new ResizeObserver(() => {
      updateGlass()
    })
    resizeObserver.observe(navbarCard)

    return () => {
      resizeObserver.disconnect()
    }
  }, [navbarBlur, navbarRefraction])


  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
    router.refresh()
  }

  const mockUser = user || {
    id: 'design-user',
    email: 'design@example.com',
    created_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
  } as User

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-gray-300/30 ${inter.className}`}
    >
      <div 
        ref={navbarCardRef}
        className="liquid-glass-card absolute inset-0 w-full h-full relative overflow-hidden"
        style={{ borderRadius: '0' }}
      >
        {/* Liquid Glass Overlay Background */}
        <div className="lg-overlay-bg" />

        {/* Navbar Content */}
        <div ref={navbarContentRef} className="lg-content w-full h-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
            <div className="flex justify-between h-16 relative">
              <div className="flex items-center relative h-16">
                <div className="flex items-center relative z-10">
              {/* Toggle Sidebar Button - positioned to the left, double arrow */}
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg transition-all duration-300 flex items-center justify-center z-50 relative focus:outline-none"
                style={{ 
                  transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                  marginLeft: '-16px'
                }}
              >
                <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} style={{ marginRight: '-16px' }} />
                <ChevronLeft className="w-5 h-5 text-white" strokeWidth={2.5} />
              </button>
              {/* Logo symbol - positioned between button and title, closer to title */}
              <div 
                ref={logoRef} 
                className="flex items-center mr-1 relative"
                style={{ 
                  height: `${logoSize}px`,
                  marginLeft: `${-40}px`,
                  marginTop: `${8}px`
                }}
              >
                <Image
                  src="/Branding/street-logo-only.svg"
                  alt="Logo"
                  width={logoSize}
                  height={logoSize}
                  className="drop-shadow-lg"
                  style={{ 
                    filter: 'brightness(0) invert(1)'
                  }}
                />
              </div>
              {/* Title - adjustable X position */}
              <Link href="/dashboard">
                <h1 ref={titleTextRef} className="text-xl font-semibold text-white px-4 cursor-pointer hover:opacity-80 transition-opacity" style={{ marginLeft: `${-80}px` }}>
                  {pageTitle}
                </h1>
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">{mockUser.email}</span>
            <button
              onClick={handleSignOut}
              className="bg-[#0F172A] text-white font-bold px-4 py-2 rounded-[20px] shadow-[0_20px_40px_rgba(15,23,42,0.25)] hover:shadow-[0_25px_50px_rgba(15,23,42,0.35)] hover:-translate-y-1 transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
        </div>
        </div>

        {/* Liquid Glass Filter Layer */}
        <div className="lg-filter-layer">
          <div ref={navbarBoxRef} id="liquid-glass-navbar" className="glass-box" />
        </div>
      </div>
    </nav>
  )
}

