'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardSidebar from '@/components/DashboardSidebar'
import NavigationBox from '@/components/NavigationBox'
import { Calendar, CreditCard, Clock, Lock, TrendingUp, BarChart3, PieChart, Search, X, MoreVertical, Maximize2, Building2, Calculator, Users, Wallet, LineChart, Smile, Github, ArrowRight } from 'lucide-react'
import Tutorial from '@/components/Tutorial'
import GitHubAppInstall from '@/components/GitHubAppInstall'
import Link from 'next/link'

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
    {
      id: 'annual-profits',
      title: 'Annual Profits',
      description: 'View your annual profit breakdown with interactive charts and year-over-year comparisons.',
      targetSelector: '[data-tutorial="annual-profits"]',
    },
    {
      id: 'activity-manager',
      title: 'Activity Manager',
      description: 'Search and filter your activities, track spending, and manage team insights.',
      targetSelector: '[data-tutorial="activity-manager"]',
    },
    {
      id: 'business-plans',
      title: 'Business Plans',
      description: 'Access your business plans including bank loans, accounting, and HR management.',
      targetSelector: '[data-tutorial="business-plans"]',
    },
    {
      id: 'wallet-verification',
      title: 'Wallet Security',
      description: 'Enable 2-step verification to secure your wallet and protect your assets.',
      targetSelector: '[data-tutorial="wallet-verification"]',
    },
    {
      id: 'stocks-rating',
      title: 'Stocks & Ratings',
      description: 'Monitor your main stocks performance and provide feedback on business management.',
      targetSelector: '[data-tutorial="stocks-rating"]',
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
          <p className="mt-4 text-[#d4d4d1]">Loading...</p>
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
              <div className="w-16 h-16 rounded-full bg-[#30302E] border border-[#3a3a38] flex items-center justify-center">
                <span className="text-2xl font-semibold text-[#FAF9F6]">{day}</span>
                        </div>
                        <div>
                <p className="text-sm font-medium text-[#FAF9F6]">{dayName}, {monthName}</p>
                        </div>
              <button className="card px-4 py-2 flex items-center gap-2 hover:bg-[#3a3a38] transition-colors">
                <span className="text-xs font-medium text-[#FAF9F6]">Show my Tasks</span>
                <TrendingUp className="w-3 h-3 text-[#d4d4d1]" />
              </button>
              <button className="card p-2 hover:bg-[#3a3a38] transition-colors relative">
                <Calendar className="w-4 h-4 text-[#d4d4d1]" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      </button>
                    </div>

            {/* Help Section */}
            <div className="flex items-center gap-3">
              <div>
                <h2 className="serif-heading text-2xl text-[#FAF9F6]">
                  Hey {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'}, Need help? 👋
                </h2>
                <p className="text-xs text-[#d4d4d1]">Just ask me anything!</p>
                    </div>
              <a 
                href="https://t.me/gruberlukas" 
                target="_blank" 
                rel="noopener noreferrer"
                className="card w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#3a3a38] transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 text-[#d4d4d1]" viewBox="0 0 24 24" fill="currentColor">
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
                <h3 className="text-sm font-medium text-[#FAF9F6]">VISA</h3>
                <select className="text-xs text-[#d4d4d1] bg-transparent border-0 focus:outline-none">
                  <option>Direct Debits</option>
                </select>
              </div>
              <p className="text-xs text-[#d4d4d1] mb-3">Linked to main account</p>
              <p className="text-sm font-medium text-[#FAF9F6] mb-4">**** 2719</p>
              <div className="flex gap-2 mb-3">
                <button className="card px-3 py-1.5 bg-[#FAF9F6] text-[#262624] text-xs font-medium hover:bg-[#e8e7e4] transition-colors flex-1">
                  Receive
                </button>
                <button className="card px-3 py-1.5 text-xs font-medium text-[#FAF9F6] hover:bg-[#3a3a38] transition-colors flex-1">
                  Send
                </button>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#d4d4d1]">Monthly regular fee</span>
                <span className="font-medium text-[#FAF9F6]">$25.00</span>
              </div>
            </div>

            {/* Income/Paid Card */}
            <div className="card p-4" data-tutorial="income-card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#d4d4d1]" />
                    <span className="text-xs text-[#d4d4d1]">Total income</span>
                  </div>
                  <select className="text-xs text-[#d4d4d1] bg-transparent border-0 focus:outline-none">
                    <option>Weekly</option>
                  </select>
                </div>
                <p className="text-lg font-semibold text-[#FAF9F6]">$23,194.80</p>
                
                <div className="border-t border-[#3a3a38] pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#d4d4d1]" />
                      <span className="text-xs text-[#d4d4d1]">Total paid</span>
                    </div>
                    <select className="text-xs text-[#d4d4d1] bg-transparent border-0 focus:outline-none">
                      <option>Weekly</option>
                    </select>
                  </div>
                  <p className="text-lg font-semibold text-[#FAF9F6]">$8,145.20</p>
                </div>
              </div>
            </div>

            {/* System Lock & Growth Rate Card */}
            <div className="card p-4" data-tutorial="system-lock">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#d4d4d1]" />
                  <span className="text-xs font-medium text-[#FAF9F6]">System Lock</span>
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
                    <span className="text-xs font-medium text-[#FAF9F6]">36%</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-[#d4d4d1] mb-1">Growth rate</p>
              <p className="text-xl font-semibold text-[#FAF9F6] mb-1">13 Days</p>
              <p className="text-xs text-[#d4d4d1]">109 hours, 23 minutes</p>
            </div>

            {/* Yearly Comparison Chart */}
            <div className="card p-4" data-tutorial="yearly-chart">
              <div className="flex items-center justify-between mb-3">
                <BarChart3 className="w-4 h-4 text-[#d4d4d1]" />
                <button className="card p-1 hover:bg-[#3a3a38] transition-colors">
                  <Maximize2 className="w-3 h-3 text-[#d4d4d1]" />
                </button>
              </div>
              <p className="text-lg font-semibold text-[#FAF9F6] mb-4">$16,073.49</p>
              <div className="h-24 flex items-end gap-2">
                <div className="flex-1 bg-[#3a3a38] rounded-t" style={{ height: '40%' }}></div>
                <div className="flex-1 bg-[#3a3a38] rounded-t" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-[#ff6b35] rounded-t" style={{ height: '80%' }}></div>
                <div className="flex-1 bg-[#ff6b35] rounded-t" style={{ height: '100%' }}></div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#d4d4d1] rounded-full"></div>
                  <span className="text-[#d4d4d1]">2022</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#ff6b35] rounded-full"></div>
                  <span className="text-[#d4d4d1]">2023</span>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub Integration Card - Quick Access */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#30302E] border border-[#3a3a38] flex items-center justify-center">
                    <Github className="w-6 h-6 text-[#0066cc]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-[#FAF9F6] mb-1">GitHub Development Activity</h3>
                    <p className="text-xs text-[#d4d4d1]">
                      Track your development progress and contributions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GitHubAppInstall compact={true} />
                  <Link
                    href="/dev-update"
                    className="card px-4 py-2 text-xs font-medium text-[#FAF9F6] hover:bg-[#3a3a38] transition-colors flex items-center gap-2"
                  >
                    View Activity
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-5 gap-4 mt-4">
            {/* Annual Profits */}
            <div className="card p-4" data-tutorial="annual-profits">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#FAF9F6]">Annual profits</h3>
                <select className="text-xs text-[#d4d4d1] bg-transparent border-0 focus:outline-none">
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
                  <span className="text-xs font-medium text-[#FAF9F6]">$4K</span>
                </div>
              </div>
            </div>

            {/* Activity Manager */}
            <div className="card p-4" data-tutorial="activity-manager">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#FAF9F6]">Activity manager</h3>
                <div className="flex items-center gap-1">
                  <button className="card p-1 hover:bg-[#3a3a38] transition-colors">
                    <MoreVertical className="w-3 h-3 text-[#d4d4d1]" />
                  </button>
                  <button className="card p-1 hover:bg-[#3a3a38] transition-colors">
                    <Maximize2 className="w-3 h-3 text-[#d4d4d1]" />
                  </button>
                  <button className="card p-1 hover:bg-[#3a3a38] transition-colors">
                    <Search className="w-3 h-3 text-[#d4d4d1]" />
                  </button>
                </div>
              </div>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#d4d4d1]" />
                <input
                  type="text"
                  placeholder="Search in activities..."
                  className="input pl-7 text-xs py-1.5"
                />
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="card px-2 py-0.5 text-xs text-[#d4d4d1] flex items-center gap-1">
                  Team
                  <X className="w-3 h-3" />
                </span>
                <span className="card px-2 py-0.5 text-xs text-[#d4d4d1] flex items-center gap-1">
                  Insights
                  <X className="w-3 h-3" />
                </span>
                <span className="card px-2 py-0.5 text-xs text-[#d4d4d1] flex items-center gap-1">
                  Today
                  <X className="w-3 h-3" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#FAF9F6]">$43.20 USD</span>
                <div className="flex gap-0.5">
                  <div className="w-1 h-6 bg-[#ff6b35] rounded"></div>
                  <div className="w-1 h-4 bg-[#3a3a38] rounded"></div>
                  <div className="w-1 h-8 bg-[#ff6b35] rounded"></div>
                </div>
              </div>
                  </div>

            {/* Business Plans */}
            <div className="card p-4" data-tutorial="business-plans">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[#FAF9F6]">Business plans</h3>
                <button className="card p-1 hover:bg-[#3a3a38] transition-colors">
                  <MoreVertical className="w-3 h-3 text-[#d4d4d1]" />
                </button>
                  </div>
              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#d4d4d1]" />
                  <span className="text-xs text-[#FAF9F6]">Bank loans</span>
                  <TrendingUp className="w-3 h-3 text-[#d4d4d1] ml-auto" />
                  </div>
                  <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#d4d4d1]" />
                  <span className="text-xs text-[#FAF9F6]">Accounting</span>
                  </div>
                  <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#d4d4d1]" />
                  <span className="text-xs text-[#FAF9F6]">HR management</span>
                </div>
              </div>
                    </div>

            {/* Wallet Verification */}
            <div className="card p-4" data-tutorial="wallet-verification">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-[#fff5f0] flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-[#ff6b35]" />
                    </div>
                  </div>
              <h3 className="text-sm font-medium text-[#FAF9F6] mb-1">Wallet Verification</h3>
              <p className="text-xs text-[#d4d4d1] mb-3">Enable 2-step verification to secure your wallet.</p>
              <button className="card px-4 py-2 bg-[#ff6b35] text-white text-xs font-medium hover:bg-[#e55a2b] transition-colors w-full">
                Enable
              </button>
                  </div>

            {/* Main Stocks & Review Rating */}
            <div className="card p-4" data-tutorial="stocks-rating">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <LineChart className="w-4 h-4 text-[#d4d4d1]" />
                  <button className="card p-1 hover:bg-[#3a3a38] transition-colors">
                    <X className="w-3 h-3 text-[#d4d4d1]" />
                  </button>
                </div>
                <div className="h-16 bg-[#262624] rounded mb-2 flex items-center justify-center">
                  <div className="flex items-end gap-1">
                    <div className="w-1 h-4 bg-[#d4d4d1] rounded"></div>
                    <div className="w-1 h-6 bg-[#d4d4d1] rounded"></div>
                    <div className="w-1 h-8 bg-[#ff6b35] rounded"></div>
                    <div className="w-1 h-10 bg-[#ff6b35] rounded"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-[#FAF9F6]">Main Stocks</p>
                <p className="text-xs text-[#d4d4d1]">Extended & Limited</p>
                <span className="text-xs text-green-400 font-medium">+9.3%</span>
                        </div>
              
              <div className="border-t border-[#3a3a38] pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-[#FAF9F6]">Review rating</h3>
                  <MoreVertical className="w-3 h-3 text-[#d4d4d1]" />
                      </div>
                <p className="text-xs text-[#d4d4d1] mb-3">How is your business management going?</p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        i === 3 ? 'bg-[#ff6b35]' : 'bg-[#30302E] hover:bg-[#3a3a38]'
                      }`}
                    >
                      <Smile className={`w-4 h-4 ${i === 3 ? 'text-[#262624]' : 'text-[#d4d4d1]'}`} />
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
