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
    <section
      id="home-hero"
      className="relative flex min-h-[580px] flex-col justify-center overflow-hidden bg-[#182A3A] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44 md:min-h-[700px] md:pt-32 md:pb-52 lg:px-8"
    >
      {/* Background Image & Atmospheric Overlays */}
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url("${imageUrl}")` }}
          aria-hidden="true"
        />
      )}

      {/* Atmospheric overlays in deep blue and antique bronze */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#182A3A]/95 via-[#182A3A]/90 to-[#182A3A]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B58B60]/15 via-transparent to-transparent opacity-80" />

      {/* Dynamic First-Block Overlap & Typography Reset:
          1. Overlap positioning & card container for whichever block follows HomeHero
          2. Explicit typography overrides ensuring all overlapping headings are dark (#182A3A),
             body text is dark slate (#526171), and eyebrows are antique bronze (#A77C50).
          3. Absolute styling enforcement for the secondary button text (#FFFFFF).
      */}
      <style>{`
        /* Overlap layout for immediate sibling block */
        #home-hero + * {
          position: relative !important;
          z-index: 20 !important;
          margin-top: -5rem !important;
          padding-top: 0 !important;
          background-color: transparent !important;
        }
        @media (min-width: 768px) {
          #home-hero + * {
            margin-top: -7.5rem !important;
          }
        }
        #home-hero + * > div:first-child {
          background-color: #F3EEE5 !important;
          border: 1px solid rgba(181, 139, 96, 0.25) !important;
          border-left: 4px solid #B58B60 !important;
          box-shadow: 0 25px 50px -12px rgba(24, 42, 58, 0.2) !important;
          padding: 2.5rem 2rem !important;
        }
        @media (min-width: 1024px) {
          #home-hero + * > div:first-child {
            padding: 3.5rem 3rem !important;
          }
        }

        /* Typography isolation: ensure light-background text is dark and legible */
        #home-hero + * h1,
        #home-hero + * h2,
        #home-hero + * h3,
        #home-hero + * h4 {
          color: #182A3A !important;
          font-family: var(--font-serif), Georgia, serif !important;
        }
        #home-hero + * p,
        #home-hero + * span,
        #home-hero + * li,
        #home-hero + * label {
          color: #526171 !important;
        }
        #home-hero + * p.text-xs,
        #home-hero + * [class*="tracking-[0.2"],
        #home-hero + * [class*="tracking-[0.25"],
        #home-hero + * [class*="tracking-[0.3"] {
          color: #A77C50 !important;
        }
        #home-hero + * button[type="submit"] {
          color: #FFFFFF !important;
          background-color: #182A3A !important;
        }
        #home-hero + * button[type="submit"]:hover {
          background-color: #34495A !important;
        }

        /* HomeHero Secondary Button: Unbreakable white text enforcement */
        #home-hero a.hero-secondary-btn,
        #home-hero a.hero-secondary-btn * {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }
        #home-hero a.hero-secondary-btn:hover,
        #home-hero a.hero-secondary-btn:hover * {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
          background-color: #34495A !important;
          border-color: #B58B60 !important;
        }
      `}</style>

      {/* Centered Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Centered Antique Bronze Circular Scales Emblem */}
        <div className="mb-6 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B58B60]/70 text-lg text-[#B58B60] shadow-sm">
            ⚖
          </span>
        </div>

        {/* Dynamic Eyebrow */}
        {eyebrow && (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#B58B60]">
            {eyebrow}
          </p>
        )}

        {/* Dynamic Heading in Classical Serif Typography */}
        {heading && (
          <h1 className="font-serif text-4xl font-normal leading-[1.12] tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {heading}
          </h1>
        )}

        {/* Dynamic Description */}
        {description && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#F3EEE5]/90 sm:text-lg">
            {description}
          </p>
        )}

        {/* Dynamic Action Buttons */}
        {(primaryButton?.label || secondaryButton?.label) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {/* Primary Button: Muted Champagne with Deep Blue Text */}
            {primaryButton?.label && primaryUrl && (
              <a
                href={primaryUrl}
                className="inline-flex min-h-12 items-center justify-center bg-[#D8C2A2] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#182A3A] shadow-lg transition-all duration-300 hover:bg-[#B58B60] hover:text-white"
              >
                {primaryButton.label}
              </a>
            )}

            {/* Secondary Button: Solid Deep Blue Background with Guaranteed White Text */}
            {secondaryButton?.label && secondaryUrl && (
              <a
                href={secondaryUrl}
                className="hero-secondary-btn inline-flex min-h-12 items-center justify-center border border-white/50 bg-[#182A3A] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md transition-all duration-300 hover:border-[#B58B60] hover:bg-[#34495A] hover:text-white"
                style={{
                  color: '#FFFFFF',
                  backgroundColor: '#182A3A',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                }}
              >
                <span
                  style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                  className="font-semibold text-white"
                >
                  {secondaryButton.label}
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
