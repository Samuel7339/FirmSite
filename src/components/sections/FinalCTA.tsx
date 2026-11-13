
import Link from 'next/link'
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { FinalCTABlock } from '@/payload-types'

type FinalCTAProps = FinalCTABlock & {
  editablePath: string
}

export function FinalCTA({
  eyebrow,
  heading,
  description,
  buttonLabel,
  destinationType,
  selectedPage,
  customUrl,
  editablePath,
}: FinalCTAProps) {
  const buttonUrl =
    destinationType === 'page' ? selectedPage : customUrl

  return (
    <section className="relative overflow-hidden bg-[#263B50] px-6 py-14 text-white sm:py-16 md:py-20 lg:px-8">
      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#263B50]/95 via-[#263B50]/90 to-[#263B50]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B58B60]/15 via-transparent to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {eyebrow && (
          <div className="mb-3.5 flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-[#B58B60]/70" />

            <p
              {...payloadEditable(`${editablePath}.eyebrow`)}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B58B60]"
            >
              {eyebrow}
            </p>

            <span className="h-px w-6 bg-[#B58B60]/70" />
          </div>
        )}

        <h2
          {...payloadEditable(`${editablePath}.heading`)}
          className="font-serif text-2xl font-normal leading-snug text-white sm:text-3xl md:text-4xl"
        >
          {heading}
        </h2>

        {description && (
          <p
            {...payloadEditable(`${editablePath}.description`)}
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#F3EEE5]/85 sm:text-base"
          >
            {description}
          </p>
        )}

        {buttonLabel && buttonUrl && (
          <div className="mt-8">
            <Link
              href={buttonUrl}
              className="inline-flex min-h-11 items-center justify-center bg-[#D8C2A2] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#182A3A] shadow-md transition-all duration-300 hover:bg-[#B58B60] hover:text-white"
            >
              <span
                {...payloadEditable(`${editablePath}.buttonLabel`)}
              >
                {buttonLabel}
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
