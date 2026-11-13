import 'server-only'

import { draftMode, headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'
import { getAllAttorneys } from '@/lib/payload/attorneys'
import { getAllPracticeAreas } from '@/lib/payload/practiceAreas'
import { getAllFAQs } from '@/lib/payload/faqs'

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

  return {
    ...page,
    layout,
    allFaqs,
  }
}
   
export async function getHomePageData() {
  return getPageBySlug('home')
}

export async function getPageData(slug: string) {
  return getPageBySlug(slug)
}
