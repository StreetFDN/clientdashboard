'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Code, Play, TrendingUp } from 'lucide-react'

interface DashboardSidebarProps {
  isOpen: boolean
}

export default function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
  const pathname = usePathname()

  const generalItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  const updateItems = [
    { href: '/dev-update', label: 'Dev Update', icon: Code },
    { href: '/execution-update', label: 'Execution Update', icon: Play },
    { href: '/signal-update', label: 'Signal Update', icon: TrendingUp },
  ]

  return (
    <div
      className="fixed left-0 border-r border-gray-200 z-40 w-64 bg-gray-50"
      style={{ 
        top: '64px',
        height: 'calc(100vh - 64px)',
        borderTopLeftRadius: '0px',
        borderBottomLeftRadius: '0px',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '24px',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <div className="p-4">
        {/* Menu Items */}
        <nav className="space-y-4">
          {/* GENERAL Section */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              GENERAL
            </div>
            <div className="space-y-1">
              {generalItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? 'text-black font-semibold bg-gray-200/50'
                        : 'text-black/80 hover:bg-gray-100/50 hover:text-black'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-300 my-2"></div>

          {/* UPDATES Section */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3">
              UPDATES
            </div>
            <div className="space-y-1">
              {updateItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? 'text-black font-semibold bg-gray-200/50'
                        : 'text-black/80 hover:bg-gray-100/50 hover:text-black'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

