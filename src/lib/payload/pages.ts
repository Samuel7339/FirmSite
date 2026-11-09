
import 'server-only'

import { draftMode, headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'
import { getAllAttorneys } from '@/lib/payload/attorneys'
import { getAllPracticeAreas } from '@/lib/payload/practiceAreas'

async function getPageBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()

  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false,
  })

  const result = await payload.find({
    collection: 'pages',
    user: authResult.user ?? undefined,
    overrideAccess: false,
    draft: isEnabled,
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

  return {
    ...page,
    layout,
  }
}

export async function getHomePageData() {
  return getPageBySlug('home')
}

export async function getPageData(slug: string) {
  return getPageBySlug(slug)
}
