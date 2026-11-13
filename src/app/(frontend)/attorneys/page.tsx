
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData('attorneys')

  if (!page) {
    return {
      title: 'Attorneys',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title =
    page.meta?.title?.trim() || 'Our Attorneys | Legal Services'

  const description =
    page.meta?.description?.trim() ||
    'Meet our experienced attorneys and learn about their legal expertise, qualifications, and commitment to serving clients.'

  const image =
    typeof page.meta?.image === 'object' && page.meta.image !== null
      ? page.meta.image
      : null

  const imageUrl = image?.url
    ? image.url.startsWith('http')
      ? image.url
      : `${SITE_URL}${image.url}`
    : undefined

  const canonicalUrl = `${SITE_URL}/attorneys`

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: 'website',
      title,
      description,
      url: canonicalUrl,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            alt: image?.alt || 'Our Attorneys',
          },
        ],
      }),
    },

    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl && {
        images: [imageUrl],
      }),
    },
  }
}

export default async function AttorneysPage() {
  const page = await getPageData('attorneys')

  if (!page) {
    notFound()
  }

  return (
    <main>
      <PageLayoutRenderer layout={page.layout} pageId={page.id}/>
    </main>
  )
}
