'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardNavbar from '@/components/DashboardNavbar'
import DashboardSidebar from '@/components/DashboardSidebar'
import NavigationBox from '@/components/NavigationBox'
import GitHubAppInstall from '@/components/GitHubAppInstall'
import { GitHubActivityCard, GitHubActivitySummaryCard } from '@/components/GitHubActivityCard'
import type { GitHubActivitySummary } from '@/types/github'
import { Github, RefreshCw, Calendar, TrendingUp, CheckCircle } from 'lucide-react'

function DevUpdateContent() {
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [errorData, setErrorData] = useState<{ message?: string; authUrl?: string } | null>(null)
  const [summary, setSummary] = useState<GitHubActivitySummary | null>(null)
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week')
  const [showSuccess, setShowSuccess] = useState(false)

  const fetchActivity = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/github/activity?period=${period}`, {
        credentials: 'include', // Ensure cookies are sent
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        setErrorData(errorData)
        throw new Error(errorData.message || 'Failed to fetch activity')
      }
      
      const data = await response.json()
      setSummary(data)
      setErrorData(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load GitHub activity')
      console.error('Error fetching GitHub activity:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivity()
  }, [period])

  useEffect(() => {
    // Check for success message from callback
    if (searchParams.get('installed') === 'true') {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
      // Refresh activity after installation
      fetchActivity()
    }
    if (searchParams.get('error')) {
      setError(searchParams.get('error') || 'An error occurred')
    }
  }, [searchParams])

  const handleInstallComplete = () => {
    // Refresh activity after installation
    fetchActivity()
  }

  return (
    <div className="min-h-screen relative page-transition bg-[#262624]">
      <NavigationBox />
      <DashboardSidebar isOpen={sidebarOpen} />
      <DashboardNavbar 
        pageTitle="Dev Update" 
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
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
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="serif-heading text-3xl text-[#FAF9F6] mb-2">
                Development Activity
              </h1>
              <p className="text-sm text-[#d4d4d1]">
                Track your GitHub development progress and contributions
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <div className="flex items-center gap-2 card p-1">
                <button
                  onClick={() => setPeriod('week')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    period === 'week'
                      ? 'bg-[#0066cc] text-white'
                      : 'text-[#d4d4d1] hover:text-[#FAF9F6]'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setPeriod('month')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    period === 'month'
                      ? 'bg-[#0066cc] text-white'
                      : 'text-[#d4d4d1] hover:text-[#FAF9F6]'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setPeriod('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    period === 'all'
                      ? 'bg-[#0066cc] text-white'
                      : 'text-[#d4d4d1] hover:text-[#FAF9F6]'
                  }`}
                >
                  All Time
                </button>
              </div>
              <button
                onClick={fetchActivity}
                disabled={loading}
                className="card p-2 hover:bg-[#3a3a38] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-[#d4d4d1] ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="card p-4 mb-6 bg-green-900/20 border border-green-800/50">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-green-400">GitHub App installed successfully!</p>
                  <p className="text-xs text-green-300 mt-1">Your development activity is now being tracked.</p>
                </div>
              </div>
            </div>
          )}

          {/* GitHub App Installation */}
          <div className="mb-6">
            <GitHubAppInstall onInstallComplete={handleInstallComplete} />
          </div>

          {/* Error State */}
          {error && (
            <div className="card p-4 mb-6 bg-red-900/20 border border-red-800/50">
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-red-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-400">Failed to load activity</p>
                  <p className="text-xs text-red-300 mt-1">{error}</p>
                  {errorData?.message && (
                    <p className="text-xs text-red-200 mt-2">{errorData.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !summary && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
                <p className="text-sm text-[#d4d4d1]">Loading GitHub activity...</p>
              </div>
            </div>
          )}

          {/* Content Grid */}
          {summary && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Summary Card */}
              <div className="lg:col-span-1">
                <GitHubActivitySummaryCard summary={summary} />
              </div>

              {/* Activities List */}
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#FAF9F6]">Recent Activity</h3>
                    <span className="text-xs text-[#d4d4d1]">
                      {summary.activities.length} activities
                    </span>
                  </div>
                  
                  {summary.activities.length === 0 ? (
                    <div className="text-center py-12">
                      <Github className="w-12 h-12 text-[#d4d4d1] mx-auto mb-4 opacity-50" />
                      <p className="text-sm text-[#d4d4d1]">No activity found for this period</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {summary.activities.map((activity) => (
                        <GitHubActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Empty State - No Installation */}
          {!loading && !error && !summary && (
            <div className="card p-12 text-center">
              <Github className="w-16 h-16 text-[#d4d4d1] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-[#FAF9F6] mb-2">
                Connect GitHub to get started
              </h3>
              <p className="text-sm text-[#d4d4d1] mb-6">
                Install the GitHub App to track your development activity and contributions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DevUpdatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen relative page-transition bg-[#262624] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
          <p className="text-sm text-[#d4d4d1]">Loading...</p>
        </div>
      </div>
    }>
      <DevUpdateContent />
    </Suspense>
  )
}

