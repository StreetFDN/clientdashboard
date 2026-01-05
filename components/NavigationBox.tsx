'use client'

import Link from 'next/link'

interface NavigationBoxProps {
}

export default function NavigationBox() {

  return (
    <div className="fixed top-1/2 right-10 z-20 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg -translate-y-1/2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Navigate Pages
      </label>
      <div className="flex flex-col gap-2 mb-6">
        <Link
          href="/"
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center"
        >
          Home
        </Link>
        <Link
          href="/auth/signin"
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center"
        >
          Sign Up
        </Link>
        <Link
          href="/dashboard"
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center"
        >
          Dashboard
        </Link>
        <Link
          href="/dev-update"
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center"
        >
          Dev Update
        </Link>
        <Link
          href="/execution-update"
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center"
        >
          Execution Update
        </Link>
        <Link
          href="/signal-update"
          className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-center"
        >
          Signal Update
        </Link>
      </div>

    </div>
  )
}

