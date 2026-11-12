
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
}: TestimonialsProps) {
  const items = (testimonials ?? []).filter(
    (item): item is Testimonial =>
      typeof item === 'object' && item !== null,
  )

  return (
    <section className="bg-[#F8F6F0] px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {eyebrow && (
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-[#D6A84B]" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]">
                {eyebrow}
              </p>
              <span className="h-px w-6 bg-[#D6A84B]" />
            </div>
          )}

          <h2 className="font-serif text-3xl font-normal leading-tight text-[#0B1025] sm:text-4xl md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-5 text-base leading-relaxed text-stone-600">
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
                className="group flex flex-col justify-between border border-stone-200/80 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#D6A84B]/40 hover:shadow-xl"
              >
                <div>
                  <div className="font-serif text-5xl leading-none text-[#D6A84B]">
                    “
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-stone-600 italic">
                    {item.testimonial}
                  </p>
                </div>

                <div className="mt-8 border-t border-stone-100 pt-6">
                  {typeof item.rating === 'number' && (
                    <div
                      className="mb-4 flex gap-1 text-sm text-[#D6A84B]"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {Array.from({ length: item.rating }).map((_, index) => (
                        <span key={index}>★</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.clientName}
                        className="h-12 w-12 rounded-full border border-[#D6A84B]/40 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0B1025] font-serif text-base text-[#D6A84B]">
                        {item.clientName.trim().charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <h3 className="font-serif text-base font-normal text-[#0B1025]">
                        {item.clientName}
                      </h3>

                      {item.designation && (
                        <p className="text-xs uppercase tracking-wider text-stone-500">
                          {item.designation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
