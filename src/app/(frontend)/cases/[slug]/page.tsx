
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type CaseDetailPageProps = {
  params: Promise<{ slug: string }>
}

type CaseSEO = {
  title: string
  slug: string
  summary?: string | null
  content?: unknown
  featuredImage?: string | {
    url?: string | null
    alt?: string | null
  } | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: string | {
      url?: string | null
      alt?: string | null
    } | null
  } | null
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

function getRichText(value: unknown): string {
  if (!value || typeof value !== 'object') {
    return ''
  }

  const node = value as {
    text?: string
    children?: unknown[]
    root?: {
      children?: unknown[]
    }
  }

  if (node.root?.children) {
    return node.root.children.map(getRichText).join(' ')
  }

  if (node.text) {
    return node.text
  }

  if (node.children) {
    return node.children.map(getRichText).join(' ')
  }

  return ''
}

export async function generateMetadata({
  params,
}: CaseDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'cases',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const caseStudy = result.docs[0] as CaseSEO | undefined

  if (!caseStudy) {
    return {
      title: 'Case Not Found',
    }
  }

  const title =
    caseStudy.meta?.title || `${caseStudy.title} | Case Results`

  const description =
    caseStudy.meta?.description ||
    caseStudy.summary ||
    getRichText(caseStudy.content) ||
    'Explore this case study and its legal resolution.'

  const metaImage =
    typeof caseStudy.meta?.image === 'object' &&
    caseStudy.meta.image !== null
      ? caseStudy.meta.image
      : null

  const featuredImage =
    typeof caseStudy.featuredImage === 'object' &&
    caseStudy.featuredImage !== null
      ? caseStudy.featuredImage
      : null

  const image = metaImage || featuredImage

  const imageUrl = image?.url
    ? image.url.startsWith('http')
      ? image.url
      : `${SITE_URL}${image.url}`
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/cases/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/cases/${slug}`,
      siteName: 'Legal Services',
      type: 'article',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt || caseStudy.title,
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

export default async function CaseDetailPage({
  params,
}: CaseDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'cases',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const caseStudy = result.docs[0]

  if (!caseStudy) {
    notFound()
  }

  const featuredImage =
    typeof caseStudy.featuredImage === 'object' &&
    caseStudy.featuredImage !== null
      ? caseStudy.featuredImage
      : null

  const practiceArea =
    typeof caseStudy.practiceArea === 'object' &&
    caseStudy.practiceArea !== null
      ? caseStudy.practiceArea
      : null

  const hasMetrics = Boolean(
    caseStudy.caseType || practiceArea || caseStudy.caseDate,
  )

  return (
    <main className="bg-white">
      {/* Case Study Header Banner */}
      <section className="relative overflow-hidden bg-[#182A3A] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B58B60]/10 via-transparent to-transparent opacity-80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#B58B60]" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B60]">
              Case Study
            </p>
            <span className="h-px w-6 bg-[#B58B60]" />
          </div>

          <h1 className="font-serif text-3xl font-normal leading-[1.2] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {caseStudy.title}
          </h1>

          {caseStudy.summary && (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#F3EEE5]/85 sm:text-base md:text-lg">
              {caseStudy.summary}
            </p>
          )}
        </div>
      </section>

      {/* Case Study Body */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          {/* Featured Image */}
          {featuredImage?.url && (
            <div className="mb-12 overflow-hidden border border-stone-200/80 bg-stone-100 shadow-lg">
              <img
                src={featuredImage.url}
                alt={featuredImage.alt || caseStudy.title}
                className="max-h-[500px] w-full object-cover"
              />
            </div>
          )}

          {/* Structured Case Details */}
          {hasMetrics && (
            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {caseStudy.caseType && (
                <div className="border border-stone-200 bg-[#F3EEE5] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                    Case Category
                  </p>
                  <p className="mt-1.5 font-serif text-base font-normal text-[#182A3A]">
                    {caseStudy.caseType}
                  </p>
                </div>
              )}

              {practiceArea && (
                <div className="border border-stone-200 bg-[#F3EEE5] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                    Practice Area
                  </p>
                  <p className="mt-1.5 font-serif text-base font-normal text-[#182A3A]">
                    {practiceArea.title}
                  </p>
                </div>
              )}

              {caseStudy.caseDate && (
                <div className="border border-stone-200 bg-[#F3EEE5] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                    Resolution Date
                  </p>
                  <p className="mt-1.5 font-serif text-base font-normal text-[#182A3A]">
                    {new Date(caseStudy.caseDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Final Outcome */}
          {caseStudy.outcome && (
            <div className="my-10 border border-stone-200/80 border-l-4 border-l-[#B58B60] bg-[#F3EEE5] p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                Final Outcome & Resolution
              </p>
              <h2 className="mt-2 font-serif text-2xl font-normal text-[#182A3A] sm:text-3xl">
                {caseStudy.outcome}
              </h2>
            </div>
          )}

          {/* Detailed Narrative */}
          {caseStudy.content && (
            <div className="py-6">
              <h2 className="mb-6 font-serif text-2xl font-normal text-[#182A3A] sm:text-3xl">
                Case Overview & Strategy
              </h2>

              <div className="max-w-none text-base leading-[1.8] text-[#526171] [&_p]:mb-5 [&_strong]:font-semibold [&_strong]:text-[#182A3A] [&_a]:text-[#B58B60] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B58B60] [&_blockquote]:pl-4 [&_blockquote]:italic">
                <RichText data={caseStudy.content} />
              </div>
            </div>
          )}

          {/* Back to Cases */}
          <div className="mt-12 border-t border-stone-200 pt-6">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B58B60] transition-colors hover:text-[#182A3A]"
            >
              <span>←</span>
              <span>All Cases & Results</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
