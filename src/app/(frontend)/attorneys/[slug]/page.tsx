
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type AttorneyDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

type AttorneySEO = {
  name?: string | null
  slug?: string | null
  shortBio?: string | null
  biography?: unknown
  portrait?: unknown
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
}

const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const SITE_NAME = 'Legal Services'

function getImageUrl(image: unknown): string | null {
  if (!image || typeof image !== 'object') return null

  const record = image as {
    url?: string | null
    filename?: string | null
  }

  if (record.url) {
    return record.url.startsWith('http')
      ? record.url
      : `${SITE_URL}${record.url}`
  }

  return null
}

function getBiographyText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''

  const record = value as Record<string, unknown>

  if (typeof record.text === 'string') {
    return record.text
  }

  if (Array.isArray(record.children)) {
    return record.children.map(getBiographyText).filter(Boolean).join(' ')
  }

  if (record.root) {
    return getBiographyText(record.root)
  }

  return ''
}

export async function generateMetadata({
  params,
}: AttorneyDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'attorneys',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const attorney = result.docs[0] as AttorneySEO | undefined

  if (!attorney) {
    return {
      title: 'Attorney Not Found',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title =
    attorney.meta?.title?.trim() ||
    `${attorney.name || 'Attorney'} | Attorney`

  const description =
    attorney.meta?.description?.trim() ||
    attorney.shortBio?.trim() ||
    getBiographyText(attorney.biography).slice(0, 160) ||
    `Learn more about ${attorney.name || 'our attorney'} and their legal experience.`

  const image =
    getImageUrl(attorney.meta?.image) ||
    getImageUrl(attorney.portrait)

  const canonicalUrl = `${SITE_URL}/attorneys/${slug}`

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: 'profile',
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      ...(image && {
        images: [
          {
            url: image,
            alt: attorney.name || 'Attorney portrait',
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

export default async function AttorneyDetailPage({
  params,
}: AttorneyDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'attorneys',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const attorney = result.docs[0]

  if (!attorney) {
    notFound()
  }

  const portrait =
    typeof attorney.portrait === 'object' && attorney.portrait !== null
      ? attorney.portrait
      : null

  const practiceAreas = (attorney.practiceAreas ?? []).filter(
    (item) => typeof item === 'object' && item !== null,
  )

  const hasContactInfo = Boolean(attorney.email || attorney.phone)

  const hasSidebarInfo =
    practiceAreas.length > 0 ||
    (attorney.qualifications && attorney.qualifications.length > 0)

  return (
    <main className="bg-white">
      {/* Attorney Profile Introduction Banner */}
      <section className="relative overflow-hidden bg-[#182A3A] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#B58B60]/10 via-transparent to-transparent opacity-80" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 lg:gap-14">
            {/* Attorney Portrait */}
            <div className="md:col-span-5 lg:col-span-4">
              <div className="relative mx-auto max-w-sm md:max-w-none">
                {portrait?.url ? (
                  <div className="relative overflow-hidden border border-white/10 bg-stone-900 shadow-2xl">
                    <img
                      src={portrait.url}
                      alt={portrait.alt || attorney.name}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[3/4] w-full items-center justify-center border border-white/10 bg-gradient-to-br from-[#182A3A] to-[#101E2B] shadow-2xl">
                    <span className="flex h-24 w-24 items-center justify-center rounded-full border border-[#B58B60]/50 font-serif text-5xl text-[#D8C2A2]">
                      {attorney.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="absolute -bottom-2.5 -right-2.5 -z-10 h-full w-full border border-[#B58B60]/40 sm:-bottom-3 sm:-right-3" />
              </div>
            </div>

            {/* Profile Information */}
            <div className="md:col-span-7 lg:col-span-8">
              <div className="mb-3.5 flex items-center gap-3">
                <span className="h-px w-6 bg-[#B58B60]" />
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B60]">
                  Attorney Profile
                </p>
              </div>

              <h1 className="font-serif text-3xl font-normal leading-tight text-white sm:text-4xl md:text-5xl">
                {attorney.name}
              </h1>

              {attorney.position && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D8C2A2]">
                  {attorney.position}
                </p>
              )}

              {attorney.shortBio && (
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[#F3EEE5]/85 sm:text-base">
                  {attorney.shortBio}
                </p>
              )}

              {/* Direct Contact Cards */}
              {hasContactInfo && (
                <div className="mt-8 flex flex-wrap gap-4 border-t border-white/10 pt-6">
                  {attorney.email && (
                    <a
                      href={`mailto:${attorney.email}`}
                      className="inline-flex items-center gap-2.5 border border-white/15 bg-white/5 px-4 py-2.5 text-xs tracking-wider text-stone-200 transition-all hover:border-[#B58B60] hover:bg-white/10 hover:text-white"
                    >
                      <span className="text-[#B58B60]">✉</span>
                      <span>{attorney.email}</span>
                    </a>
                  )}

                  {attorney.phone && (
                    <a
                      href={`tel:${attorney.phone}`}
                      className="inline-flex items-center gap-2.5 border border-white/15 bg-white/5 px-4 py-2.5 text-xs tracking-wider text-stone-200 transition-all hover:border-[#B58B60] hover:bg-white/10 hover:text-white"
                    >
                      <span className="text-[#B58B60]">☎</span>
                      <span>{attorney.phone}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-14 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            className={`grid grid-cols-1 gap-12 lg:gap-16 ${
              hasSidebarInfo ? 'lg:grid-cols-12' : 'mx-auto max-w-4xl'
            }`}
          >
            {/* Biography */}
            <div className={hasSidebarInfo ? 'lg:col-span-8' : 'w-full'}>
              {attorney.biography ? (
                <div>
                  <h2 className="mb-6 font-serif text-2xl font-normal text-[#182A3A] sm:text-3xl">
                    Professional Biography
                  </h2>

                  <div className="max-w-none text-base leading-relaxed text-[#526171] [&_p]:mb-5 [&_strong]:font-semibold [&_strong]:text-[#182A3A] [&_a]:text-[#B58B60] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#B58B60] [&_blockquote]:pl-4 [&_blockquote]:italic">
                    <RichText data={attorney.biography} />
                  </div>
                </div>
              ) : (
                <div className="rounded-sm border border-stone-200 bg-[#F3EEE5]/50 p-6 text-sm text-[#526171]">
                  Biography details are currently being updated. Please contact our office directly for more information.
                </div>
              )}
            </div>

            {/* Sidebar */}
            {hasSidebarInfo && (
              <aside className="space-y-10 lg:col-span-4 lg:border-l lg:border-stone-200 lg:pl-10">
                {practiceAreas.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                      Areas of Practice
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {practiceAreas.map((area) => (
                        <Link
                          key={area.id}
                          href={`/practice-areas/${area.slug}`}
                          className="border border-stone-300 bg-[#F3EEE5] px-3.5 py-1.5 text-xs font-medium text-[#182A3A] transition-colors hover:border-[#B58B60] hover:bg-[#D8C2A2]"
                        >
                          {area.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {attorney.qualifications &&
                  attorney.qualifications.length > 0 && (
                    <div>
                      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                        Credentials & Admissions
                      </h3>

                      <ul className="space-y-3">
                        {attorney.qualifications.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-start gap-2.5 border-b border-stone-100 pb-3 text-xs leading-relaxed text-[#526171]"
                          >
                            <span className="font-semibold text-[#B58B60]">
                              ✓
                            </span>
                            <span>{item.qualification}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </aside>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
