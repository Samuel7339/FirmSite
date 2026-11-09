
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type AttorneyDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function AttorneyDetailPage({
  params,
}: AttorneyDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'attorneys',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const attorney = result.docs[0]

  if (!attorney) {
    notFound()
  }

  const portrait =
    typeof attorney.portrait === 'object' && attorney.portrait !== null
      ? attorney.portrait
      : null

  const practiceAreas = (attorney.practiceAreas ?? []).filter(
    (item) => typeof item === 'object' && item !== null,
  )

  return (
    <main>
      {/* Attorney Profile */}
      <section className="bg-[#0B1025] py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">

          {/* Portrait */}
          <div>
            {portrait?.url && (
              <img
                src={portrait.url}
                alt={portrait.alt || attorney.name}
                className="max-h-[600px] w-full object-cover"
              />
            )}
          </div>

          {/* Basic Information */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D6A84B]">
              Attorney Profile
            </p>

            <h1 className="font-serif text-4xl font-semibold md:text-6xl">
              {attorney.name}
            </h1>

            <p className="mt-4 text-lg text-[#D6A84B]">
              {attorney.position}
            </p>

            <p className="mt-8 max-w-xl leading-8 text-gray-300">
              {attorney.shortBio}
            </p>

            {attorney.email && (
              <p className="mt-8">
                <a
                  href={`mailto:${attorney.email}`}
                  className="text-sm text-gray-200 transition hover:text-[#D6A84B]"
                >
                  {attorney.email}
                </a>
              </p>
            )}

            {attorney.phone && (
              <p className="mt-3">
                <a
                  href={`tel:${attorney.phone}`}
                  className="text-sm text-gray-200 transition hover:text-[#D6A84B]"
                >
                  {attorney.phone}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Biography */}
      {attorney.biography && (
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 font-serif text-3xl font-semibold text-[#111827]">
              Professional Biography
            </h2>

            <div className="prose max-w-none prose-headings:font-serif prose-headings:text-[#111827] prose-p:leading-8 prose-p:text-gray-600">
              <RichText data={attorney.biography} />
            </div>
          </div>
        </section>
      )}

      {/* Practice Areas */}
      {practiceAreas.length > 0 && (
        <section className="bg-stone-50 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 font-serif text-3xl font-semibold text-[#111827]">
              Practice Areas
            </h2>

            <div className="flex flex-wrap gap-4">
              {practiceAreas.map((area) => (
                <span
                  key={area.id}
                  className="border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700"
                >
                  {area.title}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Qualifications */}
      {attorney.qualifications &&
        attorney.qualifications.length > 0 && (
          <section className="py-16">
            <div className="mx-auto max-w-4xl px-6">
              <h2 className="mb-8 font-serif text-3xl font-semibold text-[#111827]">
                Qualifications
              </h2>

              <ul className="space-y-4">
                {attorney.qualifications.map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-gray-200 pb-4 text-gray-600"
                  >
                    {item.qualification}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
    </main>
  )
}
