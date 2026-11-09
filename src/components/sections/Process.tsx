
import type { ProcessBlock } from '@/payload-types'

type ProcessProps = ProcessBlock

export function Process({
  eyebrow,
  heading,
  description,
  steps,
}: ProcessProps) {
  return (
    <section className="bg-[#F4F6F8] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {eyebrow && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              {eyebrow}
            </p>
          )}

          <h2 className="font-serif text-4xl leading-tight text-[#17243A] md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-6 text-base leading-8 text-slate-600">
              {description}
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(steps ?? []).map((step, index) => (
            <div
              key={step.id ?? index}
              className="border-t-2 border-amber-600 bg-white p-8 shadow-sm"
            >
              <span className="font-serif text-4xl text-amber-700">
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 className="mt-6 font-serif text-2xl text-[#17243A]">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
