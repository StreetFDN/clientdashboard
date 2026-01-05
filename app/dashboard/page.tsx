'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Inter } from 'next/font/google'
import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardSidebar from '@/components/DashboardSidebar'
import NavigationBox from '@/components/NavigationBox'
import { Activity, TrendingUp, BarChart3, UserCircle, Filter, ArrowUpDown, MoreVertical, Maximize2, ArrowUp, ArrowDown, X } from 'lucide-react'
import { renderExpandedContent } from './expanded-content'

const inter = Inter({ subsets: ['latin'] })

export type BoxId = 'pageViews' | 'totalRevenue' | 'bounceRate' | 'salesOverview' | 'totalSubscriber'

interface BoxData {
  id: BoxId
  title: string
  value: string
  change: string
  changeType: 'up' | 'down'
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  type: 'kpi' | 'chart'
}

export default function DashboardPage() {
  // For design/testing purposes, allow access without authentication
  // Set a mock user to display the dashboard
  const [user, setUser] = useState<User | null>({
    id: 'design-user',
    email: 'design@example.com',
    created_at: new Date().toISOString(),
    email_confirmed_at: new Date().toISOString(),
  } as User)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [prevSidebarOpen, setPrevSidebarOpen] = useState(true) // Store previous sidebar state
  const [expandedBox, setExpandedBox] = useState<BoxId | null>(null)
  const [animationState, setAnimationState] = useState<'expanding' | 'collapsing' | 'idle'>('idle')

  const videoRef = useRef<HTMLVideoElement>(null)
  const buttonRefs = {
    pageViews: useRef<HTMLButtonElement>(null),
    totalRevenue: useRef<HTMLButtonElement>(null),
    bounceRate: useRef<HTMLButtonElement>(null),
    salesOverview: useRef<HTMLButtonElement>(null),
    totalSubscriber: useRef<HTMLButtonElement>(null),
  }

  const boxData: Record<BoxId, BoxData> = {
    pageViews: {
      id: 'pageViews',
      title: 'Page Views',
      value: '12,450',
      change: '15.8%',
      changeType: 'up',
      icon: <Activity className="w-5 h-5 text-blue-600" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      type: 'kpi',
    },
    totalRevenue: {
      id: 'totalRevenue',
      title: 'Total Revenue',
      value: '$363.95',
      change: '34.0%',
      changeType: 'down',
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      type: 'kpi',
    },
    bounceRate: {
      id: 'bounceRate',
      title: 'Bounce Rate',
      value: '86.5%',
      change: '24.2%',
      changeType: 'up',
      icon: <BarChart3 className="w-5 h-5 text-orange-600" />,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      type: 'kpi',
    },
    salesOverview: {
      id: 'salesOverview',
      title: 'Sales Overview',
      value: '$9,257.51',
      change: '15.8%',
      changeType: 'up',
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      type: 'chart',
    },
    totalSubscriber: {
      id: 'totalSubscriber',
      title: 'Total Subscriber',
      value: '24,473',
      change: '8.3%',
      changeType: 'up',
      icon: <UserCircle className="w-5 h-5 text-indigo-600" />,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      type: 'chart',
    },
  }

  // Ensure video plays
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay prevented:', err)
      })
    }
  }, [])

  const boxRefs = {
    pageViews: useRef<HTMLDivElement>(null),
    totalRevenue: useRef<HTMLDivElement>(null),
    bounceRate: useRef<HTMLDivElement>(null),
    salesOverview: useRef<HTMLDivElement>(null),
    totalSubscriber: useRef<HTMLDivElement>(null),
  }

  const getBoxPosition = (boxId: BoxId) => {
    const box = boxRefs[boxId].current
    if (!box) return { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 }
    
    const rect = box.getBoundingClientRect()
    // Get the box position, size, and center
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    return { 
      x: rect.left, 
      y: rect.top, 
      width: rect.width, 
      height: rect.height,
      centerX,
      centerY,
    }
  }

  // Update box position and size when box is expanded (for animation)
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 })
  const [expandedBoxSize, setExpandedBoxSize] = useState({ width: 0, height: 0 })

  const handleExpandBox = (boxId: BoxId) => {
    if (animationState !== 'idle') return

    if (expandedBox === boxId) {
      // Closing the box
      setAnimationState('collapsing')
      // Restore sidebar to previous state immediately (starts at same time as collapse)
      setSidebarOpen(prevSidebarOpen)
      setTimeout(() => {
        setExpandedBox(null)
        setAnimationState('idle')
      }, 300)
    } else {
      // Opening a box
      // Store current sidebar state
      setPrevSidebarOpen(sidebarOpen)
      // Hide sidebar if it's open
      if (sidebarOpen) {
        setSidebarOpen(false)
      }
      // Capture box position and size immediately before expanding
      const pos = getBoxPosition(boxId)
      setBoxPosition(pos)
      // Calculate expanded size (viewport minus padding and navbar)
      const expandedWidth = window.innerWidth - 48 // 24px padding on each side
      const expandedHeight = window.innerHeight - 64 - 48 // navbar + padding (24px top + 24px bottom)
      setExpandedBoxSize({ width: expandedWidth, height: expandedHeight })
      setExpandedBox(boxId)
      setAnimationState('expanding')
      setTimeout(() => {
        setAnimationState('idle')
      }, 300)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const currentBoxData = expandedBox ? boxData[expandedBox] : null

  return (
    <div className={`min-h-screen ${inter.className} relative page-transition`} style={{ backgroundColor: 'transparent' }}>
      <DashboardSidebar isOpen={sidebarOpen} />
      <NavigationBox />
      <DashboardNavbar 
        pageTitle="Client Dashboard" 
        user={user} 
        logoSize={200} 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
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
      </div>
      
      {/* Dashboard Content - Scrollable */}
      <div 
        className="relative transition-all duration-300 ease-in-out overflow-y-auto"
        style={{
          marginLeft: sidebarOpen ? '256px' : '0',
          maxWidth: sidebarOpen ? 'calc(100% - 256px)' : '100%',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
          opacity: expandedBox && animationState !== 'collapsing' ? 0 : 1,
          transform: expandedBox && animationState !== 'collapsing' ? 'scale(0.95)' : 'scale(1)',
          pointerEvents: expandedBox && animationState !== 'collapsing' ? 'none' : 'auto',
          zIndex: animationState === 'collapsing' ? 5 : 10,
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Row - 3 KPI Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {(Object.keys(boxData) as BoxId[]).filter(id => boxData[id].type === 'kpi').map((boxId) => {
                const data = boxData[boxId]
                return (
                  <div key={boxId} ref={boxRefs[boxId]} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${data.iconBg} rounded-lg flex items-center justify-center`}>
                          {data.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-600">{data.title}</h3>
                        </div>
                      </div>
                      <button
                        ref={buttonRefs[boxId]}
                        onClick={() => handleExpandBox(boxId)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <p className="text-2xl font-bold text-gray-900">{data.value}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className={`${data.changeType === 'up' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                        {data.change}
                      </span>
                      {data.changeType === 'up' ? (
                        <ArrowUp className={`w-4 h-4 text-green-600`} />
                      ) : (
                        <ArrowDown className={`w-4 h-4 text-red-600`} />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Row - 2 Chart Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Sales Overview Card */}
              <div ref={boxRefs.salesOverview} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Sales Overview</h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">$9,257.51</p>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-green-600 font-medium">15.8%</span>
                        <ArrowUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">+ $143.50 increased</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <Filter className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <ArrowUpDown className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      ref={buttonRefs.salesOverview}
                      onClick={() => handleExpandBox('salesOverview')}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="h-64 flex items-end justify-between gap-4 mb-4">
                  {/* Placeholder for chart bars */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t" style={{ height: '70%' }}></div>
                    <p className="text-xs text-gray-500 mt-2">Oct</p>
                    <p className="text-xs font-medium text-gray-700">$2,988.20</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t" style={{ height: '45%' }}></div>
                    <p className="text-xs text-gray-500 mt-2">Nov</p>
                    <p className="text-xs font-medium text-gray-700">$1,765.09</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-t" style={{ height: '90%' }}></div>
                    <p className="text-xs text-gray-500 mt-2">Dec</p>
                    <p className="text-xs font-medium text-gray-700">$4,005.65</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded"></div>
                    <span className="text-gray-600">China</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-400 rounded"></div>
                    <span className="text-gray-600">UE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">USA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-500 rounded"></div>
                    <span className="text-gray-600">Canada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-300 rounded"></div>
                    <span className="text-gray-600">Other</span>
                  </div>
                </div>
              </div>

              {/* Total Subscriber Card */}
              <div ref={boxRefs.totalSubscriber} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Total Subscriber</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
              <button
                      ref={buttonRefs.totalSubscriber}
                      onClick={() => handleExpandBox('totalSubscriber')}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                      <Maximize2 className="w-5 h-5" />
              </button>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-2xl font-bold text-gray-900">24,473</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-600 font-medium">8.3%</span>
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">+ 749 increased</p>
                </div>
                <div className="h-48 flex items-end justify-between gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                    const heights = [30, 45, 90, 50, 60, 40, 55]
                    const isHighlight = day === 'Tue'
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center">
                        <div 
                          className={`w-full rounded-t ${isHighlight ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-gray-200'}`}
                          style={{ height: `${heights[index]}%` }}
                        >
                          {isHighlight && (
                            <div className="text-white text-xs font-medium p-1">3,874</div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{day}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Expanded Box - Full Page */}
      {expandedBox && currentBoxData && (
        <div 
          className="fixed overflow-hidden"
          style={{
            top: '64px',
            left: '0',
            right: '0',
            bottom: '0',
            width: '100%',
            padding: '24px',
            zIndex: 20,
          }}
        >
          <div
            className="bg-white rounded-xl p-12 shadow-2xl relative overflow-y-auto"
            style={{
              width: animationState === 'expanding' || animationState === 'idle'
                ? `${expandedBoxSize.width || window.innerWidth - 48}px`
                : `${boxPosition.width || 300}px`,
              height: animationState === 'expanding' || animationState === 'idle'
                ? `${expandedBoxSize.height || window.innerHeight - 112}px`
                : `${boxPosition.height || 200}px`,
              left: animationState === 'expanding' || animationState === 'idle'
                ? '0'
                : `${boxPosition.x - 24}px`, // Subtract container padding
              top: animationState === 'expanding' || animationState === 'idle'
                ? '0'
                : `${boxPosition.y - 64 - 24}px`, // Subtract navbar height and container padding
              position: 'absolute',
              transition: animationState === 'expanding' || animationState === 'collapsing'
                ? 'width 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), height 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), top 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
                : 'none',
            }}
          >
            <button
              onClick={() => handleExpandBox(expandedBox)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-20"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div 
              className="h-full transition-opacity duration-300"
              style={{
                opacity: animationState === 'expanding' ? 0 : animationState === 'collapsing' ? 0 : 1,
              }}
            >
              {renderExpandedContent({
                boxId: expandedBox,
                title: currentBoxData.title,
                value: currentBoxData.value,
                change: currentBoxData.change,
                changeType: currentBoxData.changeType,
                iconBg: currentBoxData.iconBg,
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
