
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

type InsightDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function InsightDetailPage({
  params,
}: InsightDetailPageProps) {
  const { slug } = await params

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const post = result.docs[0]

  if (!post) {
    notFound()
  }

  const featuredImage =
    typeof post.featuredImage === 'object' &&
    post.featuredImage !== null
      ? post.featuredImage
      : null

  const author =
    typeof post.author === 'object' && post.author !== null
      ? post.author
      : null

  return (
    <main>
      {/* Article Header */}
      <section className="bg-[#0B1025] py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#D6A84B]">
            Legal Insights
          </p>

          <h1 className="font-serif text-4xl font-semibold leading-tight md:text-6xl">
            {post.title}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-300">
            {post.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
            {author && <span>{author.name}</span>}

            {post.publishedAt && (
              <>
                {author && <span>•</span>}
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {featuredImage?.url && (
        <section className="pt-16">
          <div className="mx-auto max-w-5xl px-6">
            <img
              src={featuredImage.url}
              alt={featuredImage.alt || post.title}
              className="max-h-[600px] w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6">
          <div className="prose max-w-none prose-headings:font-serif prose-headings:text-[#111827] prose-p:leading-8 prose-p:text-gray-600">
            <RichText data={post.content} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-8">
              <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-[#111827]">
                Topics
              </h2>

              <div className="flex flex-wrap gap-3">
                {post.tags.map((item) => (
                  <span
                    key={item.id}
                    className="border border-gray-200 bg-stone-50 px-4 py-2 text-sm text-gray-600"
                  >
                    {item.tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
