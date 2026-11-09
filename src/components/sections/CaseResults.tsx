
import { draftMode, headers } from 'next/headers'
import Link from 'next/link'
import type { Case, CaseResultsBlock, Media } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type CaseResultsProps = CaseResultsBlock

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export async function CaseResults({
  eyebrow,
  heading,
  description,
  displayMode,
  cases,
  viewAllLabel,
  viewAllDestinationType,
  selectedViewAllPage,
  viewAllUrl,
}: CaseResultsProps) {
  let items: Case[] = []

  if (displayMode === 'all') {
    const payload = await getPayloadClient()
    const { isEnabled } = await draftMode()
    const requestHeaders = await headers()

    const authResult = await payload.auth({
      headers: requestHeaders,
      canSetHeaders: false,
    })

    const result = await payload.find({
      collection: 'cases',
      user: authResult.user ?? undefined,
      overrideAccess: false,
      draft: isEnabled,
      sort: 'sortOrder',
      limit: 100,
      depth: 1,
    })

    items = result.docs
  } else {
    items = (cases ?? []).filter(
      (item): item is Case =>
        typeof item === 'object' && item !== null,
    )
  }

  const buttonUrl =
    viewAllDestinationType === 'page'
      ? selectedViewAllPage
      : viewAllUrl

  return (
    <section className="bg-[#17243A] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          {eyebrow && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              {eyebrow}
            </p>
          )}

          <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-6 text-base leading-8 text-slate-300">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((caseItem) => {
            const imageUrl = getImageUrl(caseItem.featuredImage)

            return (
              <Link
                key={caseItem.id}
                href={`/cases/${caseItem.slug}`}
                className="group block bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E9E5DC]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={caseItem.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#263954] to-[#17243A]">
                      <div className="text-center">
                        <div className="mx-auto mb-3 h-px w-12 bg-amber-400" />
                        <span className="font-serif text-3xl tracking-widest text-amber-400">
                          LEGAL
                        </span>
                        <div className="mx-auto mt-3 h-px w-12 bg-amber-400" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-7">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                    {caseItem.caseType}
                  </p>

                  <h3 className="mt-3 font-serif text-2xl text-[#17243A]">
                    {caseItem.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {caseItem.summary}
                  </p>

                  {caseItem.outcome && (
                    <div className="mt-5 border-t border-stone-200 pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Outcome
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#17243A]">
                        {caseItem.outcome}
                      </p>
                    </div>
                  )}
                  
                  <span className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider text-[#17243A]">
                    View Case Details →
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
              className="inline-flex min-h-14 items-center justify-center border border-amber-400 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-amber-400 hover:text-[#17243A]"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
