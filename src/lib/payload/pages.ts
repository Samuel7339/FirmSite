
import 'server-only'

import { draftMode, headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'
import { getAllAttorneys } from '@/lib/payload/attorneys'
import { getAllPracticeAreas } from '@/lib/payload/practiceAreas'
import { getAllFAQs } from '@/lib/payload/faqs'

type SearchRecord = Record<string, unknown>

export type PageSearchResult = {
  id: string
  title: string
  slug: string
  url: string
  snippet: string
}

export type WebsiteSearchResult = PageSearchResult & {
  type:
    | 'Page'
    | 'Attorney'
    | 'Practice Area'
    | 'Insight'
    | 'Case'
    | 'FAQ'
}

// Extract readable text from Payload content and Lexical rich text.
function extractSearchText(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return value
      .map(extractSearchText)
      .filter(Boolean)
      .join(' ')
  }

  if (!value || typeof value !== 'object') {
    return ''
  }

  const record = value as SearchRecord

  const ignoredKeys = [
    'id',
    '_id',
    'blockType',
    'relationTo',
    'value',
    'url',
    'filename',
    'mimeType',
    'createdAt',
    'updatedAt',
    'sizes',
  ]

  return Object.entries(record)
    .filter(([key]) => !ignoredKeys.includes(key))
    .map(([, child]) => extractSearchText(child))
    .filter(Boolean)
    .join(' ')
}

// Create a short excerpt around the matching keyword.
function createSnippet(content: string, query: string): string {
  const lowerContent = content.toLowerCase()
  const matchIndex = lowerContent.indexOf(query.toLowerCase())

  if (matchIndex === -1) {
    return content.slice(0, 180) + (content.length > 180 ? '...' : '')
  }

  const start = Math.max(0, matchIndex - 70)
  const end = Math.min(content.length, matchIndex + query.length + 110)

  return (
    (start > 0 ? '...' : '') +
    content.slice(start, end).trim() +
    (end < content.length ? '...' : '')
  )
}


async function getPageBySlug(slug: string) {
  const payload = await getPayloadClient()
  const requestHeaders = await headers()
  const { isEnabled: isDraftMode } = await draftMode()

  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false,
  })

  const isStaff = Boolean(authResult.user)
  const isDraft = isStaff || isDraftMode

  const result = await payload.find({
    collection: 'pages',
    user: authResult.user ?? undefined,
    overrideAccess: false,
    draft: isDraft,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2,
  })

  const page = result.docs[0]

  if (!page) return null

  const layout = await Promise.all(
    (page.layout ?? []).map(async (block) => {
      if (
        block.blockType === 'attorneysGrid' &&
        block.displayMode === 'all'
      ) {
        return {
          ...block,
          attorneys: await getAllAttorneys(),
        }
      }

      if (
        block.blockType === 'practiceAreasGrid' &&
        block.displayMode === 'all'
      ) {
        return {
          ...block,
          practiceAreas: await getAllPracticeAreas(),
        }
      }

      return block
    }),
  )

  const allFaqs = slug === 'faqs' ? await getAllFAQs() : undefined

  // Fetch all published awards only when an All Awards section exists.
  const hasAllAwardsSection = layout.some(
    (block) =>
      block.blockType === 'recognition' &&
      block.displayMode === 'all',
  )

  const allAwards = hasAllAwardsSection
    ? (
        await payload.find({
          collection: 'awards',
          overrideAccess: false,
          draft: false,
          depth: 1,
          pagination: false,
          limit: 1000,
          sort: 'sortOrder',
        })
      ).docs
    : undefined

  return {
    ...page,
    layout,
    allFaqs,
    allAwards,
  }
}


export async function getHomePageData() {
  return getPageBySlug('home')
}

export async function getPageData(slug: string) {
  return getPageBySlug(slug)
}

// Search published pages and their reusable block content.
export async function searchPages(
  query: string,
): Promise<PageSearchResult[]> {
  const searchTerm = query.trim()

  if (searchTerm.length < 3) {
    return []
  }

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'pages',
    overrideAccess: false,
    draft: false,
    depth: 0,
    pagination: false,
    limit: 1000,
  })

  const normalizedQuery = searchTerm.toLowerCase()

  const results = result.docs
    .map((page): PageSearchResult | null => {
      const title =
        typeof page.title === 'string' ? page.title : 'Untitled Page'

      const slug =
        typeof page.slug === 'string' ? page.slug : ''

      const layoutText = extractSearchText(page.layout)
      const searchableContent = `${title} ${layoutText}`

      if (!searchableContent.toLowerCase().includes(normalizedQuery)) {
        return null
      }

      return {
        id: String(page.id),
        title,
        slug,
        url: slug === 'home' ? '/' : `/${slug}`,
        snippet: createSnippet(layoutText || title, searchTerm),
      }
    })
    .filter((item): item is PageSearchResult => item !== null)

  return results
}

// Get a searchable text field from a Payload document.
function getSearchField(
  record: SearchRecord,
  field: string,
): string {
  return extractSearchText(record[field])
}

// Get the title or name from a populated relationship.
function getRelatedTitle(value: unknown): string {
  if (!value || typeof value !== 'object') {
    return ''
  }

  const record = value as SearchRecord

  return [
    record.name,
    record.title,
  ]
    .filter((item): item is string => typeof item === 'string')
    .join(' ')
}

// Search all published website content.
export async function searchWebsite(
  query: string,
): Promise<WebsiteSearchResult[]> {
  const searchTerm = query.trim()

  if (searchTerm.length < 3) {
    return []
  }

  const payload = await getPayloadClient()

  const [
    pageResults,
    attorneyResults,
    practiceAreaResults,
    postResults,
    caseResults,
    faqResults,
  ] = await Promise.all([
    searchPages(searchTerm),

    payload.find({
      collection: 'attorneys',
      overrideAccess: false,
      draft: false,
      depth: 1,
      pagination: false,
      limit: 1000,
    }),

    payload.find({
      collection: 'practice-areas',
      overrideAccess: false,
      draft: false,
      depth: 1,
      pagination: false,
      limit: 1000,
    }),

    payload.find({
      collection: 'posts',
      overrideAccess: false,
      draft: false,
      depth: 1,
      pagination: false,
      limit: 1000,
    }),

    payload.find({
      collection: 'cases',
      overrideAccess: false,
      draft: false,
      depth: 1,
      pagination: false,
      limit: 1000,
    }),

    payload.find({
      collection: 'faqs',
      overrideAccess: false,
      draft: false,
      depth: 1,
      pagination: false,
      limit: 1000,
    }),
  ])

  const normalizedQuery = searchTerm.toLowerCase()

  const matchesQuery = (content: string) =>
    content.toLowerCase().includes(normalizedQuery)

  const results: WebsiteSearchResult[] = [
    ...pageResults.map((page) => ({
      ...page,
      type: 'Page' as const,
    })),

    ...attorneyResults.docs.flatMap((doc) => {
      const record = doc as unknown as SearchRecord

      const title = getSearchField(record, 'name')
      const position = getSearchField(record, 'position')
      const bio = getSearchField(record, 'shortBio')
      const practiceAreas = getSearchField(record, 'practiceAreas')

      const content = [
        title,
        position,
        bio,
        practiceAreas,
      ].filter(Boolean).join(' ')

      if (!matchesQuery(content)) return []

      const slug = getSearchField(record, 'slug')

      return [{
        id: String(record.id),
        title: title || 'Untitled Attorney',
        slug,
        url: `/attorneys/${slug}`,
        snippet: createSnippet(content, searchTerm),
        type: 'Attorney' as const,
      }]
    }),

    ...practiceAreaResults.docs.flatMap((doc) => {
      const record = doc as unknown as SearchRecord

      const title = getSearchField(record, 'title')
      const description = getSearchField(record, 'shortDescription')
      const details = getSearchField(record, 'description')
      const services = getSearchField(record, 'services')

      const content = [
        title,
        description,
        details,
        services,
      ].filter(Boolean).join(' ')

      if (!matchesQuery(content)) return []

      const slug = getSearchField(record, 'slug')

      return [{
        id: String(record.id),
        title: title || 'Untitled Practice Area',
        slug,
        url: `/practice-areas/${slug}`,
        snippet: createSnippet(content, searchTerm),
        type: 'Practice Area' as const,
      }]
    }),

    ...postResults.docs.flatMap((doc) => {
      const record = doc as unknown as SearchRecord

      const title = getSearchField(record, 'title')
      const excerpt = getSearchField(record, 'excerpt')
      const contentText = getSearchField(record, 'content')
      const tags = getSearchField(record, 'tags')
      const author = getRelatedTitle(record.author)

      const content = [
        title,
        excerpt,
        contentText,
        tags,
        author,
      ].filter(Boolean).join(' ')

      if (!matchesQuery(content)) return []

      const slug = getSearchField(record, 'slug')

      return [{
        id: String(record.id),
        title: title || 'Untitled Insight',
        slug,
        url: `/insights/${slug}`,
        snippet: createSnippet(content, searchTerm),
        type: 'Insight' as const,
      }]
    }),

    ...caseResults.docs.flatMap((doc) => {
      const record = doc as unknown as SearchRecord

      const title = getSearchField(record, 'title')
      const caseType = getSearchField(record, 'caseType')
      const summary = getSearchField(record, 'summary')
      const outcome = getSearchField(record, 'outcome')
      const details = getSearchField(record, 'content')
      const practiceArea = getRelatedTitle(record.practiceArea)

      const content = [
        title,
        caseType,
        summary,
        outcome,
        details,
        practiceArea,
      ].filter(Boolean).join(' ')

      if (!matchesQuery(content)) return []

      const slug = getSearchField(record, 'slug')

      return [{
        id: String(record.id),
        title: title || 'Untitled Case',
        slug,
        url: `/cases/${slug}`,
        snippet: createSnippet(content, searchTerm),
        type: 'Case' as const,
      }]
    }),

    ...faqResults.docs.flatMap((doc) => {
      const record = doc as unknown as SearchRecord

      const question = getSearchField(record, 'question')
      const answer = getSearchField(record, 'answer')
      const category = getSearchField(record, 'category')
      const practiceArea = getRelatedTitle(record.practiceArea)

      const content = [
        question,
        answer,
        category,
        practiceArea,
      ].filter(Boolean).join(' ')

      if (!matchesQuery(content)) return []

      return [{
        id: String(record.id),
        title: question || 'Untitled FAQ',
        slug: '',
        url: '/faqs',
        snippet: createSnippet(content, searchTerm),
        type: 'FAQ' as const,
      }]
    }),
  ]

  return results
}
