
import { draftMode, headers } from 'next/headers'
import Link from 'next/link'
import type { InsightsBlock, Media, Post, Attorney } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type InsightsProps = InsightsBlock

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

    const result = await payload.find({
      collection: 'posts',
      user: authResult.user ?? undefined,
      overrideAccess: false,
      draft: isEnabled,
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
    <section className="bg-white px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          {eyebrow && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              {eyebrow}
            </p>
          )}

          <h2 className="font-serif text-4xl leading-tight text-[#17243A] md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-6 text-base leading-8 text-slate-600">
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
                className="group block"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#E9ECEF]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#263954] to-[#17243A]">
                      <div className="text-center">
                        <div className="mx-auto mb-3 h-px w-12 bg-amber-400" />
                        <span className="font-serif text-3xl tracking-widest text-amber-400">
                          INSIGHTS
                        </span>
                        <div className="mx-auto mt-3 h-px w-12 bg-amber-400" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6">
                  {post.publishedAt && (
                    <p className="text-xs font-medium uppercase tracking-wider text-amber-700">
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

                  <h3 className="mt-3 font-serif text-2xl leading-snug text-[#17243A]">
                    {post.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {post.excerpt}
                  </p>

                  {author && (
                    <p className="mt-5 text-xs font-medium text-slate-500">
                      By {author.name}
                    </p>
                  )}

                  <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#17243A]">
                    Read Article →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {viewAllLabel && buttonUrl && (
          <div className="mt-12 text-center">
            <Link
              href={buttonUrl}
              className="inline-flex min-h-14 items-center justify-center bg-[#17243A] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#263954]"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
