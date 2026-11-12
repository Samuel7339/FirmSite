
import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ),

  title: {
    default: 'Law Firm | Trusted Legal Services',
    template: '%s | Law Firm',
  },

  description:
    'A trusted legal partner providing professional legal services, expert legal guidance, and dedicated client support.',

  openGraph: {
    type: 'website',
    siteName: 'Law Firm',
    title: 'Law Firm | Trusted Legal Services',
    description:
      'A trusted legal partner providing professional legal services, expert legal guidance, and dedicated client support.',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Law Firm | Trusted Legal Services',
    description:
      'A trusted legal partner providing professional legal services, expert legal guidance, and dedicated client support.',
  },

  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />

        {children}

        <Footer />
      </body>
    </html>
  )
}
