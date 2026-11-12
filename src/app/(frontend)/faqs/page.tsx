
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData('faqs')

  const title = page?.meta?.title || 'Frequently Asked Questions | Legal Services'

  const description =
    page?.meta?.description ||
    'Find answers to frequently asked questions about our legal services and processes.'

  const image =
    typeof page?.meta?.image === 'object' && page.meta.image !== null
      ? page.meta.image
      : null

  const imageUrl = image?.url
    ? image.url.startsWith('http')
      ? image.url
      : `${SITE_URL}${image.url}`
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/faqs`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/faqs`,
      siteName: 'Legal Services',
      type: 'website',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt || 'Frequently Asked Questions',
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function FAQsPage() {
  const page = await getPageData('faqs')

  if (!page) {
    notFound()
  }

  return (
    <PageLayoutRenderer
      layout={page.layout ?? []}
      pageSlug="faqs"
      allFaqs={page.allFaqs ?? []}
    />
  )
}
