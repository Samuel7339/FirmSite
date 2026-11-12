
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type InsightDetailPageProps = {
  params: Promise<{ slug: string }>
}

type InsightSEO = {
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  content?: unknown
  featuredImage?: unknown
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
}: InsightDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const post = result.docs[0] as InsightSEO | undefined

  if (!post) {
    return {
      title: 'Article Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title =
    post.meta?.title?.trim() ||
    `${post.title || 'Legal Insight'} | Insights`

  const description =
    post.meta?.description?.trim() ||
    post.excerpt?.trim() ||
    getRichText(post.content).slice(0, 160) ||
    'Read the latest legal insights, articles, and updates from our firm.'

  const image =
    getImageUrl(post.meta?.image) ||
    getImageUrl(post.featuredImage)

  const canonicalUrl = `${SITE_URL}/insights/${slug}`

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: 'article',
      title,
      description,
      url: canonicalUrl,
      ...(image && {
        images: [
          {
            url: image,
            alt: post.title || 'Legal Insights',
          },
        ],
      }),
    },

    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image && {
        images: [image],
      }),
    },
  }
}

export default async function InsightDetailPage({
  params,
}: InsightDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const post = result.docs[0]

  if (!post) {
    notFound()
  }

  const featuredImage =
    typeof post.featuredImage === 'object' &&
    post.featuredImage !== null
      ? post.featuredImage
      : null

  const author =
    typeof post.author === 'object' && post.author !== null
      ? post.author
      : null

  const hasTags = Boolean(post.tags && post.tags.length > 0)

  return (
    <main className="bg-white">
      {/* Editorial Article Header */}
      <section className="relative overflow-hidden bg-[#182A3A] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B58B60]/10 via-transparent to-transparent opacity-80" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#B58B60]" />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B60]">
              Legal Insights
            </p>
            <span className="h-px w-6 bg-[#B58B60]" />
          </div>

          <h1 className="font-serif text-3xl font-normal leading-[1.18] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#F3EEE5]/85 sm:text-base md:text-lg">
              {post.excerpt}
            </p>
          )}

          {/* Author & Publication Metadata */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-wider text-stone-300">
            {author && (
              <span className="font-semibold text-[#D8C2A2]">
                By {author.name}
              </span>
            )}

            {post.publishedAt && (
              <>
                {author && <span className="text-stone-500">•</span>}
                <time dateTime={post.publishedAt} className="text-stone-300">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Editorial Image */}
      {featuredImage?.url && (
        <section className="bg-white pt-10 sm:pt-12">
          <div className="mx-auto max-w-4xl px-6">
            <div className="overflow-hidden border border-stone-200/80 bg-stone-100 shadow-lg">
              <img
                src={featuredImage.url}
                alt={featuredImage.alt || post.title}
                className="max-h-[500px] w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Main Article Reading Column */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <article className="max-w-none text-base leading-[1.8] text-[#526171] [&_p]:mb-6 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:text-[#182A3A] sm:[&_h2]:text-3xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-normal [&_h3]:text-[#182A3A] sm:[&_h3]:text-2xl [&_strong]:font-semibold [&_strong]:text-[#182A3A] [&_a]:text-[#B58B60] [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-[#182A3A] [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B58B60] [&_blockquote]:bg-[#F3EEE5]/40 [&_blockquote]:py-3.5 [&_blockquote]:px-6 [&_blockquote]:font-serif [&_blockquote]:text-lg [&_blockquote]:italic [&_blockquote]:text-[#182A3A]">
            <RichText data={post.content} />
          </article>

          {/* Related Tags */}
          {hasTags && (
            <div className="mt-14 border-t border-stone-200 pt-8">
              <h2 className="mb-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                Related Topics
              </h2>

              <div className="flex flex-wrap gap-2">
                {post.tags?.map((item) => (
                  <span
                    key={item.id}
                    className="border border-stone-200 bg-[#F3EEE5] px-3 py-1 text-xs font-medium text-[#182A3A]"
                  >
                    {item.tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Insights */}
          <div className="mt-12 border-t border-stone-100 pt-6">
            <Link
              href="/insights"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B58B60] transition-colors hover:text-[#182A3A]"
            >
              <span>←</span>
              <span>All Insights & Articles</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
