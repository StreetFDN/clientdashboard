'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Menu, Search, User as UserIcon, LogOut, Settings } from 'lucide-react'

interface DashboardNavbarProps {
  pageTitle: string
  user?: User | null
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function DashboardNavbar({ 
  pageTitle, 
  user, 
  sidebarOpen, 
  onToggleSidebar 
}: DashboardNavbarProps) {
  const router = useRouter()
  const [searchFocused, setSearchFocused] = useState(false)
  const [canManageTeam, setCanManageTeam] = useState(false)

  useEffect(() => {
    const checkTeamAccess = async () => {
      if (!user) return
      
      try {
        const response = await fetch('/api/user/team-members')
        if (response.ok) {
          setCanManageTeam(true)
        }
      } catch (error) {
        // User doesn't have access to manage team
        setCanManageTeam(false)
      }
    }

    checkTeamAccess()
  }, [user])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#30302E] border-b border-[#3a3a38]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Menu, Logo, Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="card p-1.5 hover:bg-[#3a3a38] transition-colors"
              aria-label="Toggle sidebar"
              type="button"
            >
              <Menu className="w-4 h-4 text-[#6c757d]" />
            </button>
            
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <Image
                src="/Branding/street-logo.png"
                alt="Logo"
                width={60}
                height={21}
                className="object-contain"
              />
              <div className="h-4 w-px bg-[#3a3a38]"></div>
              <h1 className="text-sm font-normal text-[#FAF9F6] tracking-tight">
                {pageTitle}
              </h1>
            </Link>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-8" data-tutorial="search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4d4d1]" />
              <input
                type="text"
                placeholder="Search"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`input pl-10 w-full ${searchFocused ? 'ring-2 ring-[#0066cc]' : ''}`}
              />
            </div>
          </div>

          {/* Right: User, Settings, Sign Out */}
          <div className="flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span className="text-xs font-medium text-[#FAF9F6]">
                  {user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   user.email?.split('@')[0] || 
                   'User'}
                </span>
              </div>
            )}
            {canManageTeam && (
              <Link
                href="/settings"
                className="card p-1.5 hover:bg-[#3a3a38] transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 text-[#d4d4d1]" />
              </Link>
            )}
            <button
              className="card p-1.5 hover:bg-[#3a3a38] transition-colors"
              aria-label="Profile"
            >
              <UserIcon className="w-4 h-4 text-[#d4d4d1]" />
            </button>
            <button
              onClick={handleSignOut}
              className="card px-3 py-1.5 flex items-center gap-2 hover:bg-[#3a3a38] transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-[#d4d4d1]" />
              <span className="text-xs font-medium text-[#FAF9F6]">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
