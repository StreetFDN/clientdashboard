'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface NavigationBoxProps {
  onBoxBlurChange?: (value: number) => void
  onBoxRefractionChange?: (value: number) => void
  onNavbarBlurChange?: (value: number) => void
  onNavbarRefractionChange?: (value: number) => void
}

export default function NavigationBox({ 
  onBoxBlurChange, 
  onBoxRefractionChange,
  onNavbarBlurChange,
  onNavbarRefractionChange
}: NavigationBoxProps) {
  const [boxBlur, setBoxBlur] = useState(0.0)
  const [boxRefraction, setBoxRefraction] = useState(200)
  const [navbarBlur, setNavbarBlur] = useState(1.0)
  const [navbarRefraction, setNavbarRefraction] = useState(20)

  useEffect(() => {
    if (onBoxBlurChange) onBoxBlurChange(boxBlur)
  }, [boxBlur, onBoxBlurChange])

  useEffect(() => {
    if (onBoxRefractionChange) onBoxRefractionChange(boxRefraction)
  }, [boxRefraction, onBoxRefractionChange])

  useEffect(() => {
    if (onNavbarBlurChange) onNavbarBlurChange(navbarBlur)
  }, [navbarBlur, onNavbarBlurChange])

  useEffect(() => {
    if (onNavbarRefractionChange) onNavbarRefractionChange(navbarRefraction)
  }, [navbarRefraction, onNavbarRefractionChange])

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

      {/* Control Sliders */}
      <div className="border-t pt-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Box Blur: {boxBlur.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={boxBlur}
            onChange={(e) => setBoxBlur(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Box Refraction: {boxRefraction}
          </label>
          <input
            type="range"
            min="0"
            max="300"
            step="1"
            value={boxRefraction}
            onChange={(e) => setBoxRefraction(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Navbar Blur: {navbarBlur.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={navbarBlur}
            onChange={(e) => setNavbarBlur(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Navbar Refraction: {navbarRefraction}
          </label>
          <input
            type="range"
            min="0"
            max="300"
            step="1"
            value={navbarRefraction}
            onChange={(e) => setNavbarRefraction(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}

