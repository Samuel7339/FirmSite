
import type { StatisticsBlock } from '@/payload-types'

type StatisticsProps = StatisticsBlock

export function Statistics({
  eyebrow,
  heading,
  statistics,
}: StatisticsProps) {
  return (
    <section className="bg-[#111827] px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        {(eyebrow || heading) && (
          <div className="mb-14 text-center">
            {eyebrow && (
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#D6A84B]">
                {eyebrow}
              </p>
            )}

            {heading && (
              <h2 className="font-serif text-3xl leading-tight text-white md:text-4xl">
                {heading}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {(statistics ?? []).map((statistic, index) => (
            <div
              key={statistic.id ?? index}
              className="border-l border-[#D6A84B]/50 pl-6"
            >
              <p className="font-serif text-4xl text-[#D6A84B] md:text-5xl">
                {statistic.value}
              </p>

              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wider text-white">
                {statistic.label}
              </h3>

              {statistic.description && (
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {statistic.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
