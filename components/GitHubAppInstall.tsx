'use client'

import { useState, useEffect } from 'react'
import { Github, Check, ExternalLink, AlertCircle, Link2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getAuthRedirectUrl } from '@/lib/auth-utils'
import type { GitHubAppInstallation } from '@/types/github'

interface GitHubAppInstallProps {
  onInstallComplete?: () => void
  compact?: boolean
}

export default function GitHubAppInstall({ onInstallComplete, compact = false }: GitHubAppInstallProps) {
  const [installation, setInstallation] = useState<GitHubAppInstallation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [installing, setInstalling] = useState(false)
  const [githubConnected, setGithubConnected] = useState(false)
  const [checkingConnection, setCheckingConnection] = useState(true)

  useEffect(() => {
    checkGitHubConnection()
    checkInstallation()
  }, [])

  const checkGitHubConnection = async () => {
    try {
      setCheckingConnection(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if user has GitHub provider linked
        const { data: { identities } } = await supabase.auth.getUserIdentities()
        const hasGithub = identities?.some(identity => identity.provider === 'github')
        setGithubConnected(!!hasGithub)
      }
    } catch (err) {
      console.error('Error checking GitHub connection:', err)
    } finally {
      setCheckingConnection(false)
    }
  }

  const handleConnectGitHub = async () => {
    try {
      setError(null)
      const redirectUrl = getAuthRedirectUrl('/dev-update?github_connected=true')
      
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
        },
      })

      if (oauthError) {
        setError(oauthError.message)
      }
    } catch (err) {
      setError('Failed to connect GitHub account')
      console.error('Error connecting GitHub:', err)
    }
  }

  const checkInstallation = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/github/installation', {
        credentials: 'include', // Ensure cookies are sent
      })
      
      if (!response.ok) {
        throw new Error('Failed to check installation status')
      }

      const data = await response.json()
      setInstallation(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check installation')
    } finally {
      setLoading(false)
    }
  }

  const handleInstall = () => {
    if (!installation?.install_url) {
      setError('Installation URL not configured')
      return
    }

    setInstalling(true)
    
    // Open GitHub app installation in new window
    const installWindow = window.open(
      installation.install_url,
      'github-install',
      'width=800,height=600,scrollbars=yes'
    )

    // Listen for installation completion
    // Poll more frequently at first, then slow down
    let pollCount = 0
    const maxPolls = 60 // 2 minutes total (60 * 2s)
    
    const checkInterval = setInterval(async () => {
      pollCount++
      try {
        // Force a fresh check by calling checkInstallation
        await checkInstallation()
        
        // Check if installation is now detected
        const response = await fetch('/api/github/installation', {
          credentials: 'include',
          cache: 'no-store', // Don't cache, always get fresh data
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.installed) {
            clearInterval(checkInterval)
            setInstalling(false)
            setInstallation(data)
            if (installWindow) {
              installWindow.close()
            }
            if (onInstallComplete) {
              onInstallComplete()
            }
          } else {
            // Update state even if not installed yet (for UI feedback)
            setInstallation(data)
          }
        }
      } catch (err) {
        console.error('Error checking installation:', err)
      }
      
      // Stop polling after max attempts
      if (pollCount >= maxPolls) {
        clearInterval(checkInterval)
        setInstalling(false)
        setError('Installation check timed out. Please refresh the page.')
      }
    }, 2000) // Check every 2 seconds

    // Cleanup after max time
    setTimeout(() => {
      clearInterval(checkInterval)
      setInstalling(false)
    }, 120000) // 2 minutes total
  }

  if (loading || checkingConnection) {
    return (
      <div className="card p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0066cc]"></div>
      </div>
    )
  }

  // Step 1: Connect GitHub Account (if not connected)
  if (!githubConnected) {
    return (
      <div className={`card p-${compact ? '3' : '4'} ${compact ? '' : 'flex flex-col gap-4'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#30302E] border border-[#3a3a38] flex items-center justify-center">
            <Link2 className="w-5 h-5 text-[#FAF9F6]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-[#FAF9F6]">Connect GitHub Account</h3>
            {!compact && (
              <p className="text-xs text-[#d4d4d1] mt-1">
                Link your GitHub account first to ensure proper installation tracking
              </p>
            )}
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg text-red-400 text-xs">
            {error}
          </div>
        )}
        
        <button
          onClick={handleConnectGitHub}
          disabled={loading}
          className="w-full px-4 py-2 bg-[#0066cc] text-white rounded-lg font-medium hover:bg-[#0052a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Github className="w-4 h-4" />
          <span>Connect with GitHub</span>
        </button>
        
        {!compact && (
          <p className="text-xs text-[#d4d4d1] text-center">
            After connecting, you'll be able to install the GitHub App
          </p>
        )}
      </div>
    )
  }

  if (error && !githubConnected) {
    return (
      <div className="card p-4 flex items-center gap-3 text-red-400">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm">{error}</span>
      </div>
    )
  }

  if (installation?.installed) {
    return (
      <div className={`card p-${compact ? '3' : '4'} flex items-center gap-3 ${compact ? '' : 'flex-col'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-900/20 border border-green-800/50 flex items-center justify-center">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#FAF9F6]">GitHub App Installed</p>
            {installation.account && (
              <p className="text-xs text-[#d4d4d1]">
                Connected to {installation.account.login}
              </p>
            )}
          </div>
        </div>
        {!compact && (
          <button
            onClick={checkInstallation}
            className="text-xs text-[#0066cc] hover:text-[#0080ff] hover:underline"
          >
            Refresh status
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`card p-${compact ? '3' : '4'} ${compact ? '' : 'flex flex-col gap-4'}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#30302E] border border-[#3a3a38] flex items-center justify-center">
          <Github className="w-5 h-5 text-[#FAF9F6]" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-[#FAF9F6]">Connect GitHub</h3>
          {!compact && (
            <p className="text-xs text-[#d4d4d1] mt-1">
              Install the GitHub App to track your development activity
            </p>
          )}
        </div>
      </div>
      
      <button
        onClick={handleInstall}
        disabled={installing || !installation?.install_url}
        className="w-full px-4 py-2 bg-[#0066cc] text-white rounded-lg font-medium hover:bg-[#0052a3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {installing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Installing...</span>
          </>
        ) : (
          <>
            <Github className="w-4 h-4" />
            <span>Install GitHub App</span>
            <ExternalLink className="w-3 h-3" />
          </>
        )}
      </button>
    </div>
  )
}

