
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import React from 'react'
import './styles.css'

import { VisualEditing } from '@payload-inline-visual-editor/react'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RefreshRouteOnSave } from '@/components/preview/RefreshRouteOnSave'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

const DEFAULT_DESCRIPTION =
  'A trusted legal partner providing professional legal services, expert legal guidance, and dedicated client support.'

async function getSiteSettings() {
  const payload = await getPayloadClient()

  return payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const siteName = settings.siteName || 'Law Firm'

  const siteDescription =
    settings.siteDescription || DEFAULT_DESCRIPTION

  const favicon =
    typeof settings.favicon === 'object' && settings.favicon !== null
      ? settings.favicon.url
      : null

  const defaultTitle = `${siteName} | Trusted Legal Services`

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    ),

    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },

    description: siteDescription,

    icons: favicon
      ? {
          icon: favicon,
          shortcut: favicon,
          apple: favicon,
        }
      : undefined,

    openGraph: {
      type: 'website',
      siteName,
      title: defaultTitle,
      description: siteDescription,
    },

    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: siteDescription,
    },

    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled } = await draftMode()

  return (
    <html lang="en">
      <body>
        <RefreshRouteOnSave />

        <VisualEditing
          serverURL={
            process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
          }
          draft={isEnabled}
        />

        <Header />

        {children}

        <Footer />
      </body>
    </html>
  )
}
