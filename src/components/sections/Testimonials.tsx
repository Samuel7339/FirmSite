
import Link from 'next/link'
import type {
  Testimonial,
  TestimonialsBlock,
  Media,
} from '@/payload-types'

type TestimonialsProps = TestimonialsBlock

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

export function Testimonials({
  eyebrow,
  heading,
  description,
  testimonials,
  viewAllLabel,
  viewAllDestinationType,
  selectedViewAllPage,
  viewAllUrl,
}: TestimonialsProps) {
  const items = (testimonials ?? []).filter(
    (item): item is Testimonial =>
      typeof item === 'object' && item !== null,
  )

  const buttonUrl =
    viewAllDestinationType === 'page'
      ? selectedViewAllPage
      : viewAllUrl

  return (
    <section className="bg-[#F4F6F8] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
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
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageUrl = getImageUrl(item.clientImage)

            return (
              <article
                key={item.id}
                className="flex flex-col bg-white p-8 shadow-sm"
              >
                <div className="font-serif text-5xl leading-none text-amber-600">
                  “
                </div>

                <p className="mt-4 flex-1 text-sm leading-8 text-slate-600">
                  {item.testimonial}
                </p>

                {typeof item.rating === 'number' && (
                  <div
                    className="mt-6 flex gap-1 text-amber-600"
                    aria-label={`${item.rating} out of 5 stars`}
                  >
                    {Array.from({ length: item.rating }).map((_, index) => (
                      <span key={index}>★</span>
                    ))}
                  </div>
                )}

                <div className="mt-7 flex items-center gap-4 border-t border-stone-200 pt-6">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.clientName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9ECEF] font-serif text-lg text-[#17243A]">
                      {item.clientName.trim().charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-[#17243A]">
                      {item.clientName}
                    </h3>

                    {item.designation && (
                      <p className="mt-1 text-xs text-slate-500">
                        {item.designation}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {viewAllLabel && buttonUrl && (
          <div className="mt-12 text-center">
            <Link
              href={buttonUrl}
              className="inline-flex min-h-14 items-center justify-center bg-[#17243A] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#263954]"
            >
              {viewAllLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
