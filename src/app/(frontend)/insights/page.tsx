import { notFound } from 'next/navigation'
import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

export default async function InsightsPage() {
  const page = await getPageData('insights')

  if (!page) {
    notFound()
  }

  return (
    <main>
      <PageLayoutRenderer layout={page.layout} />
    </main>
  )
}