
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData('about')

  const title = page?.meta?.title || 'About Our Firm | Legal Services'

  const description =
    page?.meta?.description ||
    'Learn about our law firm, our values, experience, and commitment to our clients.'

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
      canonical: `${SITE_URL}/about`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/about`,
      siteName: 'Legal Services',
      type: 'website',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt || 'About Our Firm',
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

export default async function AboutPage() {
  const page = await getPageData('about')

  if (!page) {
    notFound()
  }

  return (
    <main>
      <PageLayoutRenderer layout={page.layout} />
    </main>
  )
}
