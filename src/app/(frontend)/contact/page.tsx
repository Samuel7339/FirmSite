
import { notFound } from 'next/navigation'
import { getPageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

export default async function ContactPage() {
  const page = await getPageData('contact')

  if (!page) {
    notFound()
  }

  return (
    <main>
      <PageLayoutRenderer layout={page.layout} />
    </main>
  )
}
