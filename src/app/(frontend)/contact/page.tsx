
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageData('contact')

  const title = page?.meta?.title || 'Contact Us | Legal Services'

  const description =
    page?.meta?.description ||
    'Contact our legal team to discuss your requirements and arrange a consultation.'

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
      canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/contact`,
      siteName: 'Legal Services',
      type: 'website',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt || 'Contact Us',
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

export default async function ContactPage() {
  const page = await getPageData('contact')

  if (!page) {
    notFound()
  }

  return (
    <main>
      <PageLayoutRenderer layout={page.layout} pageId={page.id}/>
    </main>
  )
}
