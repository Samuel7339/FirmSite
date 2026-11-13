import 'server-only'

import { draftMode, headers } from 'next/headers'
import { getPayloadClient } from '@/lib/payload/getPayloadClient'

export async function getAllPracticeAreas() {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()

  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false,
  })

  const isStaff = Boolean(authResult.user)
  const isDraft = isStaff || isEnabled

  const result = await payload.find({
    collection: 'practice-areas',
    user: authResult.user ?? undefined,
    overrideAccess: false,
    draft: isDraft,
    sort: 'sortOrder',
    depth: 1,
    limit: 100,
  })

  return result.docs
}

export async function getPracticeAreaBySlug(slug: string) {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()

  const authResult = await payload.auth({
    headers: requestHeaders,
    canSetHeaders: false,
  })

  const isStaff = Boolean(authResult.user)
  const isDraft = isStaff || isEnabled

  const result = await payload.find({
    collection: 'practice-areas',
    user: authResult.user ?? undefined,
    overrideAccess: false,
    draft: isDraft,
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
