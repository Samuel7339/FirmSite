
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { RecognitionBlock, Award, Media } from '@/payload-types'

type RecognitionProps = RecognitionBlock & {
  editablePath: string
  allAwards?: Award[]
}

function getMediaUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

function isPopulatedAward(
  value: unknown,
): value is Award {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'category' in value
  )
}

function getAwardSymbol(icon?: string | null) {
  const symbols: Record<string, string> = {
    trophy: '🏆',
    award: '✦',
    star: '★',
    scale: '⚖',
    medal: '✧',
    shield: '◈',
    'shield-check': '✓',
    'badge-check': '✦',
    landmark: '⌂',
  }

  return symbols[icon?.toLowerCase() ?? ''] ?? '✦'
}

export function Recognition({
  eyebrow,
  heading,
  description,
  displayMode,
  awards,
  allAwards,
  editablePath,
}: RecognitionProps) {
  const displayedAwards: Award[] =
    displayMode === 'all'
      ? allAwards ?? []
      : (awards ?? []).filter(isPopulatedAward)

  const featuredAwards = displayedAwards.filter(
    (item) => item.category === 'award',
  )

  const recognitions = displayedAwards.filter(
    (item) => item.category === 'recognition',
  )

  return (
    <section className="relative overflow-hidden bg-[#F8F6F0] px-6 py-20 md:px-12 md:py-28 lg:px-20">
      {/* Decorative background details */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#D6A84B]/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[#D6A84B]/10"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {eyebrow && (
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#C59A3F]" />

              <p
                {...payloadEditable(`${editablePath}.eyebrow`)}
                className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A17C3D]"
              >
                {eyebrow}
              </p>

              <span className="h-px w-8 bg-[#C59A3F]" />
            </div>
          )}

          <h2
            {...payloadEditable(`${editablePath}.heading`)}
            className="font-serif text-3xl font-normal leading-tight text-[#192B3D] sm:text-4xl md:text-5xl lg:text-[56px]"
          >
            {heading}
          </h2>

          <div className="mx-auto my-7 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-[#D6A84B]/50" />
            <span className="h-2 w-2 rotate-45 border border-[#C59A3F]" />
            <span className="h-px w-10 bg-[#D6A84B]/50" />
          </div>

          {description && (
            <p
              {...payloadEditable(`${editablePath}.description`)}
              className="mx-auto max-w-2xl text-sm leading-8 text-[#64717D] sm:text-base"
            >
              {description}
            </p>
          )}
        </div>

        {/* Featured awards */}
        {featuredAwards.length > 0 && (
          <div className="mb-20">
            <div className="mb-8 flex items-center gap-4">
              <h3 className="font-serif text-xl text-[#192B3D] sm:text-2xl">
                Awards & Honours
              </h3>

              <span className="h-px flex-1 bg-[#D6A84B]/30" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredAwards.map((award, index) => {
                const logoUrl = getMediaUrl(award.logo)

                return (
                  <article
                    key={award.id}
                    className="group relative flex min-h-[270px] flex-col items-center overflow-hidden border border-[#E7E1D5] bg-white px-7 py-9 text-center shadow-[0_5px_25px_rgba(25,43,61,0.035)] transition-all duration-500 hover:-translate-y-2 hover:border-[#D6A84B]/60 hover:shadow-[0_18px_45px_rgba(25,43,61,0.10)]"
                  >
                    {/* Gold top accent */}
                    <div className="absolute left-0 top-0 h-[3px] w-full origin-left scale-x-0 bg-[#C59A3F] transition-transform duration-500 group-hover:scale-x-100" />

                    {/* Award logo */}
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#D6A84B]/40 bg-[#F8F6F0] p-4 transition-colors duration-300 group-hover:bg-[#F2EBDD]">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={award.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="font-serif text-3xl text-[#B18A43]">
                          {getAwardSymbol(award.icon)}
                        </span>
                      )}
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-px w-5 bg-[#D6A84B]/60" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A17C3D]">
                        Award
                      </span>
                      <span className="h-px w-5 bg-[#D6A84B]/60" />
                    </div>

                    <h4 className="font-serif text-xl leading-snug text-[#192B3D] transition-colors duration-300 group-hover:text-[#A17C3D]">
                      {award.title}
                    </h4>

                    {award.organization && (
                      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#87909A]">
                        {award.organization}
                      </p>
                    )}

                    {award.description && (
                      <p className="mt-4 max-w-sm text-sm leading-6 text-[#71808C]">
                        {award.description}
                      </p>
                    )}

                    <div className="mt-auto pt-6">
                      <span className="text-lg text-[#D6A84B]/70">
                        ✧
                      </span>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* Other recognitions */}
        {recognitions.length > 0 && (
          <div>
            <div className="mb-8 flex items-center gap-4">
              <h3 className="font-serif text-xl text-[#192B3D] sm:text-2xl">
                Professional Recognition
              </h3>

              <span className="h-px flex-1 bg-[#D6A84B]/30" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {recognitions.map((item) => {
                const logoUrl = getMediaUrl(item.logo)

                return (
                  <article
                    key={item.id}
                    className="group flex min-h-[190px] flex-col items-center justify-center border border-[#E7E1D5]/80 bg-white/70 px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/50 hover:bg-white hover:shadow-[0_10px_30px_rgba(25,43,61,0.07)]"
                  >
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#F8F6F0] p-3 transition-colors duration-300 group-hover:bg-[#F2EBDD]">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={item.title}                                
                          className="h-full w-full object-contain opacity-80 transition-opacity group-hover:opacity-100"
                        />
                      ) : (
                        <span className="font-serif text-2xl text-[#B18A43]">
                          {getAwardSymbol(item.icon)}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-sm leading-snug text-[#192B3D] transition-colors group-hover:text-[#A17C3D]">
                      {item.title}
                    </h4>

                    {item.organization && (
                      <p className="mt-2 text-[10px] leading-relaxed text-[#87909A]">
                        {item.organization}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {displayedAwards.length === 0 && (
          <div className="border border-dashed border-[#D6A84B]/40 bg-white/60 px-6 py-12 text-center">
            <span className="font-serif text-3xl text-[#B18A43]">✧</span>
            <p className="mt-4 font-serif text-lg text-[#192B3D]">
              Recognition and Excellence
            </p>
            <p className="mt-2 text-sm text-[#87909A]">
              Awards and recognitions will appear here once published.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
