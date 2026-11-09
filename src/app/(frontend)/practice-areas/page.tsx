
import { notFound } from 'next/navigation'
import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

export default async function PracticeAreasPage() {
  const page = await getPageData('practice-areas')

  if (!page) {
    notFound()
  }

  return (
    <main>
      <PageLayoutRenderer layout={page.layout} />
    </main>
  )
}
