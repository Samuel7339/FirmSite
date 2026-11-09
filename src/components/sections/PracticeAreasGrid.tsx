
import Link from 'next/link'
import type {
  PracticeAreasGridBlock,
  PracticeArea,
} from '@/payload-types'

type PracticeAreasGridProps = PracticeAreasGridBlock

export function PracticeAreasGrid({
  eyebrow,
  heading,
  description,
  practiceAreas,
  viewAllLabel,
  viewAllDestinationType,
  selectedViewAllPage,
  viewAllUrl,
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
    <section className="bg-[#F4F6F8] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/practice-areas/${item.slug}`}
              className="group border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500 hover:shadow-lg"
            >
              <div className="mb-6 h-1 w-12 bg-amber-600 transition-all duration-300 group-hover:w-20" />

              <h3 className="font-serif text-2xl text-[#17243A]">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {item.shortDescription}
              </p>

              <span className="mt-7 inline-block text-sm font-semibold text-amber-700">
                Explore Practice Area →
              </span>
            </Link>
          ))}
        </div>

        {viewAllLabel && buttonUrl && (
          <div className="mt-12 text-center">
            <Link
              href={buttonUrl}
              className="inline-flex items-center justify-center bg-[#17243A] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#263B5A]"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
