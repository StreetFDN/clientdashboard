'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface DashboardSidebarProps {
  isOpen: boolean
}

export default function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
  const pathname = usePathname()

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dev-update', label: 'Dev Update' },
    { href: '/execution-update', label: 'Execution Update' },
    { href: '/signal-update', label: 'Signal Update' },
  ]

  return (
    <div
      className="fixed left-0 border-r border-white/20 z-40 w-64"
      style={{ 
        backgroundColor: '#f7f7f7',
        top: '64px',
        height: 'calc(100vh - 64px)',
        borderTopLeftRadius: '24px',
        borderBottomLeftRadius: '0px',
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <div className="p-4">
        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 relative ${
                  isActive
                    ? 'text-black font-semibold'
                    : 'text-black/80 hover:bg-white/30 hover:text-black'
                }`}
              >
                {/* Active indicator bar - dark gray bump on the left */}
                {isActive && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gray-700 rounded-r"
                    style={{ borderRadius: '0 4px 4px 0' }}
                  />
                )}
                {isOpen && <span className="whitespace-nowrap ml-0">{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

