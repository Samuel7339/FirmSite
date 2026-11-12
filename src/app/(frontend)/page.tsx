
import type { Metadata } from 'next'
import { getHomePageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'
import { RefreshRouteOnSave } from '@/components/preview/RefreshRouteOnSave'

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export async function generateMetadata(): Promise<Metadata> {
  const homePage = await getHomePageData()

  const title = homePage?.meta?.title || 'Home | Legal Services'

  const description =
    homePage?.meta?.description ||
    'Professional legal services and trusted legal guidance. Contact our team to discuss your needs.'

  const image =
    typeof homePage?.meta?.image === 'object' &&
    homePage.meta.image !== null
      ? homePage.meta.image
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
      canonical: SITE_URL,
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: 'Legal Services',
      type: 'website',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt || 'Our Law Firm',
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

export default async function HomePage() {
  const homePage = await getHomePageData()

  if (!homePage) {
    return <main>Homepage not available.</main>
  }

  return (
    <main>
      <RefreshRouteOnSave />
      <PageLayoutRenderer layout={homePage.layout} />
    </main>
  )
}
