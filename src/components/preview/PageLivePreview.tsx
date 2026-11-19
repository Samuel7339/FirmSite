'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import type {
  Page,
  Faq,
  Award,
  AttorneysGridBlock,
  PracticeAreasGridBlock,
  CaseResultsBlock,
  InsightsBlock,
} from '@/payload-types'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

type LivePreviewPage = Page & {
  allFaqs?: Faq[]
  allAwards?: Award[]
}

type PageLivePreviewProps = {
  page: LivePreviewPage
  pageSlug?: string
}

export function PageLivePreview({
  page: initialPage,
  pageSlug,
}: PageLivePreviewProps) {
  // Use current browser window origin if in browser, otherwise fallback to configured server URL
  const serverURL =
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const { data } = useLivePreview<LivePreviewPage>({
    initialData: initialPage,
    serverURL,
    depth: 2,
  })

  // Ensure server-populated collections are preserved if not present in incoming live preview data
  const allFaqs = data?.allFaqs ?? initialPage.allFaqs
  const allAwards = data?.allAwards ?? initialPage.allAwards

  // Find fallback collections from initialPage layout if available
  const fallbackAttorneys = (initialPage.layout ?? []).find(
    (b) =>
      b.blockType === 'attorneysGrid' &&
      (b as AttorneysGridBlock).attorneys &&
      (b as AttorneysGridBlock).attorneys!.length > 0,
  ) as AttorneysGridBlock | undefined

  const fallbackPracticeAreas = (initialPage.layout ?? []).find(
    (b) =>
      b.blockType === 'practiceAreasGrid' &&
      (b as PracticeAreasGridBlock).practiceAreas &&
      (b as PracticeAreasGridBlock).practiceAreas!.length > 0,
  ) as PracticeAreasGridBlock | undefined

  const fallbackCases = (initialPage.layout ?? []).find(
    (b) =>
      b.blockType === 'caseResults' &&
      (b as CaseResultsBlock).cases &&
      (b as CaseResultsBlock).cases!.length > 0,
  ) as CaseResultsBlock | undefined

  const fallbackPosts = (initialPage.layout ?? []).find(
    (b) =>
      b.blockType === 'insights' &&
      (b as InsightsBlock).posts &&
      (b as InsightsBlock).posts!.length > 0,
  ) as InsightsBlock | undefined

  // Preserve server-populated collections for blocks when in 'all' displayMode
  const layout = (data?.layout ?? initialPage.layout ?? []).map((block, index) => {
    const initialBlock =
      initialPage.layout?.find((b) => b.id && b.id === block.id) ??
      initialPage.layout?.[index]

    if (
      block.blockType === 'attorneysGrid' &&
      block.displayMode === 'all' &&
      (!block.attorneys || block.attorneys.length === 0)
    ) {
      return {
        ...block,
        attorneys:
          (initialBlock as AttorneysGridBlock)?.attorneys ||
          fallbackAttorneys?.attorneys,
      }
    }

    if (
      block.blockType === 'practiceAreasGrid' &&
      block.displayMode === 'all' &&
      (!block.practiceAreas || block.practiceAreas.length === 0)
    ) {
      return {
        ...block,
        practiceAreas:
          (initialBlock as PracticeAreasGridBlock)?.practiceAreas ||
          fallbackPracticeAreas?.practiceAreas,
      }
    }

    if (
      block.blockType === 'caseResults' &&
      block.displayMode === 'all' &&
      (!block.cases || block.cases.length === 0)
    ) {
      return {
        ...block,
        cases:
          (initialBlock as CaseResultsBlock)?.cases || fallbackCases?.cases,
      }
    }

    if (
      block.blockType === 'insights' &&
      block.displayMode === 'all' &&
      (!block.posts || block.posts.length === 0)
    ) {
      return {
        ...block,
        posts:
          (initialBlock as InsightsBlock)?.posts || fallbackPosts?.posts,
      }
    }

    return block
  })

  return (
    <main>
      <PageLayoutRenderer
        layout={layout}
        pageId={data?.id || initialPage.id}
        pageSlug={pageSlug}
        allFaqs={allFaqs}
        allAwards={allAwards}
      />
    </main>
  )
}
