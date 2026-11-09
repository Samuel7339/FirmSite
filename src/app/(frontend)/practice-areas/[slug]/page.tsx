
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type PracticeAreaDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function PracticeAreaDetailPage({
  params,
}: PracticeAreaDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'practice-areas',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const practiceArea = result.docs[0]

  if (!practiceArea) {
    notFound()
  }

  return (
    <main>
      {/* Hero */}
      <section className="bg-[#0B1025] py-24 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#D6A84B]">
            Our Practice Areas
          </p>

          <h1 className="font-serif text-4xl font-semibold md:text-6xl">
            {practiceArea.title}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-300">
            {practiceArea.shortDescription}
          </p>
        </div>
      </section>

      {/* Full Description */}
      {practiceArea.description && (
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 font-serif text-3xl font-semibold text-[#111827]">
              Understanding Our {practiceArea.title} Services
            </h2>

            <div className="prose max-w-none prose-headings:font-serif prose-headings:text-[#111827] prose-p:leading-8 prose-p:text-gray-600">
              <RichText data={practiceArea.description} />
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {practiceArea.services && practiceArea.services.length > 0 && (
        <section className="bg-stone-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                What We Offer
              </p>

              <h2 className="font-serif text-3xl font-semibold text-[#111827] md:text-4xl">
                Our {practiceArea.title} Services
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {practiceArea.services.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 bg-white p-7"
                >
                  <h3 className="font-serif text-xl font-semibold text-[#111827]">
                    {item.service}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
