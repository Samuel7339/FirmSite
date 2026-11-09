
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
    <section className="bg-white px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          {eyebrow && (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              {eyebrow}
            </p>
          )}

          <h2 className="font-serif text-3xl leading-tight text-[#17243A] md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-5 text-base leading-8 text-slate-600">
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
                  className="flex min-h-56 flex-col items-center justify-center border border-stone-200 bg-[#F9F8F5] p-8 text-center"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={award.title}
                      className="mb-5 h-16 max-w-40 object-contain"
                    />
                  ) : (
                    <div className="mb-5 h-px w-12 bg-amber-500" />
                  )}

                  <h3 className="font-serif text-xl text-[#17243A]">
                    {award.title}
                  </h3>

                  {award.organization && (
                    <p className="mt-2 text-sm text-slate-500">
                      {award.organization}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {recognitions && recognitions.length > 0 && (
          <div className="grid grid-cols-2 gap-6 border-t border-stone-200 pt-12 sm:grid-cols-3 lg:grid-cols-6">
            {recognitions.map((item, index) => {
              const logoUrl = getMediaUrl(item.logo)

              return (
                <div
                  key={item.id ?? index}
                  className="flex flex-col items-center justify-center text-center"
                >
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={item.title}
                      className="mb-4 h-12 max-w-28 object-contain"
                    />
                  ) : (
                    <div className="mb-4 h-px w-8 bg-amber-500" />
                  )}

                  <h3 className="text-sm font-semibold text-[#17243A]">
                    {item.title}
                  </h3>

                  {item.organization && (
                    <p className="mt-1 text-xs text-slate-500">
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
