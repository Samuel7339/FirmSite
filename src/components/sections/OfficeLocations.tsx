
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
    <section className="bg-[#F4F6F8] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
              {eyebrow}
            </p>
          )}

          <h2 className="font-serif text-3xl leading-tight text-[#111827] md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-6 text-base leading-8 text-slate-600">
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
                className="overflow-hidden bg-white shadow-sm"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={office.officeName}
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-[#263954] to-[#17243A]">
                    <div className="text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        className="mx-auto h-12 w-12 text-amber-400"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                        />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>

                      <p className="mt-4 font-serif text-lg tracking-widest text-amber-400">
                        OUR OFFICE
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <h3 className="font-serif text-2xl text-[#111827]">
                    {office.officeName}
                  </h3>

                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {office.address}
                  </p>

                  {office.phone && (
                    <p className="mt-4 text-sm text-slate-700">
                      <span className="font-semibold">Phone: </span>
                      <a
                        href={`tel:${office.phone}`}
                        className="hover:text-amber-700"
                      >
                        {office.phone}
                      </a>
                    </p>
                  )}

                  {office.email && (
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-semibold">Email: </span>
                      <a
                        href={`mailto:${office.email}`}
                        className="hover:text-amber-700"
                      >
                        {office.email}
                      </a>
                    </p>
                  )}

                  {office.mapUrl && (
                    <Link
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex text-sm font-semibold text-amber-700 transition-colors hover:text-[#111827]"
                    >
                      View on Google Maps →
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
