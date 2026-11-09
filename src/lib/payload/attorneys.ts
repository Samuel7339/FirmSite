
import 'server-only'

import { draftMode, headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

export async function getAllAttorneys() {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()

  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false,
  })

  const result = await payload.find({
    collection: 'attorneys',
    user: authResult.user ?? undefined,
    overrideAccess: false,
    draft: isEnabled,
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  return result.docs
}

export async function getAttorneyBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()

  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false,
  })

  const result = await payload.find({
    collection: 'attorneys',
    user: authResult.user ?? undefined,
    overrideAccess: false,
    draft: isEnabled,
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    limit: 1,
  })

  return result.docs[0] ?? null
}
