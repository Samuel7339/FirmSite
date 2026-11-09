
import { getHomePageData } from '@/lib/payload/pages'
import { PageLayoutRenderer } from '@/components/layout/PageLayoutRenderer'

export default async function HomePage() {
  const homePage = await getHomePageData()

  if (!homePage) {
    return <main>Homepage not available.</main>
  }

  return (
    <main>
      <PageLayoutRenderer layout={homePage.layout} />
    </main>
  )
}
