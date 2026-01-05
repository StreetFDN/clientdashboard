'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Check, X } from 'lucide-react'

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [whitelist, setWhitelist] = useState<any[]>([])
  const [searchEmail, setSearchEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const ADMIN_PASSWORD = 'FuckGabrielShapiro'

  useEffect(() => {
    if (authenticated) {
      loadWhitelist()
    }
  }, [authenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setPassword('')
    } else {
      alert('Incorrect password')
    }
  }

  const loadWhitelist = async () => {
    try {
      const response = await fetch('/api/admin/whitelist')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to load whitelist')
      }
      
      setWhitelist(result.data || [])
    } catch (error) {
      console.error('Error loading whitelist:', error)
    }
  }

  const toggleWhitelist = async (email: string, currentStatus: boolean) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/whitelist', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, is_whitelisted: !currentStatus }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update whitelist')
      }
      
      await loadWhitelist()
    } catch (error: any) {
      console.error('Error updating whitelist:', error)
      alert(error.message || 'Error updating whitelist')
    } finally {
      setLoading(false)
    }
  }

  const addToWhitelist = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      alert('Please enter a valid email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          is_whitelisted: true,
          onboarding_complete: false,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to add to whitelist')
      }
      
      setNewEmail('')
      await loadWhitelist()
    } catch (error: any) {
      console.error('Error adding to whitelist:', error)
      alert(error.message || 'Error adding to whitelist')
    } finally {
      setLoading(false)
    }
  }

  const filteredWhitelist = whitelist.filter((entry) =>
    entry.email.toLowerCase().includes(searchEmail.toLowerCase())
  )

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#262624]">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Image
              src="/Branding/street-logo.png"
              alt="Street Labs"
              width={120}
              height={42}
              className="object-contain"
            />
          </div>
          <div className="card p-6">
            <h1 className="serif-heading text-2xl text-[#FAF9F6] mb-2 text-center">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[#d4d4d1] text-center mb-4">Enter password to continue</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-[#FAF9F6] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Enter admin password"
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#FAF9F6] text-[#262624] rounded-lg font-medium hover:bg-[#e8e7e4] transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-[#262624]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="serif-heading text-3xl text-[#FAF9F6] mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[#d4d4d1]">Manage whitelist and user access</p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="card px-4 py-2 text-sm text-[#FAF9F6] hover:bg-[#3a3a38] transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Add New Email */}
        <div className="card p-4 mb-6">
          <div className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email to whitelist"
              className="input flex-1"
            />
            <button
              onClick={addToWhitelist}
              disabled={loading}
              className="card px-6 py-2 bg-[#FAF9F6] text-[#262624] font-medium hover:bg-[#e8e7e4] transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4d4d1]" />
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by email..."
              className="input pl-10"
            />
          </div>
        </div>

        {/* Whitelist Table */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-[#FAF9F6] mb-4">Whitelist</h2>
          <div className="space-y-3">
            {filteredWhitelist.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 bg-[#262624] rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#FAF9F6]">{entry.email}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        entry.is_whitelisted
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {entry.is_whitelisted ? 'Whitelisted' : 'Not Whitelisted'}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        entry.onboarding_complete
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {entry.onboarding_complete ? 'Onboarded' : 'Pending'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleWhitelist(entry.email, entry.is_whitelisted)}
                  disabled={loading}
                  className={`card p-2 ${
                    entry.is_whitelisted
                      ? 'hover:bg-red-500/20'
                      : 'hover:bg-green-500/20'
                  } transition-colors`}
                >
                  {entry.is_whitelisted ? (
                    <X className="w-4 h-4 text-red-400" />
                  ) : (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                </button>
              </div>
            ))}
            {filteredWhitelist.length === 0 && (
              <p className="text-center text-[#d4d4d1] py-8">No entries found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

