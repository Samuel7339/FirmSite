
import Link from 'next/link'
import type { Media, OfficeLocationsBlock } from '@/payload-types'

type OfficeLocationsProps = OfficeLocationsBlock

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export function OfficeLocations({
  eyebrow,
  heading,
  description,
  offices,
}: OfficeLocationsProps) {
  return (
    <section className="bg-[#F8F6F0] px-6 py-20 md:px-12 md:py-28 lg:px-20">
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

        <div className="grid gap-8 md:grid-cols-2">
          {(offices ?? []).map((office, index) => {
            const imageUrl = getImageUrl(office.image)

            return (
              <article
                key={office.id ?? index}
                className="group border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/40 hover:shadow-xl"
              >
                {imageUrl ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-stone-100">
                    <img
                      src={imageUrl}
                      alt={office.officeName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-[#0B1025] to-[#1E293B]">
                    <div className="text-center p-6">
                      <span className="font-serif text-3xl text-[#D6A84B]">⚖</span>
                      <p className="mt-2 font-serif text-xs tracking-widest text-stone-300">
                        OFFICE LOCATION
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="font-serif text-2xl font-normal text-[#0B1025] transition-colors group-hover:text-[#C59A3F]">
                    {office.officeName}
                  </h3>

                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-stone-600">
                    {office.address}
                  </p>

                  <div className="mt-6 space-y-2 border-t border-stone-100 pt-5 text-sm text-stone-600">
                    {office.phone && (
                      <p>
                        <span className="font-medium text-[#0B1025]">Phone: </span>
                        <a
                          href={`tel:${office.phone}`}
                          className="transition-colors hover:text-[#C59A3F]"
                        >
                          {office.phone}
                        </a>
                      </p>
                    )}

                    {office.email && (
                      <p>
                        <span className="font-medium text-[#0B1025]">Email: </span>
                        <a
                          href={`mailto:${office.email}`}
                          className="transition-colors hover:text-[#C59A3F]"
                        >
                          {office.email}
                        </a>
                      </p>
                    )}
                  </div>

                  {office.mapUrl && (
                    <Link
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#C59A3F] transition-colors hover:text-[#0B1025]"
                    >
                      <span>View on Google Maps</span>
                      <span>→</span>
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
