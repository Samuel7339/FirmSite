
import type { RecognitionBlock, Media } from '@/payload-types'

type RecognitionProps = RecognitionBlock

function getMediaUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export function Recognition({
  eyebrow,
  heading,
  description,
  featuredAwards,
  recognitions,
}: RecognitionProps) {
  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-[#D6A84B]" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]">
                {eyebrow}
              </p>
              <span className="h-px w-6 bg-[#D6A84B]" />
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

        {featuredAwards && featuredAwards.length > 0 && (
          <div className="mb-16 grid gap-6 md:grid-cols-3">
            {featuredAwards.map((award, index) => {
              const logoUrl = getMediaUrl(award.logo)

              return (
                <div
                  key={award.id ?? index}
                  className="group flex min-h-[220px] flex-col items-center justify-center border border-stone-200/80 bg-[#F8F6F0] p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/50 hover:bg-white hover:shadow-lg"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={award.title}
                      className="mb-6 h-14 max-w-36 object-contain"
                    />
                  ) : (
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#D6A84B] bg-[#D6A84B]/10 font-serif text-lg text-[#C59A3F]">
                      ★
                    </div>
                  )}

                  <h3 className="font-serif text-xl font-normal text-[#0B1025] transition-colors group-hover:text-[#C59A3F]">
                    {award.title}
                  </h3>

                  {award.organization && (
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                      {award.organization}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {recognitions && recognitions.length > 0 && (
          <div className="grid grid-cols-2 gap-6 border-t border-stone-200/80 pt-12 sm:grid-cols-3 lg:grid-cols-6">
            {recognitions.map((item, index) => {
              const logoUrl = getMediaUrl(item.logo)

              return (
                <div
                  key={item.id ?? index}
                  className="flex flex-col items-center justify-center rounded-sm p-4 text-center transition-colors hover:bg-stone-50"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={item.title}
                      className="mb-4 h-10 max-w-28 object-contain opacity-75 transition-opacity hover:opacity-100"
                    />
                  ) : (
                    <div className="mb-3 flex h-8 w-8 items-center justify-center font-serif text-sm text-[#D6A84B]">
                      ⚖
                    </div>
                  )}

                  <h3 className="font-serif text-xs font-medium tracking-wide text-[#0B1025]">
                    {item.title}
                  </h3>

                  {item.organization && (
                    <p className="mt-1 text-[11px] text-stone-500">
                      {item.organization}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
