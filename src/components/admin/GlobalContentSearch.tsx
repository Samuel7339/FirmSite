
'use client'

import { useEffect, useRef, useState } from 'react'

type SearchDocument = {
  id: string | number
  title: string
  doc?: {
    relationTo: string
    value: string | number | { id: string | number }
  }
}

type SearchResponse = {
  docs: SearchDocument[]
}

export default function GlobalContentSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchDocument[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const term = searchTerm.trim()

    if (term.length < 2) {
      setResults([])
      setError('')
      setIsLoading(false)
      return
    }

    const controller = new AbortController()

    const timeout = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError('')

        const params = new URLSearchParams({
          'where[title][like]': term,
          limit: '10',
          depth: '0',
          sort: '-priority',
        })

        const response = await fetch(`/api/search?${params}`, {
          signal: controller.signal,
          credentials: 'same-origin',
        })

        if (!response.ok) {
          throw new Error('Search failed. Please try again.')
        }

        const data: SearchResponse = await response.json()

        setResults(data.docs || [])
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
          setResults([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 350)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const getDocumentURL = (item: SearchDocument) => {
    if (!item.doc) return ''

    const documentID =
      typeof item.doc.value === 'object'
        ? item.doc.value.id
        : item.doc.value

    if (documentID === undefined || documentID === null) return ''

    return `/admin/collections/${item.doc.relationTo}/${encodeURIComponent(String(documentID))}`
  }

  const getCollectionLabel = (slug: string) => {
    const labels: Record<string, string> = {
      attorneys: 'Attorney',
      'practice-areas': 'Practice Area',
      posts: 'Insight',
      cases: 'Case',
      faqs: 'FAQ',
      pages: 'Page',
    }

    return labels[slug] || slug.replaceAll('-', ' ')
  }

  return (
    <div
      ref={wrapperRef}
      className="relative w-[min(320px,38vw)] min-w-[190px] max-md:w-[220px] max-sm:w-[180px]"
    >
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A17C4B]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </span>

        <input
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search content..."
          aria-label="Search website content"
          className="h-10 w-full rounded-lg border border-[#DED9D0] bg-[#FCFBF9] pl-10 pr-9 text-[13px] text-[#192B3D] outline-none transition placeholder:text-[#929BA3] focus:border-[#A17C4B] focus:ring-2 focus:ring-[#A17C4B]/10"
        />

        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A17C4B]">
            ...
          </span>
        )}
      </div>

      {isOpen && searchTerm.trim().length >= 2 && (
        <div className="absolute right-0 top-full z-[100] mt-2 max-h-[360px] w-[min(360px,85vw)] overflow-y-auto rounded-xl border border-[#E7E2D9] bg-white py-2 shadow-xl">
          {isLoading && (
            <p className="px-4 py-3 text-xs text-[#87919B]">
              Searching content...
            </p>
          )}

          {!isLoading && error && (
            <p className="px-4 py-3 text-xs text-red-600">
              {error}
            </p>
          )}

          {!isLoading && !error && results.length === 0 && (
            <p className="px-4 py-3 text-xs text-[#87919B]">
              No matching content found.
            </p>
          )}

          {!isLoading &&
            results.map((item) => {
              const href = getDocumentURL(item)

              return (
                <a
                  key={item.id}
                  href={href || undefined}
                  onClick={(event) => {
                    if (!href) {
                      event.preventDefault()
                      return
                    }

                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className="flex items-center justify-between gap-3 px-4 py-3 no-underline transition hover:bg-[#F8F6F1]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#192B3D]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[11px] capitalize text-[#929BA3]">
                      {item.doc
                        ? getCollectionLabel(item.doc.relationTo)
                        : 'Content'}
                    </p>
                  </div>

                  <span className="shrink-0 text-sm text-[#A17C4B]">
                    →
                  </span>
                </a>
              )
            })}
        </div>
      )}
    </div>
  )
}
