
import Link from 'next/link'
import type { AttorneysGridBlock, Attorney, Media } from '@/payload-types'

type AttorneysGridProps = AttorneysGridBlock

function getPortraitUrl(
  portrait: string | number | Media | null | undefined,
): string | undefined {
  if (typeof portrait === 'object' && portrait !== null) {
    return portrait.url || undefined
  }

  return undefined
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

export function AttorneysGrid({
  eyebrow,
  heading,
  description,
  attorneys,
  viewAllLabel,
  viewAllDestinationType,
  selectedViewAllPage,
  viewAllUrl,
}: AttorneysGridProps) {
  const items = (attorneys ?? []).filter(
    (item): item is Attorney =>
      typeof item === 'object' && item !== null,
  )

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
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]">
                {eyebrow}
              </p>
            </div>
          )}

          <h2 className="font-serif text-3xl font-normal leading-tight text-[#0B1025] sm:text-4xl md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-5 text-base leading-relaxed text-stone-600">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((attorney) => {
            const portraitUrl = getPortraitUrl(attorney.portrait)

            return (
              <Link
                key={attorney.id}
                href={`/attorneys/${attorney.slug}`}
                className="group flex flex-col justify-between border border-stone-200/80 bg-stone-50/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/40 hover:bg-white hover:shadow-xl"
              >
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F4F1EA]">
                    {portraitUrl ? (
                      <img
                        src={portraitUrl}
                        alt={attorney.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#0B1025] to-[#1E293B]">
                        <span className="font-serif text-5xl font-normal tracking-wider text-[#D6A84B]/80 md:text-6xl">
                          {getInitials(attorney.name)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1025]/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  <div className="pt-6 pb-2 px-2">
                    <h3 className="font-serif text-2xl font-normal text-[#0B1025] transition-colors group-hover:text-[#C59A3F]">
                      {attorney.name}
                    </h3>

                    {attorney.position && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#C59A3F]">
                        {attorney.position}
                      </p>
                    )}

                    {attorney.shortBio && (
                      <p className="mt-4 text-sm leading-relaxed text-stone-600 line-clamp-3">
                        {attorney.shortBio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 border-t border-stone-200/60 pt-4 px-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#0B1025] transition-colors group-hover:text-[#C59A3F]">
                  <span>View Profile</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
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
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
