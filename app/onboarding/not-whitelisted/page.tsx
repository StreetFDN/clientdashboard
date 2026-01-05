'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { MessageCircle, ArrowRight } from 'lucide-react'

export default function NotWhitelistedPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null)

  const handleYes = () => {
    window.open('https://t.me/gruberlukas', '_blank')
  }

  const handleNo = () => {
    window.location.href = 'https://apply.street.app'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#262624]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/Branding/street-logo.png"
            alt="Street Labs"
            width={120}
            height={42}
            className="object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <h1 className="serif-heading text-3xl text-[#FAF9F6] mb-4">
            You are not whitelisted to the client dashboard yet.
          </h1>
          <p className="text-sm text-[#d4d4d1] mb-8">
            Are you a client of Street Labs and think this is a mistake?
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <button
            onClick={handleYes}
            onMouseEnter={() => setSelected('yes')}
            onMouseLeave={() => setSelected(null)}
            className="w-full card p-6 flex items-center justify-between hover:bg-[#3a3a38] transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-[#FAF9F6]" />
              <span className="text-[#FAF9F6] font-medium">Yes</span>
            </div>
            {selected === 'yes' && (
              <div className="text-left">
                <p className="text-xs text-[#d4d4d1]">Reach Out</p>
              </div>
            )}
          </button>

          <button
            onClick={handleNo}
            onMouseEnter={() => setSelected('no')}
            onMouseLeave={() => setSelected(null)}
            className="w-full card p-6 flex items-center justify-between hover:bg-[#3a3a38] transition-colors"
          >
            <div className="flex items-center gap-3">
              <ArrowRight className="w-5 h-5 text-[#FAF9F6]" />
              <span className="text-[#FAF9F6] font-medium">No</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

