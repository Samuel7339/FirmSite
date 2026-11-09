
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
    <footer className="bg-[#111827] text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Firm Information */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-2xl font-semibold text-white">
              {siteSettings.siteName}
            </h2>

            <p className="mt-2 text-sm text-[#D6A84B]">
              {footer.firmName}
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              {footer.description}
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Explore
            </h3>

            <ul className="space-y-4">
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
                      className="text-sm transition hover:text-[#D6A84B]"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Contact
            </h3>

            <ul className="space-y-4 text-sm text-gray-400">
              {siteSettings.contactInformation?.address && (
                <li>{siteSettings.contactInformation.address}</li>
              )}

              {siteSettings.contactInformation?.phone && (
                <li>
                  <a href={`tel:${siteSettings.contactInformation.phone}`}>
                    {siteSettings.contactInformation.phone}
                  </a>
                </li>
              )}

              {siteSettings.contactInformation?.email && (
                <li>
                  <a href={`mailto:${siteSettings.contactInformation.email}`}>
                    {siteSettings.contactInformation.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-widest text-white">
              Follow Us
            </h3>

            <ul className="space-y-4">
              {siteSettings.socialLinks?.map((item, index) => (
                <li key={item.id || index}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm capitalize transition hover:text-[#D6A84B]"
                  >
                    {item.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 border-t border-gray-700 pt-6">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {siteSettings.siteName}.{' '}
            All right recieved
          </p>
        </div>
      </div>
    </footer>
  )
}
