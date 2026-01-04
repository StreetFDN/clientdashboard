'use client'

import { useEffect, useRef, useState } from 'react'
import { Inter } from 'next/font/google'
import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardSidebar from '@/components/DashboardSidebar'
import NavigationBox from '@/components/NavigationBox'
import { redrawGlass } from '@/lib/liquid-glass'

const inter = Inter({ subsets: ['latin'] })

export default function SignalUpdatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Slider values for boxes (4 boxes)
  const [boxBlur, setBoxBlur] = useState(0.0)
  const [boxRefraction, setBoxRefraction] = useState(200)
  
  // Slider values for navbar
  const [navbarBlur, setNavbarBlur] = useState(1.0)
  const [navbarRefraction, setNavbarRefraction] = useState(20)

  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Refs for liquid glass effect - 4 boxes
  const welcomeCardRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const welcomeBoxRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]
  const welcomeContentRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)]

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay prevented:', err)
      })
    }
  }, [])

  // Initialize liquid glass effect for all 4 welcome boxes
  useEffect(() => {
    const observers: ResizeObserver[] = []

    welcomeCardRefs.forEach((cardRef, index) => {
      const boxRef = welcomeBoxRefs[index]
      const contentRef = welcomeContentRefs[index]
      
      if (!cardRef.current || !boxRef.current || !contentRef.current) return

      const welcomeCard = cardRef.current
      const welcomeBox = boxRef.current
      const welcomeContent = contentRef.current

      const updateGlass = () => {
        const rect = welcomeContent.getBoundingClientRect()
        const width = Math.round(rect.width)
        const height = Math.round(rect.height)

        welcomeBox.dataset.blur = boxBlur.toString()
        welcomeBox.dataset.strength = boxRefraction.toString()
        welcomeBox.dataset.saturate = '0.7'
        welcomeBox.dataset.brightness = '1.6'
        welcomeBox.dataset.cab = '0'
        welcomeBox.dataset.depth = '10'

        const overlayBg = welcomeCard.querySelector('.lg-overlay-bg') as HTMLElement
        const opacityValue = -0.15
        const clampedOpacity = Math.max(0, Math.min(1, opacityValue + 0.1))
        if (overlayBg) {
          overlayBg.style.background = `rgba(255, 255, 255, ${clampedOpacity})`
        }

        const currentBlur = parseFloat(welcomeBox.dataset.blur || '0')
        const chromaticAberration = parseFloat(welcomeBox.dataset.cab || '0')
        const depth = parseFloat(welcomeBox.dataset.depth || '10')
        const strength = parseFloat(welcomeBox.dataset.strength || '200')
        const saturate = parseFloat(welcomeBox.dataset.saturate || '1.2')
        const brightness = parseFloat(welcomeBox.dataset.brightness || '1.6')

        welcomeBox.style.height = `${height}px`
        welcomeBox.style.width = `${width}px`

        if (typeof window !== 'undefined') {
          const testEl = document.createElement('div')
          testEl.style.cssText = 'backdrop-filter: url(#test)'
          const supportsBackdropFilterUrl = testEl.style.backdropFilter === 'url(#test)' || testEl.style.backdropFilter === 'url("#test")'

          if (supportsBackdropFilterUrl) {
            redrawGlass(welcomeCard, welcomeBox, welcomeContent, {
              blur: currentBlur,
              strength,
              saturate,
              brightness,
              chromaticAberration,
              depth,
            })
          } else {
            ;(welcomeBox.style as any).webkitBackdropFilter = `blur(${width / 10}px) saturate(180%)`
          }
        }
      }

      updateGlass()

      const resizeObserver = new ResizeObserver(() => {
        updateGlass()
      })
      resizeObserver.observe(welcomeCard)
      observers.push(resizeObserver)
    })

    return () => {
      observers.forEach(observer => observer.disconnect())
    }
  }, [boxBlur, boxRefraction])

  return (
    <div className={`min-h-screen ${inter.className} relative page-transition`} style={{ backgroundColor: 'transparent' }}>
      <NavigationBox 
        onBoxBlurChange={setBoxBlur}
        onBoxRefractionChange={setBoxRefraction}
        onNavbarBlurChange={setNavbarBlur}
        onNavbarRefractionChange={setNavbarRefraction}
      />
      <DashboardSidebar isOpen={sidebarOpen} />
      <DashboardNavbar 
        pageTitle="Signal Update" 
        logoSize={200} 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        navbarBlur={navbarBlur}
        navbarRefraction={navbarRefraction}
      />

      {/* Video Background - Static at top, always full screen */}
      <div className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: 'none' }}
        >
          <source src="/videos/traffic1-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        
        {/* Welcome Boxes over video - 4 boxes in a square */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index}
                  ref={welcomeCardRefs[index]}
                  className="liquid-glass-card rounded-[48px] relative overflow-hidden shadow"
                >
                  {/* Liquid Glass Overlay Background */}
                  <div className="lg-overlay-bg" />

                  {/* Liquid Glass Content */}
                  <div ref={welcomeContentRefs[index]} className="lg-content p-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-black mb-3">
                        Weekly Signal Update
                      </h2>
                      <p className="text-black/90 mb-4">
                        Market signals and trend analysis
                      </p>
                      
                      <div className="text-left space-y-2 text-black/90 max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-3 text-black text-center">Signal Status</h3>
                        <p><strong>Signals Detected:</strong> 24</p>
                        <p><strong>Positive Signals:</strong> 18</p>
                        <p><strong>Negative Signals:</strong> 6</p>
                        <p><strong>Trend Direction:</strong> Upward</p>
                      </div>
                    </div>
                  </div>

                  {/* Liquid Glass Filter Layer */}
                  <div className="lg-filter-layer">
                    <div ref={welcomeBoxRefs[index]} id={`liquid-glass-signal-welcome-${index}`} className="glass-box" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
