
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

  const consultationButton = header.consultationButton

  const consultationUrl =
    consultationButton?.destinationType === 'custom'
      ? consultationButton.customUrl
      : consultationButton?.selectedPage || '/contact'

  return (
    <header className="relative z-50 bg-[#0B1025] text-white">
      <div className="flex min-h-[130px] w-full items-center justify-between gap-4 px-6 py-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          {logo && typeof logo === 'object' && logo.url ? (
            <img
              src={logo.url}
              alt={logo.alt || siteSettings.siteName}
              className="h-14 w-auto object-contain"
            />
          ) : (
            <span className="font-serif text-2xl font-semibold tracking-widest">
              {siteSettings.siteName}
            </span>
          )}
        </Link>

        {/* Header Actions */}
        <div className="flex shrink-0 items-center gap-4">

          {/* Consultation Button */}
          {consultationButton?.enabled && consultationUrl && (
            <Link
              href={consultationUrl}
              className="bg-[#D6A84B] px-4 py-3 text-center text-xs font-semibold text-[#0B1025] transition hover:bg-[#c49a3f] sm:px-6 sm:text-sm"
            >
              {consultationButton.label || 'Book a Consultation'}
            </Link>
          )}

          {/* Hamburger Menu */}
          <MobileNavigation
            navigation={header.navigation ?? []}
          />

        </div>
      </div>
    </header>
  )
}
