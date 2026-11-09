
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

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((attorney) => {
            const portraitUrl = getPortraitUrl(attorney.portrait)

            return (
              <Link
                key={attorney.id}
                href={`/attorneys/${attorney.slug}`}
                className="group block"
              >
                <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#E9E5DC]">
                  {portraitUrl ? (
                    <img
                      src={portraitUrl}
                      alt={attorney.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="font-serif text-7xl font-medium tracking-wider text-[#263954] md:text-8xl">
                      {getInitials(attorney.name)}
                    </span>
                  )}
                </div>

                <div className="border-b border-stone-200 py-6">
                  <h3 className="font-serif text-2xl text-[#17243A]">
                    {attorney.name}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-amber-700">
                    {attorney.position}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {attorney.shortBio}
                  </p>

                  <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-wider text-[#17243A]">
                    View Profile →
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
