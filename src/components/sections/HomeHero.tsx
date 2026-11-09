
import type { HeroBlock, Media } from '@/payload-types'

type HomeHeroProps = HeroBlock

function getMediaUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

function getButtonUrl(
  button:
    | {
        destinationType?: 'page' | 'custom' | null
        selectedPage?: string | null
        customUrl?: string | null
      }
    | null
    | undefined,
): string | undefined {
  if (!button) return undefined

  return button.destinationType === 'page'
    ? button.selectedPage || undefined
    : button.customUrl || undefined
}

export function HomeHero({
  eyebrow,
  heading,
  description,
  backgroundImage,
  primaryButton,
  secondaryButton,
}: HomeHeroProps) {
  const imageUrl = getMediaUrl(backgroundImage)

  const primaryUrl = getButtonUrl(primaryButton)
  const secondaryUrl = getButtonUrl(secondaryButton)

  return (
    <section className="relative flex min-h-[650px] items-center overflow-hidden bg-[#111827] px-6 py-24 md:min-h-[750px] md:px-12 lg:px-20">
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${imageUrl}")` }}
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-[#111827]/75" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-4xl">
          {eyebrow && (
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#D6A84B] md:text-sm">
              {eyebrow}
            </p>
          )}

          {heading && (
            <h1 className="max-w-4xl font-serif text-4xl leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {heading}
            </h1>
          )}

          {description && (
            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              {description}
            </p>
          )}

          {(primaryButton?.label || secondaryButton?.label) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {primaryButton?.label && primaryUrl && (
                <a
                  href={primaryUrl}
                  className="inline-flex min-h-14 items-center justify-center bg-[#D6A84B] px-8 py-4 text-sm font-semibold text-[#111827] transition-colors hover:bg-[#e5bd6b]"
                >
                  {primaryButton.label}
                </a>
              )}

              {secondaryButton?.label && secondaryUrl && (
                <a
                  href={secondaryUrl}
                  className="inline-flex min-h-14 items-center justify-center border border-white/70 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#111827]"
                >
                  {secondaryButton.label}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
