
import Link from 'next/link'
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type {
  PracticeAreasGridBlock,
  PracticeArea,
} from '@/payload-types'

type PracticeAreasGridProps = PracticeAreasGridBlock & {
  editablePath: string
}

export function PracticeAreasGrid({
  eyebrow,
  heading,
  description,
  practiceAreas,
  viewAllLabel,
  viewAllDestinationType,
  selectedViewAllPage,
  viewAllUrl,
  editablePath,
}: PracticeAreasGridProps) {
  const items = (practiceAreas ?? []).filter(
    (item): item is PracticeArea =>
      typeof item === 'object' && item !== null,
  )

  const buttonUrl =
    viewAllDestinationType === 'page'
      ? selectedViewAllPage
      : viewAllUrl

  return (
    <section className="bg-[#F8F6F0] px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          {eyebrow && (
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-[#D6A84B]" />
              <p
                {...payloadEditable(`${editablePath}.eyebrow`)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]"
              >
                {eyebrow}
              </p>
            </div>
          )}

          <h2
            {...payloadEditable(`${editablePath}.heading`)}
            className="font-serif text-3xl font-normal leading-tight text-[#0B1025] sm:text-4xl md:text-5xl"
          >
            {heading}
          </h2>

          {description && (
            <p
              {...payloadEditable(`${editablePath}.description`)}
              className="mt-5 text-base leading-relaxed text-stone-600"
            >
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/practice-areas/${item.slug}`}
              className="group relative flex flex-col justify-between border border-stone-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/50 hover:shadow-xl"
            >
              <div>
                <div className="mb-6 h-[2px] w-8 bg-[#D6A84B] transition-all duration-300 group-hover:w-14" />

                <h3 className="font-serif text-2xl font-normal text-[#0B1025] transition-colors group-hover:text-[#C59A3F]">
                  {item.title}
                </h3>

                {item.shortDescription && (
                  <p className="mt-4 text-sm leading-relaxed text-stone-600">
                    {item.shortDescription}
                  </p>
                )}
              </div>

              <div className="mt-8 flex items-center gap-2 pt-4 border-t border-stone-100 text-xs font-semibold uppercase tracking-[0.15em] text-[#C59A3F] transition-colors group-hover:text-[#0B1025]">
                <span>Explore Practice Area</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        {viewAllLabel && buttonUrl && (
          <div className="mt-14 text-center">
            <Link
              href={buttonUrl}
              {...payloadEditable(`${editablePath}.viewAllLabel`)}
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
