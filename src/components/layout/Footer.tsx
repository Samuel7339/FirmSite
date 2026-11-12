import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

export async function Footer() {
  const payload = await getPayloadClient()

  const [footer, siteSettings] = await Promise.all([
    payload.findGlobal({
      slug: 'footer',
      depth: 1,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
    }),
  ])

  return (
    <footer className="border-t border-[#B58B60]/20 bg-[#182A3A] text-stone-300">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8">
        {/* Main Columns Grid with Balanced Proportions */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Firm Information (Span 4) */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-4 lg:pr-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#B58B60] font-serif text-xs text-[#B58B60]">
                ⚖
              </span>
              <h2 className="font-serif text-lg font-normal tracking-[0.14em] uppercase text-white">
                {siteSettings.siteName}
              </h2>
            </div>

            {footer.firmName && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B58B60]">
                {footer.firmName}
              </p>
            )}

            {footer.description && (
              <p className="max-w-sm text-xs leading-relaxed text-stone-400">
                {footer.description}
              </p>
            )}
          </div>

          {/* Column 2: Explore Links (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
              Navigation
            </h3>

            <ul className="space-y-2.5">
              {footer.exploreLinks?.map((item, index) => {
                const href =
                  item.destinationType === 'custom'
                    ? item.url
                    : item.selectedPage

                if (!href) return null

                return (
                  <li key={item.id || index}>
                    <Link
                      href={href}
                      className="inline-block text-sm text-stone-300 transition-colors duration-200 hover:text-[#D8C2A2]"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 3: Contact Information (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
              Contact
            </h3>

            <ul className="space-y-2.5 text-sm text-stone-300">
              {siteSettings.contactInformation?.address && (
                <li className="leading-relaxed">
                  {siteSettings.contactInformation.address}
                </li>
              )}

              {siteSettings.contactInformation?.phone && (
                <li>
                  <a
                    href={`tel:${siteSettings.contactInformation.phone}`}
                    className="transition-colors duration-200 hover:text-[#D8C2A2]"
                  >
                    {siteSettings.contactInformation.phone}
                  </a>
                </li>
              )}

              {siteSettings.contactInformation?.email && (
                <li>
                  <a
                    href={`mailto:${siteSettings.contactInformation.email}`}
                    className="transition-colors duration-200 hover:text-[#D8C2A2]"
                  >
                    {siteSettings.contactInformation.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: Social Links (Span 2) */}
          {siteSettings.socialLinks && siteSettings.socialLinks.length > 0 && (
            <div className="lg:col-span-2">
              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B58B60]">
                Connect
              </h3>

              <ul className="space-y-2.5">
                {siteSettings.socialLinks.map((item, index) => (
                  <li key={item.id || index}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-sm capitalize text-stone-300 transition-colors duration-200 hover:text-[#D8C2A2]"
                    >
                      {item.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Subtle Divider & Copyright Section */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved.
          </p>
          <p className="mt-2 text-[11px] tracking-wider uppercase text-stone-400 sm:mt-0">
            Professional Legal Practice
          </p>
        </div>
      </div>
    </footer>
  )
}
