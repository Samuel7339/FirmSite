
import type { ContactBlock, Media } from '@/payload-types'

type ContactProps = ContactBlock

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export function Contact({
  eyebrow,
  heading,
  description,
  image,
}: ContactProps) {
  const imageUrl = getImageUrl(image)

  return (
    <section className="bg-[#F4F6F8] px-6 py-20 md:px-12 md:py-28">
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

          <div className="mt-10 border border-slate-200 bg-white p-8">
            <p className="font-serif text-2xl text-[#17243A]">
              Contact form
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Our contact form will be available here soon.
            </p>
          </div>
        </div>

        {imageUrl && (
          <div>
            <img
              src={imageUrl}
              alt={heading}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
