'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Check, X, Edit2, Save } from 'lucide-react'

export default function AdminDashboard() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [whitelist, setWhitelist] = useState<any[]>([])
  const [searchEmail, setSearchEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editStartupName, setEditStartupName] = useState('')
  const [editHasLaunchedToken, setEditHasLaunchedToken] = useState<boolean | null>(null)
  const [editHasLiveToken, setEditHasLiveToken] = useState<boolean | null>(null)
  const [editTokenContract, setEditTokenContract] = useState('')

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

  const startEditing = (entry: any) => {
    setEditingEntry(entry.id)
    setEditStartupName(entry.startup_name || '')
    setEditHasLaunchedToken(entry.has_launched_token)
    setEditHasLiveToken(entry.has_live_token)
    setEditTokenContract(entry.token_contract || '')
  }

  const cancelEditing = () => {
    setEditingEntry(null)
    setEditStartupName('')
    setEditHasLaunchedToken(null)
    setEditHasLiveToken(null)
    setEditTokenContract('')
  }

  const saveEntry = async (email: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/whitelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          startup_name: editStartupName,
          has_launched_token: editHasLaunchedToken,
          has_live_token: editHasLiveToken,
          token_contract: editHasLiveToken ? editTokenContract : null,
        }),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update entry')
      }
      
      cancelEditing()
      await loadWhitelist()
    } catch (error: any) {
      console.error('Error updating entry:', error)
      alert(error.message || 'Error updating entry')
    } finally {
      setLoading(false)
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
                className="p-4 bg-[#262624] rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
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
                  <div className="flex items-center gap-2">
                    {editingEntry === entry.id ? (
                      <>
                        <button
                          onClick={() => saveEntry(entry.email)}
                          disabled={loading}
                          className="card p-2 hover:bg-green-500/20 transition-colors"
                        >
                          <Save className="w-4 h-4 text-green-400" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={loading}
                          className="card p-2 hover:bg-red-500/20 transition-colors"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(entry)}
                          disabled={loading}
                          className="card p-2 hover:bg-[#3a3a38] transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-[#FAF9F6]" />
                        </button>
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
                      </>
                    )}
                  </div>
                </div>

                {editingEntry === entry.id ? (
                  <div className="space-y-3 pt-3 border-t border-[#3a3a38]">
                    <div>
                      <label className="block text-xs text-[#d4d4d1] mb-1">Startup Name</label>
                      <input
                        type="text"
                        value={editStartupName}
                        onChange={(e) => setEditStartupName(e.target.value)}
                        placeholder="Enter startup name"
                        className="input w-full text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#d4d4d1] mb-2">Has Launched ERC-S Token</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`token-${entry.id}`}
                            checked={editHasLaunchedToken === true}
                            onChange={() => setEditHasLaunchedToken(true)}
                            className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                          />
                          <span className="text-sm text-[#FAF9F6]">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`token-${entry.id}`}
                            checked={editHasLaunchedToken === false}
                            onChange={() => setEditHasLaunchedToken(false)}
                            className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                          />
                          <span className="text-sm text-[#FAF9F6]">No</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#d4d4d1] mb-2">Has Live Token</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`live-token-${entry.id}`}
                            checked={editHasLiveToken === true}
                            onChange={() => {
                              setEditHasLiveToken(true)
                              if (!editHasLiveToken) setEditTokenContract('')
                            }}
                            className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                          />
                          <span className="text-sm text-[#FAF9F6]">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`live-token-${entry.id}`}
                            checked={editHasLiveToken === false}
                            onChange={() => {
                              setEditHasLiveToken(false)
                              setEditTokenContract('')
                            }}
                            className="w-4 h-4 border-[#3a3a38] bg-[#30302E] text-[#0066cc] focus:ring-[#0066cc]"
                          />
                          <span className="text-sm text-[#FAF9F6]">No</span>
                        </label>
                      </div>
                      {editHasLiveToken === true && (
                        <div className="mt-3">
                          <label className="block text-xs text-[#d4d4d1] mb-1">Token Contract</label>
                          <input
                            type="text"
                            value={editTokenContract}
                            onChange={(e) => setEditTokenContract(e.target.value)}
                            placeholder="Enter token contract address"
                            className="input w-full text-sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-[#3a3a38] space-y-1">
                    <p className="text-xs text-[#d4d4d1]">
                      Startup: <span className="text-[#FAF9F6]">{entry.startup_name || 'Not set'}</span>
                    </p>
                    <p className="text-xs text-[#d4d4d1]">
                      ERC-S Token: <span className="text-[#FAF9F6]">
                        {entry.has_launched_token === true ? 'Yes' : entry.has_launched_token === false ? 'No' : 'Not set'}
                      </span>
                    </p>
                    <p className="text-xs text-[#d4d4d1]">
                      Live Token: <span className="text-[#FAF9F6]">
                        {entry.has_live_token === true ? 'Yes' : entry.has_live_token === false ? 'No' : 'Not set'}
                      </span>
                    </p>
                    {entry.has_live_token === true && entry.token_contract && (
                      <p className="text-xs text-[#d4d4d1]">
                        Token Contract: <span className="text-[#FAF9F6] font-mono">{entry.token_contract}</span>
                      </p>
                    )}
                  </div>
                )}
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

