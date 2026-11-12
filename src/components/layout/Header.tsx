
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'
import { MobileNavigation } from './MobileNavigation'

export async function Header() {
  const payload = await getPayloadClient()

  const [header, siteSettings] = await Promise.all([
    payload.findGlobal({
      slug: 'header',
      depth: 1,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    }),
  ])

  const logo = header.logo || siteSettings.logo
  const siteName = siteSettings.siteName || 'Law Firm'

  const consultationButton = header.consultationButton

  const consultationUrl =
    (consultationButton?.destinationType === 'custom'
      ? consultationButton.customUrl
      : consultationButton?.selectedPage) || '/contact'

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#182A3A] text-white">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:min-h-[88px] lg:px-8">
        {/* Dynamic Firm Logo & Branding */}
        <Link href="/" className="group flex items-center gap-3 transition-opacity hover:opacity-90">
          {logo && typeof logo === 'object' && logo.url ? (
            <img
              src={logo.url}
              alt={logo.alt || siteName}
              className="h-9 w-auto object-contain sm:h-11"
            />
          ) : (
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B58B60] font-serif text-sm text-[#B58B60]">
                ⚖
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-base font-normal tracking-[0.18em] uppercase text-white sm:text-lg">
                  {siteName}
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#B58B60]">
                  Attorneys & Counselors
                </span>
              </div>
            </div>
          )}
        </Link>
            
        {/* Universal Navigation Menu Button (Always visible on ALL screen sizes) */}
        <MobileNavigation
          navigation={header.navigation ?? []}
          consultationButton={consultationButton}
          consultationUrl={consultationUrl}
          siteName={siteName}
          logo={logo}
        />
      </div>
    </header>
  )
}

