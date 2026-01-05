'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardSidebar from '@/components/DashboardSidebar'
import NavigationBox from '@/components/NavigationBox'
import { Calendar, CreditCard, Clock, Lock, TrendingUp, BarChart3, PieChart, Search, X, MoreVertical, Maximize2, Building2, Calculator, Users, Wallet, LineChart, Smile } from 'lucide-react'
import Tutorial from '@/components/Tutorial'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)

  // Fetch the current user from Supabase
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
        
        if (!currentUser) {
          // Redirect to sign in if no user
          window.location.href = '/auth/signin'
          return
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        window.location.href = '/auth/signin'
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Check if this is first login and show tutorial
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial && user) {
      setTimeout(() => {
        setShowTutorial(true)
      }, 500)
    }
  }, [user])

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    localStorage.setItem('hasSeenTutorial', 'true')
  }

  const tutorialSteps = [
    {
      id: 'sidebar',
      title: 'Navigation Sidebar',
      description: 'Use the sidebar to navigate between different sections of your dashboard.',
      targetSelector: '[data-tutorial="sidebar"]',
    },
    {
      id: 'search',
      title: 'Search',
      description: 'Search across your dashboard to quickly find what you need.',
      targetSelector: '[data-tutorial="search"]',
    },
    {
      id: 'visa-card',
      title: 'Account Overview',
      description: 'View your account details, make transactions, and manage your cards here.',
      targetSelector: '[data-tutorial="visa-card"]',
    },
    {
      id: 'income-card',
      title: 'Income & Expenses',
      description: 'Track your total income and expenses with weekly, monthly, or yearly views.',
      targetSelector: '[data-tutorial="income-card"]',
    },
    {
      id: 'system-lock',
      title: 'System Status',
      description: 'Monitor your system lock status and growth rate progress.',
      targetSelector: '[data-tutorial="system-lock"]',
    },
    {
      id: 'yearly-chart',
      title: 'Yearly Comparison',
      description: 'Compare your performance across different years with interactive charts.',
      targetSelector: '[data-tutorial="yearly-chart"]',
    },
  ]

  const currentDate = new Date()
  const day = currentDate.getDate()
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' })
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' })

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
    <div className="min-h-screen relative page-transition bg-[#262624]">
      <DashboardSidebar isOpen={sidebarOpen} data-tutorial="sidebar" />
      <NavigationBox />
      <DashboardNavbar 
        pageTitle="Client Dashboard" 
        user={user} 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {showTutorial && (
        <Tutorial steps={tutorialSteps} onComplete={handleTutorialComplete} />
      )}
      
      {/* Dashboard Content */}
      <div 
        className="relative transition-all duration-300 ease-in-out overflow-y-auto"
        style={{
          marginLeft: sidebarOpen ? '256px' : '0',
          maxWidth: sidebarOpen ? 'calc(100% - 256px)' : '100%',
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
        }}
      >
        <div className="w-full px-6 py-5">
          {/* Top Section: Date and Help */}
          <div className="flex items-center justify-between mb-6">
            {/* Date Section */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e9ecef] flex items-center justify-center">
                <span className="text-2xl font-semibold text-[#212529]">{day}</span>
                        </div>
                        <div>
                <p className="text-sm font-medium text-[#212529]">{dayName}, {monthName}</p>
                        </div>
              <button className="card px-4 py-2 flex items-center gap-2 hover:bg-[#f8f9fa] transition-colors">
                <span className="text-xs font-medium text-[#212529]">Show my Tasks</span>
                <TrendingUp className="w-3 h-3 text-[#6c757d]" />
              </button>
              <button className="card p-2 hover:bg-[#f8f9fa] transition-colors relative">
                <Calendar className="w-4 h-4 text-[#6c757d]" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      </button>
                    </div>

            {/* Help Section */}
            <div className="flex items-center gap-3">
              <div>
                <h2 className="serif-heading text-2xl text-[#212529]">
                  Hey {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'}, Need help? 👋
                </h2>
                <p className="text-xs text-[#6c757d]">Just ask me anything!</p>
                    </div>
              <a 
                href="https://t.me/gruberlukas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="card w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#f8f9fa] transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 text-[#6c757d]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
                    </div>
                  </div>

          {/* Main Grid */}
          <div className="grid grid-cols-4 gap-4">
            {/* VISA Account Card */}
            <div className="card p-4" data-tutorial="visa-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#212529]">VISA</h3>
                <select className="text-xs text-[#6c757d] bg-transparent border-0 focus:outline-none">
                  <option>Direct Debits</option>
                </select>
              </div>
              <p className="text-xs text-[#6c757d] mb-3">Linked to main account</p>
              <p className="text-sm font-medium text-[#212529] mb-4">**** 2719</p>
              <div className="flex gap-2 mb-3">
                <button className="card px-3 py-1.5 bg-[#212529] text-white text-xs font-medium hover:bg-[#343a40] transition-colors flex-1">
                  Receive
                </button>
                <button className="card px-3 py-1.5 text-xs font-medium hover:bg-[#f8f9fa] transition-colors flex-1">
                  Send
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6c757d]">Monthly regular fee</span>
                <span className="font-medium text-[#212529]">$25.00</span>
              </div>
            </div>

            {/* Income/Paid Card */}
            <div className="card p-4" data-tutorial="income-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#6c757d]" />
                    <span className="text-xs text-[#6c757d]">Total income</span>
                  </div>
                  <select className="text-xs text-[#6c757d] bg-transparent border-0 focus:outline-none">
                    <option>Weekly</option>
                  </select>
                </div>
                <p className="text-lg font-semibold text-[#212529]">$23,194.80</p>
                
                <div className="border-t border-[#e9ecef] pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#6c757d]" />
                      <span className="text-xs text-[#6c757d]">Total paid</span>
                    </div>
                    <select className="text-xs text-[#6c757d] bg-transparent border-0 focus:outline-none">
                      <option>Weekly</option>
                    </select>
                  </div>
                  <p className="text-lg font-semibold text-[#212529]">$8,145.20</p>
                </div>
              </div>
            </div>

            {/* System Lock & Growth Rate Card */}
            <div className="card p-4" data-tutorial="system-lock">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#6c757d]" />
                  <span className="text-xs font-medium text-[#212529]">System Lock</span>
                  </div>
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#e9ecef"
                      strokeWidth="4"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#ff6b35"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 20 * 0.36} ${2 * Math.PI * 20}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-[#212529]">36%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#6c757d] mb-1">Growth rate</p>
              <p className="text-xl font-semibold text-[#212529] mb-1">13 Days</p>
              <p className="text-xs text-[#6c757d]">109 hours, 23 minutes</p>
            </div>

            {/* Yearly Comparison Chart */}
            <div className="card p-4" data-tutorial="yearly-chart">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="w-4 h-4 text-[#6c757d]" />
                <button className="card p-1 hover:bg-[#f8f9fa] transition-colors">
                  <Maximize2 className="w-3 h-3 text-[#6c757d]" />
                </button>
              </div>
              <p className="text-lg font-semibold text-[#212529] mb-4">$16,073.49</p>
              <div className="h-24 flex items-end gap-2">
                <div className="flex-1 bg-[#e9ecef] rounded-t" style={{ height: '40%' }}></div>
                <div className="flex-1 bg-[#e9ecef] rounded-t" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-[#ff6b35] rounded-t" style={{ height: '80%' }}></div>
                <div className="flex-1 bg-[#ff6b35] rounded-t" style={{ height: '100%' }}></div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#6c757d] rounded-full"></div>
                  <span className="text-[#6c757d]">2022</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full"></div>
                  <span className="text-[#6c757d]">2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-5 gap-4 mt-4">
            {/* Annual Profits */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#212529]">Annual profits</h3>
                <select className="text-xs text-[#6c757d] bg-transparent border-0 focus:outline-none">
                  <option>2023</option>
                </select>
              </div>
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32">
                  <circle cx="64" cy="64" r="60" fill="#fff5f0" />
                  <circle cx="64" cy="64" r="45" fill="#ffe0d1" />
                  <circle cx="64" cy="64" r="30" fill="#ffc9a8" />
                  <circle cx="64" cy="64" r="15" fill="#ff6b35" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#212529]">$4K</span>
                </div>
              </div>
            </div>

            {/* Activity Manager */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#212529]">Activity manager</h3>
                <div className="flex items-center gap-1">
                  <button className="card p-1 hover:bg-[#f8f9fa] transition-colors">
                    <MoreVertical className="w-3 h-3 text-[#6c757d]" />
                  </button>
                  <button className="card p-1 hover:bg-[#f8f9fa] transition-colors">
                    <Maximize2 className="w-3 h-3 text-[#6c757d]" />
                  </button>
                  <button className="card p-1 hover:bg-[#f8f9fa] transition-colors">
                    <Search className="w-3 h-3 text-[#6c757d]" />
                  </button>
                </div>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6c757d]" />
                <input
                  type="text"
                  placeholder="Search in activities..."
                  className="input pl-7 text-xs py-1.5"
                />
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="card px-2 py-0.5 text-xs text-[#6c757d] flex items-center gap-1">
                  Team
                  <X className="w-3 h-3" />
                </span>
                <span className="card px-2 py-0.5 text-xs text-[#6c757d] flex items-center gap-1">
                  Insights
                  <X className="w-3 h-3" />
                </span>
                <span className="card px-2 py-0.5 text-xs text-[#6c757d] flex items-center gap-1">
                  Today
                  <X className="w-3 h-3" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#212529]">$43.20 USD</span>
                <div className="flex gap-0.5">
                  <div className="w-1 h-6 bg-[#ff6b35] rounded"></div>
                  <div className="w-1 h-4 bg-[#e9ecef] rounded"></div>
                  <div className="w-1 h-8 bg-[#ff6b35] rounded"></div>
                </div>
              </div>
                  </div>

            {/* Business Plans */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#212529]">Business plans</h3>
                <button className="card p-1 hover:bg-[#f8f9fa] transition-colors">
                  <MoreVertical className="w-3 h-3 text-[#6c757d]" />
                </button>
                  </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#6c757d]" />
                  <span className="text-xs text-[#212529]">Bank loans</span>
                  <TrendingUp className="w-3 h-3 text-[#6c757d] ml-auto" />
                  </div>
                  <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#6c757d]" />
                  <span className="text-xs text-[#212529]">Accounting</span>
                  </div>
                  <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6c757d]" />
                  <span className="text-xs text-[#212529]">HR management</span>
                </div>
              </div>
                    </div>

            {/* Wallet Verification */}
            <div className="card p-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-[#fff5f0] flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-[#ff6b35]" />
                    </div>
                  </div>
              <h3 className="text-sm font-medium text-[#212529] mb-1">Wallet Verification</h3>
              <p className="text-xs text-[#6c757d] mb-3">Enable 2-step verification to secure your wallet.</p>
              <button className="card px-4 py-2 bg-[#ff6b35] text-white text-xs font-medium hover:bg-[#e55a2b] transition-colors w-full">
                Enable
              </button>
                  </div>

            {/* Main Stocks & Review Rating */}
            <div className="card p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <LineChart className="w-4 h-4 text-[#6c757d]" />
                  <button className="card p-1 hover:bg-[#f8f9fa] transition-colors">
                    <X className="w-3 h-3 text-[#6c757d]" />
                  </button>
                </div>
                <div className="h-16 bg-[#f8f9fa] rounded mb-2 flex items-center justify-center">
                  <div className="flex items-end gap-1">
                    <div className="w-1 h-4 bg-[#6c757d] rounded"></div>
                    <div className="w-1 h-6 bg-[#6c757d] rounded"></div>
                    <div className="w-1 h-8 bg-[#ff6b35] rounded"></div>
                    <div className="w-1 h-10 bg-[#ff6b35] rounded"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-[#212529]">Main Stocks</p>
                <p className="text-xs text-[#6c757d]">Extended & Limited</p>
                <span className="text-xs text-green-600 font-medium">+9.3%</span>
                        </div>
              
              <div className="border-t border-[#e9ecef] pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[#212529]">Review rating</h3>
                  <MoreVertical className="w-3 h-3 text-[#6c757d]" />
                      </div>
                <p className="text-xs text-[#6c757d] mb-3">How is your business management going?</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        i === 3 ? 'bg-[#ff6b35]' : 'bg-[#f8f9fa] hover:bg-[#e9ecef]'
                      }`}
                    >
                      <Smile className={`w-4 h-4 ${i === 3 ? 'text-white' : 'text-[#6c757d]'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
    </div>
  )
}
