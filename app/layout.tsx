import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavigationBox from '@/components/NavigationBox'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Client Dashboard',
  description: 'Secure client dashboard for account management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-black">
      <body className={`${inter.className} bg-black`}>
        {children}
      </body>
    </html>
  )
}

