
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { StatisticsBlock } from '@/payload-types'

type StatisticsProps = StatisticsBlock & {
  editablePath: string
}

export function Statistics({
  eyebrow,
  heading,
  statistics,
  editablePath,
}: StatisticsProps) {
  return (
    <section className="border-y border-white/10 bg-[#0B1025] px-6 py-20 md:px-12 md:py-24 lg:px-20 text-white">
      <div className="mx-auto max-w-7xl">
        {(eyebrow || heading) && (
          <div className="mb-16 text-center">
            {eyebrow && (
              <div className="mb-4 flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-[#D6A84B]" />
                <p
                  {...payloadEditable(`${editablePath}.eyebrow`)}
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D6A84B]"
                >
                  {eyebrow}
                </p>
                <span className="h-px w-6 bg-[#D6A84B]" />
              </div>
            )}

            {heading && (
              <h2
                {...payloadEditable(`${editablePath}.heading`)}
                className="font-serif text-3xl font-normal leading-tight text-[#FBF9F4] md:text-4xl"
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {(statistics ?? []).map((statistic, index) => (
            <div
              key={statistic.id ?? index}
              {...payloadEditable(`${editablePath}.statistics.${index}`)}
              className="border-l-2 border-[#D6A84B] pl-6 transition-all duration-300 hover:pl-8"
            >
              <p
                {...payloadEditable(`${editablePath}.statistics.${index}.value`)}
                className="font-serif text-4xl font-normal text-[#D6A84B] sm:text-5xl lg:text-6xl"
              >
                {statistic.value}
              </p>

              <h3
                {...payloadEditable(`${editablePath}.statistics.${index}.label`)}
                className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FBF9F4]"
              >
                {statistic.label}
              </h3>

              {statistic.description && (
                <p
                  {...payloadEditable(`${editablePath}.statistics.${index}.description`)}
                  className="mt-2 text-xs leading-relaxed text-stone-400"
                >
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
