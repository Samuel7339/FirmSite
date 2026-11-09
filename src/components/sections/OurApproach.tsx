
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Media, OurApproachBlock } from '@/payload-types'

type OurApproachProps = OurApproachBlock

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
}: OurApproachProps) {
  const imageUrl = getImageUrl(image)

  const buttonUrl =
    destinationType === 'page' ? selectedPage : customUrl

  return (
    <section className="bg-white px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
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

          {content && (
            <div className="prose prose-slate mt-6 max-w-none leading-8">
              <RichText data={content} />
            </div>
          )}

          {buttonLabel && buttonUrl && (
            <Link
              href={buttonUrl}
              className="mt-9 inline-flex min-h-14 items-center justify-center bg-[#17243A] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#263954]"
            >
              {buttonLabel}
            </Link>
          )}
        </div>

        <div className="relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={heading}
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-[#263954] to-[#17243A]">
              <div className="text-center">
                <div className="mx-auto mb-4 h-px w-14 bg-amber-400" />
                <span className="font-serif text-3xl tracking-widest text-amber-400">
                  OUR APPROACH
                </span>
                <div className="mx-auto mt-4 h-px w-14 bg-amber-400" />
              </div>
            </div>
          )}

          <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full border border-amber-600/50" />
        </div>
      </div>
    </section>
  )
}
