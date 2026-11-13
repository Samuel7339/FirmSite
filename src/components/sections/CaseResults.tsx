
import { draftMode, headers } from 'next/headers'
import Link from 'next/link'
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { Case, CaseResultsBlock, Media } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type CaseResultsProps = CaseResultsBlock & {
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
  editablePath,
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

    const isStaff = Boolean(authResult.user)
    const isDraft = isStaff || isEnabled

    const result = await payload.find({
      collection: 'cases',
      user: authResult.user ?? undefined,
      overrideAccess: false,
      draft: isDraft,
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
    <section className="bg-[#0B1025] px-6 py-20 md:px-12 md:py-28 lg:px-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          {eyebrow && (
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-[#D6A84B]" />
              <p
                {...payloadEditable(`${editablePath}.eyebrow`)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D6A84B]"
              >
                {eyebrow}
              </p>
            </div>
          )}

          <h2
            {...payloadEditable(`${editablePath}.heading`)}
            className="font-serif text-3xl font-normal leading-tight text-[#FBF9F4] sm:text-4xl md:text-5xl"
          >
            {heading}
          </h2>

          {description && (
            <p
              {...payloadEditable(`${editablePath}.description`)}
              className="mt-5 text-base leading-relaxed text-stone-300"
            >
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
                className="group flex flex-col justify-between border border-white/10 bg-white text-[#0B1025] shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F1EA]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={caseItem.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0B1025] to-[#1E293B]">
                        <div className="text-center">
                          <span className="font-serif text-3xl text-[#D6A84B]">⚖</span>
                          <p className="mt-2 font-serif text-xs tracking-widest text-stone-300">
                            CASE STUDY
                          </p>
                        </div>
                      </div>
                    )}

                    {caseItem.caseType && (
                      <span className="absolute top-3 left-3 bg-[#0B1025]/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#D6A84B] backdrop-blur-sm">
                        {caseItem.caseType}
                      </span>
                    )}
                  </div>

                  <div className="p-7">
                    <h3 className="font-serif text-xl font-normal text-[#0B1025] transition-colors group-hover:text-[#C59A3F] sm:text-2xl">
                      {caseItem.title}
                    </h3>

                    {caseItem.summary && (
                      <p className="mt-3 text-sm leading-relaxed text-stone-600 line-clamp-3">
                        {caseItem.summary}
                      </p>
                    )}

                    {caseItem.outcome && (
                      <div className="mt-5 border-l-2 border-[#D6A84B] bg-[#F8F6F0] p-3 pl-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C59A3F]">
                          Outcome
                        </p>
                        <p className="mt-1 font-serif text-sm font-medium text-[#0B1025]">
                          {caseItem.outcome}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-stone-100 px-7 py-4">
                  <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#0B1025] transition-colors group-hover:text-[#C59A3F]">
                    <span>View Case Details</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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
              className="inline-flex min-h-12 items-center justify-center border border-[#D6A84B] bg-transparent px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#D6A84B] transition-all duration-300 hover:bg-[#D6A84B] hover:text-[#0B1025]"
            >
              <span {...payloadEditable(`${editablePath}.viewAllLabel`)}>
                {viewAllLabel}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
