
import { draftMode, headers } from 'next/headers'
import Link from 'next/link'
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { InsightsBlock, Media, Post, Attorney } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type InsightsProps = InsightsBlock & {
  editablePath: string
}

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export async function Insights({
  eyebrow,
  heading,
  description,
  displayMode,
  posts,
  viewAllLabel,
  viewAllDestinationType,
  selectedViewAllPage,
  viewAllUrl,
  editablePath,
}: InsightsProps) {
  let items: Post[] = []

  if (displayMode === 'all') {
    const payload = await getPayloadClient()
    const { isEnabled } = await draftMode()
    const requestHeaders = await headers()

    const authResult = await payload.auth({
      headers: requestHeaders,
      canSetHeaders: false,
    })

    const isStaff = Boolean(authResult.user)
    const isDraft = isStaff || isEnabled

    const result = await payload.find({
      collection: 'posts',
      user: authResult.user ?? undefined,
      overrideAccess: false,
      draft: isDraft,
      sort: '-publishedAt',
      limit: 100,
      depth: 1,
    })

    items = result.docs
  } else {
    items = (posts ?? []).filter(
      (item): item is Post =>
        typeof item === 'object' && item !== null,
    )
  }

  const buttonUrl =
    viewAllDestinationType === 'page'
      ? selectedViewAllPage
      : viewAllUrl

  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          {eyebrow && (
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-[#D6A84B]" />
              <p
                {...payloadEditable(`${editablePath}.eyebrow`)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]"
              >
                {eyebrow}
              </p>
            </div>
          )}

          <h2
            {...payloadEditable(`${editablePath}.heading`)}
            className="font-serif text-3xl font-normal leading-tight text-[#0B1025] sm:text-4xl md:text-5xl"
          >
            {heading}
          </h2>

          {description && (
            <p
              {...payloadEditable(`${editablePath}.description`)}
              className="mt-5 text-base leading-relaxed text-stone-600"
            >
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => {
            const imageUrl = getImageUrl(post.featuredImage)
            const author =
              typeof post.author === 'object' && post.author !== null
                ? (post.author as Attorney)
                : null

            return (
              <Link
                key={post.id}
                href={`/insights/${post.slug}`}
                className="group flex flex-col justify-between border border-stone-200/80 bg-stone-50/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/40 hover:bg-white hover:shadow-xl"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-[#F4F1EA]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1025] to-[#1E293B]">
                        <div className="text-center p-4">
                          <span className="font-serif text-2xl text-[#D6A84B]">
                            ⚖
                          </span>
                          <p className="mt-1 font-serif text-[10px] tracking-widest text-stone-300">
                            LEGAL INSIGHTS
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 pb-2 px-2">
                    {post.publishedAt && (
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C59A3F]">
                        {new Date(post.publishedAt).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          },
                        )}
                      </p>
                    )}

                    <h3 className="mt-3 font-serif text-xl font-normal leading-snug text-[#0B1025] transition-colors group-hover:text-[#C59A3F] sm:text-2xl">
                      {post.title}
                    </h3>

                    {post.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-stone-600 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-stone-200/60 pt-4 px-2">
                  {author ? (
                    <span className="text-xs text-stone-500">
                      By{' '}
                      <span className="font-medium text-[#0B1025]">
                        {author.name}
                      </span>
                    </span>
                  ) : (
                    <span />
                  )}

                  <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#0B1025] transition-colors group-hover:text-[#C59A3F]">
                    <span>Read</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {viewAllLabel && buttonUrl && (
          <div className="mt-14 text-center">
            <Link
              href={buttonUrl}
              className="inline-flex min-h-12 items-center justify-center border border-[#0B1025] bg-[#0B1025] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-[#D6A84B] hover:bg-[#D6A84B] hover:text-[#0B1025]"
            >
              <span
                {...payloadEditable(`${editablePath}.viewAllLabel`)}
              >
                {viewAllLabel}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
