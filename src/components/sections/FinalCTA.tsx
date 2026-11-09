
import Link from 'next/link'
import type { FinalCTABlock, Media } from '@/payload-types'

type FinalCTAProps = FinalCTABlock

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export function FinalCTA({
  eyebrow,
  heading,
  description,
  buttonLabel,
  destinationType,
  selectedPage,
  customUrl,
  backgroundImage,
}: FinalCTAProps) {
  const imageUrl = getImageUrl(backgroundImage)

  const buttonUrl =
    destinationType === 'page' ? selectedPage : customUrl

  return (
    <section className="relative overflow-hidden bg-[#111827] px-6 py-24 md:px-12 md:py-32">
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${imageUrl}")` }}
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-[#111827]/80" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {eyebrow && (
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#D6A84B]">
            {eyebrow}
          </p>
        )}

        <h2 className="font-serif text-3xl leading-tight text-white md:text-5xl lg:text-6xl">
          {heading}
        </h2>

        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
            {description}
          </p>
        )}

        {buttonLabel && buttonUrl && (
          <Link
            href={buttonUrl}
            className="mt-10 inline-flex min-h-14 items-center justify-center bg-[#D6A84B] px-9 py-4 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#e5bd6b]"
          >
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  )
}
