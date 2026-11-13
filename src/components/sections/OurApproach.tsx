
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { Media, OurApproachBlock } from '@/payload-types'

type OurApproachProps = OurApproachBlock & {
  editablePath: string
}

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export function OurApproach({
  eyebrow,
  heading,
  description,
  content,
  image,
  buttonLabel,
  destinationType,
  selectedPage,
  customUrl,
  editablePath,
}: OurApproachProps) {
  const imageUrl = getImageUrl(image)

  const buttonUrl =
    destinationType === 'page' ? selectedPage : customUrl

  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
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

          {content && (
            <div
              {...payloadEditable(`${editablePath}.content`)}
              className="mt-6 max-w-none text-base leading-relaxed text-stone-600 [&_p]:mb-5 [&_strong]:font-semibold [&_strong]:text-[#0B1025] [&_a]:text-[#C59A3F] [&_a]:underline [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6"
            >
              <RichText data={content} />
            </div>
          )}

          {buttonLabel && buttonUrl && (
            <Link
              href={buttonUrl}
              {...payloadEditable(`${editablePath}.buttonLabel`)}
              className="mt-8 inline-flex min-h-12 items-center justify-center border border-[#0B1025] bg-[#0B1025] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-[#D6A84B] hover:bg-[#D6A84B] hover:text-[#0B1025]"
            >
              {buttonLabel}
            </Link>
          )}
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          {imageUrl ? (
            <div
              {...payloadEditable(`${editablePath}.image`)}
              className="relative overflow-hidden bg-stone-100 shadow-xl"
            >
              <img
                src={imageUrl}
                alt={heading}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ) : (
            <div
              {...payloadEditable(`${editablePath}.image`)}
              className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-[#0B1025] to-[#1E293B] shadow-xl"
            >
              <div className="text-center p-8">
                <span className="mb-4 block font-serif text-3xl text-[#D6A84B]">⚖</span>
                <span className="font-serif text-xl tracking-widest text-white/90">
                  OUR APPROACH
                </span>
              </div>
            </div>
          )}

          <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full border border-[#D6A84B]/50 transition-all duration-300 sm:-bottom-4 sm:-right-4" />
        </div>
      </div>
    </section>
  )
}
