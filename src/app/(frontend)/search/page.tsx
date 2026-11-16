
import type { Metadata } from 'next'
import Link from 'next/link'
import { searchWebsite } from '@/lib/payload/pages'

export const metadata: Metadata = {
    title: 'Search | Legal Services',
    description: 'Search our website for legal services and information.',
}

type SearchPageProps = {
    searchParams: Promise<{
        q?: string | string[]
    }>
}

function HighlightText({
    text,
    query,
}: {
    text: string
    query: string
}) {
    if (!query.trim()) return <>{text}</>

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'))

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark
                        key={index}
                        className="rounded-sm bg-amber-200 px-0.5 text-inherit"
                    >
                        {part}
                    </mark>
                ) : (
                    part
                ),
            )}
        </>
    )
}

export default async function SearchPage({
    searchParams,
}: SearchPageProps) {
    const params = await searchParams
    const rawQuery = params.q
    const query = Array.isArray(rawQuery) ? rawQuery[0] : rawQuery || ''

    const isValidQuery = query.trim().length >= 3

    const results = isValidQuery ? await searchWebsite(query) : []

    return (
        <main className="min-h-screen bg-[#F8F7F4]">
            <section className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
                <div className="mb-10">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                        Website Search
                    </p>

                    <h1 className="font-serif text-4xl font-semibold text-[#172337] md:text-5xl">
                        Search Results
                    </h1>

                    {query.trim() && (
                        <p className="mt-4 text-base text-gray-600">
                            Results for: <strong className="text-[#172337]">{query}</strong>
                        </p>
                    )}
                </div>

                <form action="/search" method="GET" className="mb-12">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                            type="search"
                            name="q"
                            minLength={3}
                            defaultValue={query}
                            placeholder="Search for legal information..."
                            className="min-h-14 flex-1 border border-gray-300 bg-white px-5 text-base text-gray-800 outline-none transition focus:border-amber-600"
                        />

                        <button
                            type="submit"
                            className="min-h-14 bg-[#172337] px-8 font-semibold text-white transition hover:bg-[#263b59]"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {!isValidQuery ? (
                    <p className="text-gray-600">
                        {query.trim()
                            ? 'Please enter at least 3 characters to search.'
                            : 'Enter at least 3 characters to search our website.'}
                    </p>
                ) : results.length > 0 ? (
                    <div>
                        <p className="mb-6 text-sm text-gray-500">
                            {results.length} {results.length === 1 ? 'result' : 'results'} found
                        </p>

                        <div className="space-y-6">
                            {results.map((result) => (
                                <article
                                    key={result.id}
                                    className="border-b border-gray-200 pb-6"
                                >
                                    <Link
                                        href={result.url}
                                        className="font-serif text-2xl font-semibold text-[#172337] transition hover:text-amber-700"
                                    >
                                        <HighlightText text={result.title} query={query} />
                                    </Link>

                                    <p className="mt-3 leading-7 text-gray-600">
                                        <HighlightText text={result.snippet} query={query} />
                                    </p>

                                    <Link
                                        href={result.url}
                                        className="mt-4 inline-block text-sm font-semibold text-amber-700 hover:text-amber-800"
                                    >
                                        Read More →
                                    </Link>
                                    {/* <span>{result.type}</span> */}
                                </article>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="border border-gray-200 bg-white px-6 py-12 text-center">
                        <h2 className="font-serif text-2xl font-semibold text-[#172337]">
                            No results found
                        </h2>
                        <p className="mt-3 text-gray-600">
                            We couldn't find any pages matching "{query}". Try another keyword.
                        </p>
                    </div>
                )}
            </section>
        </main>
    )
}
