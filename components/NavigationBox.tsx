'use client'

import { useState } from 'react'
import Link from 'next/link'
import Tutorial from './Tutorial'

interface NavigationBoxProps {
}

export default function NavigationBox() {
  const [showTutorial, setShowTutorial] = useState(false)

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

  const handleTutorialComplete = () => {
    setShowTutorial(false)
  }

  return (
    <>
      <div className="fixed top-1/2 right-10 z-20 card p-3 -translate-y-1/2">
        <label className="block text-xs font-medium text-[#6c757d] mb-2">
          Navigate Pages
        </label>
        <div className="flex flex-col gap-1.5 mb-3">
          <Link href="/" className="btn btn-secondary text-xs py-1.5 text-center">
            Home
          </Link>
          <Link href="/auth/signin" className="btn btn-secondary text-xs py-1.5 text-center">
            Login
          </Link>
          <Link href="/auth/signup" className="btn btn-secondary text-xs py-1.5 text-center">
            Sign Up
          </Link>
          <Link href="/dashboard" className="btn btn-secondary text-xs py-1.5 text-center">
            Dashboard
          </Link>
          <Link href="/dev-update" className="btn btn-secondary text-xs py-1.5 text-center">
            Dev Update
          </Link>
          <Link href="/execution-update" className="btn btn-secondary text-xs py-1.5 text-center">
            Execution Update
          </Link>
          <Link href="/signal-update" className="btn btn-secondary text-xs py-1.5 text-center">
            Signal Update
          </Link>
        </div>
        <button
          onClick={() => setShowTutorial(true)}
          className="btn btn-primary w-full text-xs py-1.5"
        >
          Play Tutorial
        </button>
      </div>

      {showTutorial && (
        <Tutorial steps={tutorialSteps} onComplete={handleTutorialComplete} />
      )}
    </>
  )
}

