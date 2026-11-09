
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type CaseDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CaseDetailPage({
  params,
}: CaseDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'cases',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const caseStudy = result.docs[0]

  if (!caseStudy) {
    notFound()
  }

  const featuredImage =
    typeof caseStudy.featuredImage === 'object' &&
    caseStudy.featuredImage !== null
      ? caseStudy.featuredImage
      : null

  const practiceArea =
    typeof caseStudy.practiceArea === 'object' &&
    caseStudy.practiceArea !== null
      ? caseStudy.practiceArea
      : null

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#0B1025] py-24 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#D6A84B]">
            {caseStudy.caseType}
          </p>

          <h1 className="font-serif text-4xl font-semibold md:text-6xl">
            {caseStudy.title}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-300">
            {caseStudy.summary}
          </p>
        </div>
      </section>

      {/* Case Details */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          {featuredImage?.url && (
            <img
              src={featuredImage.url}
              alt={featuredImage.alt || caseStudy.title}
              className="mb-12 max-h-[550px] w-full object-cover"
            />
          )}

          <div className="grid gap-8 border-b border-gray-200 pb-10 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                Case Type
              </p>
              <p className="mt-2 text-gray-700">{caseStudy.caseType}</p>
            </div>

            {practiceArea && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                  Practice Area
                </p>
                <p className="mt-2 text-gray-700">{practiceArea.title}</p>
              </div>
            )}

            {caseStudy.caseDate && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
                  Case Date
                </p>
                <p className="mt-2 text-gray-700">
                  {new Date(caseStudy.caseDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Case Content */}
          {caseStudy.content && (
            <div className="py-12">
              <h2 className="mb-8 font-serif text-3xl font-semibold text-[#111827]">
                Case Overview
              </h2>

              <div className="prose max-w-none prose-headings:font-serif prose-headings:text-[#111827] prose-p:leading-8 prose-p:text-gray-600">
                <RichText data={caseStudy.content} />
              </div>
            </div>
          )}

          {/* Outcome */}
          {caseStudy.outcome && (
            <div className="mt-8 border-l-4 border-[#D6A84B] bg-stone-50 p-8">
              <h2 className="mb-4 font-serif text-2xl font-semibold text-[#111827]">
                Case Outcome
              </h2>

              <p className="leading-8 text-gray-600">
                {caseStudy.outcome}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
