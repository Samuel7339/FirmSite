
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { ProcessBlock } from '@/payload-types'

type ProcessProps = ProcessBlock & {
  editablePath: string
}

export function Process({
  eyebrow,
  heading,
  description,
  steps,
  editablePath,
}: ProcessProps) {
  return (
    <section className="bg-[#F8F6F0] px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-[#D6A84B]" />
              <p
                {...payloadEditable(`${editablePath}.eyebrow`)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]"
              >
                {eyebrow}
              </p>
              <span className="h-px w-6 bg-[#D6A84B]" />
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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(steps ?? []).map((step, index) => (
            <div
              key={step.id ?? index}
              {...payloadEditable(`${editablePath}.steps.${index}`)}
              className="group relative flex flex-col justify-between border border-stone-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/50 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between border-b border-stone-100 pb-5">
                  <span className="font-serif text-3xl font-normal text-[#C59A3F]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#D6A84B]/40 group-hover:bg-[#D6A84B]" />
                </div>

                <h3
                  {...payloadEditable(`${editablePath}.steps.${index}.title`)}
                  className="mt-6 font-serif text-2xl font-normal text-[#0B1025] transition-colors group-hover:text-[#C59A3F]"
                >
                  {step.title}
                </h3>

                {step.description && (
                  <p
                    {...payloadEditable(`${editablePath}.steps.${index}.description`)}
                    className="mt-4 text-sm leading-relaxed text-stone-600"
                  >
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
