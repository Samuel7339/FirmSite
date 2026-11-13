
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { HeroBlock, Media } from '@/payload-types'

type HomeHeroProps = HeroBlock & {
  editablePath: string
}

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
  editablePath,
}: HomeHeroProps) {
  const imageUrl = getMediaUrl(backgroundImage)

  const primaryUrl = getButtonUrl(primaryButton)
  const secondaryUrl = getButtonUrl(secondaryButton)

  return (
    <section
      id="home-hero"
      className="relative flex min-h-[580px] flex-col justify-center overflow-hidden bg-[#182A3A] px-6 pt-24 pb-36 sm:pt-28 sm:pb-44 md:min-h-[700px] md:pt-32 md:pb-52 lg:px-8"
    >
      {/* Background Image */}
      {imageUrl && (
        <div
          {...payloadEditable(`${editablePath}.backgroundImage`)}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: `url("${imageUrl}")` }}
          aria-hidden="true"
        />
      )}

      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#182A3A]/95 via-[#182A3A]/90 to-[#182A3A]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B58B60]/15 via-transparent to-transparent opacity-80" />

      
<style>{`
  /* Select the next block's actual section through the editor wrappers */
  div:has(> #home-hero) + div > section {
    position: relative !important;
    z-index: 20 !important;
    margin-top: -5rem !important;
    padding-top: 0 !important;
    background-color: transparent !important;
  }

  @media (min-width: 768px) {
    div:has(> #home-hero) + div > section {
      margin-top: -7.5rem !important;
    }
  }

  /* Style the consultation form card */
  div:has(> #home-hero) + div > section > div:first-child {
    background-color: #F3EEE5 !important;
    border: 1px solid rgba(181, 139, 96, 0.25) !important;
    border-left: 4px solid #B58B60 !important;
    box-shadow: 0 25px 50px -12px rgba(24, 42, 58, 0.2) !important;
    padding: 2.5rem 2rem !important;
  }

  @media (min-width: 1024px) {
    div:has(> #home-hero) + div > section > div:first-child {
      padding: 3.5rem 3rem !important;
    }
  }

  div:has(> #home-hero) + div h1,
  div:has(> #home-hero) + div h2,
  div:has(> #home-hero) + div h3,
  div:has(> #home-hero) + div h4 {
    color: #182A3A !important;
    font-family: var(--font-serif), Georgia, serif !important;
  }

  div:has(> #home-hero) + div p,
  div:has(> #home-hero) + div span,
  div:has(> #home-hero) + div li,
  div:has(> #home-hero) + div label {
    color: #526171 !important;
  }

  div:has(> #home-hero) + div p.text-xs,
  div:has(> #home-hero) + div [class*="tracking-[0.2"],
  div:has(> #home-hero) + div [class*="tracking-[0.25"],
  div:has(> #home-hero) + div [class*="tracking-[0.3"] {
    color: #A77C50 !important;
  }

  div:has(> #home-hero) + div button[type="submit"] {
    color: #FFFFFF !important;
    background-color: #182A3A !important;
  }

  div:has(> #home-hero) + div button[type="submit"]:hover {
    background-color: #34495A !important;
  }

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


      {/* Centered Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <div className="mb-6 flex justify-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#B58B60]/70 text-lg text-[#B58B60] shadow-sm">
            ⚖
          </span>
        </div>

        {eyebrow && (
          <p
            {...payloadEditable(`${editablePath}.eyebrow`)}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#B58B60]"
          >
            {eyebrow}
          </p>
        )}

        {heading && (
          <h1
            {...payloadEditable(`${editablePath}.heading`)}
            className="font-serif text-4xl font-normal leading-[1.12] tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {heading}
          </h1>
        )}

        {description && (
          <p
            {...payloadEditable(`${editablePath}.description`)}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#F3EEE5]/90 sm:text-lg"
          >
            {description}
          </p>
        )}

        {(primaryButton?.label || secondaryButton?.label) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {primaryButton?.label && primaryUrl && (
              <a
                href={primaryUrl}
                className="inline-flex min-h-12 items-center justify-center bg-[#D8C2A2] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#182A3A] shadow-lg transition-all duration-300 hover:bg-[#B58B60] hover:text-white"
              >
                <span {...payloadEditable(`${editablePath}.primaryButton.label`)}>
                  {primaryButton.label}
                </span>
              </a>
            )}

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
                  {...payloadEditable(`${editablePath}.secondaryButton.label`)}
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
