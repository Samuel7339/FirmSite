
import 'server-only'

import { draftMode, headers } from 'next/headers'
import type { Faq } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

export async function getAllFAQs(): Promise<Faq[]> {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()

  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false,
  })

  const result = await payload.find({
    collection: 'faqs',
    user: authResult.user ?? undefined,
    overrideAccess: false,
    draft: isEnabled,
    sort: 'sortOrder',
    limit: 100,
    depth: 1,
  })

  return result.docs
}
