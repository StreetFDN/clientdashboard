'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Inter } from 'next/font/google'
import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardSidebar from '@/components/DashboardSidebar'
import NavigationBox from '@/components/NavigationBox'

const inter = Inter({ subsets: ['latin'] })

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

  const videoRef = useRef<HTMLVideoElement>(null)

  // Ensure video plays
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log('Video autoplay prevented:', err)
      })
    }
  }, [])



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
        
        {/* Dashboard Content over video */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            {/* Top Row - 3 KPI Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Page Views Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Page Views</h3>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900">12,450</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-600 font-medium">15.8%</span>
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>

              {/* Total Revenue Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900">$363.95</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-red-600 font-medium">34.0%</span>
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Bounce Rate Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600">Bounce Rate</h3>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                <div className="mb-2">
                  <p className="text-2xl font-bold text-gray-900">86.5%</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-green-600 font-medium">24.2%</span>
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Row - 2 Chart Cards */}
            <div className="grid grid-cols-2 gap-6">
              {/* Sales Overview Card */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Sales Overview</h3>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-gray-900">$9,257.51</p>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-green-600 font-medium">15.8%</span>
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">+ $143.50 increased</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
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
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Total Subscriber</h3>
                    </div>
                  </div>
                  <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                  </select>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <p className="text-2xl font-bold text-gray-900">24,473</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-green-600 font-medium">8.3%</span>
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
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
      </div>

    </div>
  )
}

