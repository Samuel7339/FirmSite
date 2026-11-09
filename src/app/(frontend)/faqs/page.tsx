
import { notFound } from 'next/navigation'

import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

export default async function FAQsPage() {
  const page = await getPageData('faqs')

  if (!page) {
    notFound()
  }

  return <PageLayoutRenderer layout={page.layout ?? []} />
}

