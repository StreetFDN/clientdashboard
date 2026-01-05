'use client'

import { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { ChevronLeft, User as UserIcon, Search } from 'lucide-react'
import { redrawGlass } from '@/lib/liquid-glass'

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
  searchBarY?: number
  // Remove these props as they're no longer needed
}

export default function DashboardNavbar({ pageTitle, user, logoSize = 42, sidebarOpen, onToggleSidebar, logoX = 0, logoY = 0, titleX = 0, navbarBlur = 0.0, navbarRefraction = 75, searchBarY = 0 }: DashboardNavbarProps) {
  const router = useRouter()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchBlur, setSearchBlur] = useState(0.0)
  const searchBlurAnimationRef = useRef<number | null>(null)
  const currentSearchBlurRef = useRef(0.0)

  const titleTextRef = useRef<HTMLHeadingElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  
  // Refs for search bar liquid glass effect
  const searchCardRef = useRef<HTMLDivElement>(null)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const searchContentRef = useRef<HTMLDivElement>(null)
  
  // Refs for sign out button liquid glass effect
  const signOutCardRef = useRef<HTMLDivElement>(null)
  const signOutBoxRef = useRef<HTMLDivElement>(null)
  const signOutContentRef = useRef<HTMLDivElement>(null)

  // Initialize liquid glass effect for search bar
  useEffect(() => {
    if (!searchCardRef.current || !searchBoxRef.current || !searchContentRef.current) return

    const searchCard = searchCardRef.current
    const searchBox = searchBoxRef.current
    const searchContent = searchContentRef.current

    searchBox.dataset.strength = '75'
    searchBox.dataset.saturate = '0.7'
    searchBox.dataset.brightness = '1.6'
    searchBox.dataset.cab = '0'
    searchBox.dataset.depth = '10'

    const overlayBg = searchCard.querySelector('.lg-overlay-bg') as HTMLElement
    const opacityValue = -0.15
    const clampedOpacity = Math.max(0, Math.min(1, opacityValue + 0.1))
    if (overlayBg) {
      overlayBg.style.background = `rgba(255, 255, 255, ${clampedOpacity})`
    }

    const updateGlass = (blurValue: number) => {
      const rect = searchContent.getBoundingClientRect()
      const width = Math.round(rect.width)
      const height = Math.round(rect.height)

      searchBox.dataset.blur = blurValue.toString()
      searchBox.dataset.strength = '75'
      
      const chromaticAberration = parseFloat(searchBox.dataset.cab || '0')
      const depth = parseFloat(searchBox.dataset.depth || '10')
      const strength = 75
      const saturate = parseFloat(searchBox.dataset.saturate || '1.2')
      const brightness = parseFloat(searchBox.dataset.brightness || '1.6')

      searchBox.style.height = `${height}px`
      searchBox.style.width = `${width}px`

      if (typeof window !== 'undefined') {
        const testEl = document.createElement('div')
        testEl.style.cssText = 'backdrop-filter: url(#test)'
        const supportsBackdropFilterUrl = testEl.style.backdropFilter === 'url(#test)' || testEl.style.backdropFilter === 'url("#test")'

        if (supportsBackdropFilterUrl) {
          redrawGlass(searchCard, searchBox, searchContent, {
            blur: blurValue,
            strength,
            saturate,
            brightness,
            chromaticAberration,
            depth,
          })
        } else {
          ;(searchBox.style as any).webkitBackdropFilter = `blur(${width / 10}px) saturate(180%)`
        }
      }
    }

    // Animate blur transition
    const animateBlur = (targetBlur: number) => {
      if (searchBlurAnimationRef.current) {
        cancelAnimationFrame(searchBlurAnimationRef.current)
      }

      const startBlur = currentSearchBlurRef.current
      const startTime = performance.now()
      const duration = 750 // 0.75 seconds

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Ease-out function
        const eased = 1 - Math.pow(1 - progress, 3)
        const currentBlur = startBlur + (targetBlur - startBlur) * eased
        
        currentSearchBlurRef.current = currentBlur
        updateGlass(currentBlur)

        if (progress < 1) {
          searchBlurAnimationRef.current = requestAnimationFrame(animate)
        } else {
          currentSearchBlurRef.current = targetBlur
          updateGlass(targetBlur)
          searchBlurAnimationRef.current = null
        }
      }

      searchBlurAnimationRef.current = requestAnimationFrame(animate)
    }

    // Start animation when searchBlur changes
    animateBlur(searchBlur)

    const resizeObserver = new ResizeObserver(() => {
      updateGlass(currentSearchBlurRef.current)
    })
    resizeObserver.observe(searchCard)

    return () => {
      resizeObserver.disconnect()
      if (searchBlurAnimationRef.current) {
        cancelAnimationFrame(searchBlurAnimationRef.current)
      }
    }
  }, [searchBlur])

  // Initialize liquid glass effect for sign out button
  useEffect(() => {
    if (!signOutCardRef.current || !signOutBoxRef.current || !signOutContentRef.current) return

    const signOutCard = signOutCardRef.current
    const signOutBox = signOutBoxRef.current
    const signOutContent = signOutContentRef.current

    signOutBox.dataset.blur = navbarBlur.toString()
    signOutBox.dataset.strength = navbarRefraction.toString()
    signOutBox.dataset.saturate = '0.7'
    signOutBox.dataset.brightness = '1.6'
    signOutBox.dataset.cab = '0'
    signOutBox.dataset.depth = '10'

    const overlayBg = signOutCard.querySelector('.lg-overlay-bg') as HTMLElement
    const opacityValue = -0.15
    const clampedOpacity = Math.max(0, Math.min(1, opacityValue + 0.1))
    if (overlayBg) {
      overlayBg.style.background = `rgba(255, 255, 255, ${clampedOpacity})`
    }

    const updateGlass = () => {
      const rect = signOutContent.getBoundingClientRect()
      const width = Math.round(rect.width)
      const height = Math.round(rect.height)

      signOutBox.dataset.blur = navbarBlur.toString()
      signOutBox.dataset.strength = navbarRefraction.toString()
      
      const currentBlur = navbarBlur
      const chromaticAberration = parseFloat(signOutBox.dataset.cab || '0')
      const depth = parseFloat(signOutBox.dataset.depth || '10')
      const strength = navbarRefraction
      const saturate = parseFloat(signOutBox.dataset.saturate || '1.2')
      const brightness = parseFloat(signOutBox.dataset.brightness || '1.6')

      signOutBox.style.height = `${height}px`
      signOutBox.style.width = `${width}px`

      if (typeof window !== 'undefined') {
        const testEl = document.createElement('div')
        testEl.style.cssText = 'backdrop-filter: url(#test)'
        const supportsBackdropFilterUrl = testEl.style.backdropFilter === 'url(#test)' || testEl.style.backdropFilter === 'url("#test")'

        if (supportsBackdropFilterUrl) {
          redrawGlass(signOutCard, signOutBox, signOutContent, {
            blur: currentBlur,
            strength,
            saturate,
            brightness,
            chromaticAberration,
            depth,
          })
        } else {
          ;(signOutBox.style as any).webkitBackdropFilter = `blur(${width / 10}px) saturate(180%)`
        }
      }
    }

    updateGlass()

    const resizeObserver = new ResizeObserver(() => {
      updateGlass()
    })
    resizeObserver.observe(signOutCard)

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

  const navbarBgRef = useRef<HTMLDivElement>(null)

  // Update navbar background mask to create transparent cutouts for search bar and sign out button
  useEffect(() => {
    if (!navbarBgRef.current || !searchCardRef.current || !signOutCardRef.current) return

    const updateMask = () => {
      const navbarBg = navbarBgRef.current
      const searchCard = searchCardRef.current
      const signOutCard = signOutCardRef.current
      
      if (!navbarBg || !searchCard || !signOutCard) return

      const navbarRect = navbarBg.parentElement?.getBoundingClientRect()
      if (!navbarRect || !searchCardRef.current || !signOutCardRef.current) return

      const searchRect = searchCardRef.current.getBoundingClientRect()
      const signOutRect = signOutCardRef.current.getBoundingClientRect()

      // Calculate positions relative to navbar
      const searchLeft = searchRect.left - navbarRect.left
      const searchTop = searchRect.top - navbarRect.top
      const searchWidth = searchRect.width
      const searchHeight = searchRect.height

      const signOutLeft = signOutRect.left - navbarRect.left
      const signOutTop = signOutRect.top - navbarRect.top
      const signOutWidth = signOutRect.width
      const signOutHeight = signOutRect.height

      // Use CSS mask with subtract compositing to create rectangular cutouts
      // Create an SVG mask for precise rectangular cutouts
      const svgNS = 'http://www.w3.org/2000/svg'
      let maskId = 'navbar-mask'
      let existingMask = document.getElementById(maskId)
      if (existingMask) {
        existingMask.remove()
      }
      
      const svg = document.createElementNS(svgNS, 'svg')
      svg.setAttribute('id', maskId)
      svg.style.position = 'absolute'
      svg.style.width = '0'
      svg.style.height = '0'
      
      const defs = document.createElementNS(svgNS, 'defs')
      const mask = document.createElementNS(svgNS, 'mask')
      mask.setAttribute('id', 'navbar-cutout-mask')
      
      // White rectangle covering everything
      const whiteRect = document.createElementNS(svgNS, 'rect')
      whiteRect.setAttribute('width', navbarRect.width.toString())
      whiteRect.setAttribute('height', navbarRect.height.toString())
      whiteRect.setAttribute('fill', 'white')
      
      // Black rounded rectangles for cutouts (black = transparent in mask)
      // Search bar uses rounded-lg which is 8px border radius
      const searchBorderRadius = 8
      const searchCutout = document.createElementNS(svgNS, 'rect')
      searchCutout.setAttribute('x', searchLeft.toString())
      searchCutout.setAttribute('y', searchTop.toString())
      searchCutout.setAttribute('width', searchWidth.toString())
      searchCutout.setAttribute('height', searchHeight.toString())
      searchCutout.setAttribute('rx', searchBorderRadius.toString())
      searchCutout.setAttribute('ry', searchBorderRadius.toString())
      searchCutout.setAttribute('fill', 'black')
      
      // Sign out button uses rounded-[20px] which is 20px border radius
      const signOutBorderRadius = 20
      const signOutCutout = document.createElementNS(svgNS, 'rect')
      signOutCutout.setAttribute('x', signOutLeft.toString())
      signOutCutout.setAttribute('y', signOutTop.toString())
      signOutCutout.setAttribute('width', signOutWidth.toString())
      signOutCutout.setAttribute('height', signOutHeight.toString())
      signOutCutout.setAttribute('rx', signOutBorderRadius.toString())
      signOutCutout.setAttribute('ry', signOutBorderRadius.toString())
      signOutCutout.setAttribute('fill', 'black')
      
      mask.appendChild(whiteRect)
      mask.appendChild(searchCutout)
      mask.appendChild(signOutCutout)
      defs.appendChild(mask)
      svg.appendChild(defs)
      document.body.appendChild(svg)
      
      navbarBg.style.maskImage = `url(#navbar-cutout-mask)`
      navbarBg.style.webkitMaskImage = `url(#navbar-cutout-mask)`
    }

      updateMask()

      const resizeObserver = new ResizeObserver(updateMask)
      if (searchCardRef.current) resizeObserver.observe(searchCardRef.current)
      if (signOutCardRef.current) resizeObserver.observe(signOutCardRef.current)
    
    window.addEventListener('resize', updateMask)
    window.addEventListener('scroll', updateMask)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateMask)
      window.removeEventListener('scroll', updateMask)
    }
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 ${inter.className}`}
      style={{ backgroundColor: 'transparent' }}
    >
      {/* White background layer with cutouts */}
      <div 
        ref={navbarBgRef}
        className="absolute inset-0 bg-white pointer-events-none"
      />
      
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
                  marginLeft: '110px'
                }}
              >
                <ChevronLeft className="w-5 h-5 text-black" strokeWidth={2.5} style={{ marginRight: '-16px' }} />
                <ChevronLeft className="w-5 h-5 text-black" strokeWidth={2.5} />
              </button>
              {/* Logo symbol - positioned between button and title, closer to title */}
              <div 
                ref={logoRef} 
                className="flex items-center mr-1 relative"
                style={{ 
                  height: `${logoSize}px`,
                  marginLeft: `${-360}px`,
                  marginTop: `${8}px`
                }}
              >
                <Image
                  src="/Branding/street-logo2.png"
                  alt="Logo"
                  width={logoSize}
                  height={logoSize}
                  className="drop-shadow-lg"
                />
              </div>
              {/* Title - adjustable X position */}
              <Link href="/dashboard">
                <h1 ref={titleTextRef} className="text-xl font-semibold text-black px-4 cursor-pointer hover:opacity-80 transition-opacity" style={{ marginLeft: `${-95}px` }}>
                  {pageTitle}
                </h1>
              </Link>
            </div>
          </div>
          
          {/* Centered Search Bar */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center z-20" style={{ marginTop: `${13}px` }}>
            <div 
              ref={searchCardRef}
              className="liquid-glass-card rounded-lg relative overflow-hidden"
            >
              {/* Liquid Glass Overlay Background */}
              <div className="lg-overlay-bg" />

              {/* Liquid Glass Content */}
              <div ref={searchContentRef} className="lg-content" style={{ padding: 0, display: 'block', pointerEvents: 'auto' }}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white z-10 pointer-events-none transition-colors" />
                  <input
                    type="text"
                    placeholder="Search"
                    onFocus={() => {
                      setSearchFocused(true)
                      setSearchBlur(7.5)
                    }}
                    onBlur={() => {
                      setSearchFocused(false)
                      setSearchBlur(0.0)
                    }}
                    className="pl-10 pr-4 py-2 w-96 bg-transparent border border-transparent rounded-lg text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all pointer-events-auto"
                  />
                </div>
              </div>

              {/* Liquid Glass Filter Layer */}
              <div className="lg-filter-layer">
                <div 
                  ref={searchBoxRef} 
                  id="liquid-glass-search" 
                  className="glass-box"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 relative z-20">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none bg-white/50 backdrop-blur-sm"
              aria-label="Profile"
            >
              <UserIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div 
              ref={signOutCardRef}
              className="liquid-glass-card rounded-[20px] relative overflow-hidden"
            >
              {/* Liquid Glass Overlay Background */}
              <div className="lg-overlay-bg" />

              {/* Liquid Glass Content */}
              <div ref={signOutContentRef} className="lg-content" style={{ padding: 0, display: 'block', pointerEvents: 'auto' }}>
                <button
                  onClick={handleSignOut}
                  className="bg-transparent text-white font-bold px-4 py-2 rounded-[20px] hover:-translate-y-1 transition-all duration-300 relative z-10 pointer-events-auto"
                >
                  Sign Out
                </button>
              </div>

              {/* Liquid Glass Filter Layer */}
              <div className="lg-filter-layer">
                <div ref={signOutBoxRef} id="liquid-glass-signout" className="glass-box" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

