
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type PracticeAreaDetailPageProps = {
  params: Promise<{ slug: string }>
}

type PracticeAreaSEO = {
  title?: string | null
  slug?: string | null
  shortDescription?: string | null
  description?: unknown
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

function getImageUrl(image: unknown): string | null {
  if (!image || typeof image !== 'object') return null

  const record = image as {
    url?: string | null
  }

  if (!record.url) return null

  return record.url.startsWith('http')
    ? record.url
    : `${SITE_URL}${record.url}`
}

function getRichText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''

  const record = value as Record<string, unknown>

  if (typeof record.text === 'string') {
    return record.text
  }

  if (Array.isArray(record.children)) {
    return record.children
      .map(getRichText)
      .filter(Boolean)
      .join(' ')
  }

  if (record.root) {
    return getRichText(record.root)
  }

  return ''
}

export async function generateMetadata({
  params,
}: PracticeAreaDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'practice-areas',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const practiceArea = result.docs[0] as PracticeAreaSEO | undefined

  if (!practiceArea) {
    return {
      title: 'Practice Area Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title =
    practiceArea.meta?.title?.trim() ||
    `${practiceArea.title || 'Practice Area'} | Practice Area`

  const description =
    practiceArea.meta?.description?.trim() ||
    practiceArea.shortDescription?.trim() ||
    getRichText(practiceArea.description).slice(0, 160) ||
    `Learn more about our ${practiceArea.title || 'legal'} services and how our attorneys can assist you.`

  const image = practiceArea.meta?.image

  const imageUrl = getImageUrl(image)

  const imageAlt =
    image && typeof image === 'object' && 'alt' in image
      ? (image as { alt?: string | null }).alt || practiceArea.title || 'Practice Area'
      : practiceArea.title || 'Practice Area'

  const canonicalUrl = `${SITE_URL}/practice-areas/${slug}`

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
            alt: imageAlt,
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

export default async function PracticeAreaDetailPage({
  params,
}: PracticeAreaDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'practice-areas',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const practiceArea = result.docs[0]

  if (!practiceArea) {
    notFound()
  }

  const hasServices = Boolean(
    practiceArea.services && practiceArea.services.length > 0,
  )

  return (
    <main className="bg-white">
      {/* Practice Area Introduction Banner */}
      <section className="relative overflow-hidden bg-[#182A3A] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B58B60]/10 via-transparent to-transparent opacity-80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-3.5 flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#B58B60]" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B60]">
              Practice Area
            </p>
            <span className="h-px w-6 bg-[#B58B60]" />
          </div>

          <h1 className="font-serif text-3xl font-normal leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {practiceArea.title}
          </h1>

          {practiceArea.shortDescription && (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#F3EEE5]/90 sm:text-base">
              {practiceArea.shortDescription}
            </p>
          )}
        </div>
      </section>

      {/* Full Description & Legal Analysis */}
      {practiceArea.description && (
        <section className="py-14 sm:py-16 md:py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-6 font-serif text-2xl font-normal text-[#182A3A] sm:text-3xl">
              Understanding Our {practiceArea.title} Services
            </h2>

            <div className="max-w-none text-base leading-relaxed text-[#526171] [&_p]:mb-5 [&_strong]:font-semibold [&_strong]:text-[#182A3A] [&_a]:text-[#B58B60] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B58B60] [&_blockquote]:pl-4 [&_blockquote]:italic">
              <RichText data={practiceArea.description} />
            </div>
          </div>
        </section>
      )}

      {/* Scope of Representation / Specific Services */}
      {hasServices && (
        <section className="border-t border-stone-200/60 bg-[#F3EEE5]/50 py-14 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="mb-3 flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-[#B58B60]" />
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                  Scope of Representation
                </p>
                <span className="h-px w-6 bg-[#B58B60]" />
              </div>

              <h2 className="font-serif text-2xl font-normal text-[#182A3A] sm:text-3xl md:text-4xl">
                Our {practiceArea.title} Services
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {practiceArea.services?.map((item) => (
                <div
                  key={item.id}
                  className="group border border-stone-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#B58B60]/50 hover:shadow-md"
                >
                  <div className="mb-4 h-0.5 w-7 bg-[#B58B60] transition-all duration-300 group-hover:w-12" />

                  <h3 className="font-serif text-lg font-normal text-[#182A3A] transition-colors group-hover:text-[#B58B60]">
                    {item.service}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Integrated Consultation Banner */}
      <section className="border-t border-stone-200 bg-white py-14 text-center sm:py-16">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-2xl font-normal text-[#182A3A] sm:text-3xl">
            Discuss Your {practiceArea.title} Matter
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#526171]">
            Our attorneys offer practical counsel and dedicated representation for complex legal challenges.
          </p>

          <div className="mt-7">
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center bg-[#182A3A] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md transition-all duration-300 hover:bg-[#34495A]"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
