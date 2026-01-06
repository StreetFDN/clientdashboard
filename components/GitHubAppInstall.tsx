'use client'

import { useState, useEffect } from 'react'
import { Github, Check, ExternalLink, AlertCircle } from 'lucide-react'
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

  useEffect(() => {
    checkInstallation()
  }, [])

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

    // Listen for installation completion (you may need to implement a callback endpoint)
    const checkInterval = setInterval(async () => {
      try {
        await checkInstallation()
        if (installation?.installed) {
          clearInterval(checkInterval)
          setInstalling(false)
          if (installWindow) {
            installWindow.close()
          }
          if (onInstallComplete) {
            onInstallComplete()
          }
        }
      } catch (err) {
        console.error('Error checking installation:', err)
      }
    }, 2000)

    // Cleanup after 5 minutes
    setTimeout(() => {
      clearInterval(checkInterval)
      setInstalling(false)
    }, 300000)
  }

  if (loading) {
    return (
      <div className="card p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0066cc]"></div>
      </div>
    )
  }

  if (error) {
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

