import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData('insights')

  const title = page?.meta?.title || 'Insights | Legal Services'
  const description =
    page?.meta?.description ||
    'Explore the latest legal insights, articles, and updates.'

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
      canonical: `${SITE_URL}/insights`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/insights`,
      siteName: 'Legal Services',
      type: 'website',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt || 'Legal Insights',
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

export default async function InsightsPage() {
  const page = await getPageData('insights')

  if (!page) {
    notFound()
  }

  return (
    <main>
      <PageLayoutRenderer layout={page.layout} pageId={page.id}/>
    </main>
  )
}