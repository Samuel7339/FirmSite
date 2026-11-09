
import type { Page } from '@/payload-types'

import { HomeHero } from '@/components/sections/HomeHero'
import { AboutFirm } from '@/components/sections/AboutFirm'
import { Contact } from '@/components/sections/Contact'
import { ConsultationForm } from '@/components/sections/ConsultationForm'
import { Recognition } from '@/components/sections/Recognition'
import { PracticeAreasGrid } from '@/components/sections/PracticeAreasGrid'
import { Process } from '@/components/sections/Process'
import { AttorneysGrid } from '@/components/sections/AttorneysGrid'
import { CaseResults } from '@/components/sections/CaseResults'
import { Testimonials } from '@/components/sections/Testimonials'
import { Insights } from '@/components/sections/Insights'
import { OurApproach } from '@/components/sections/OurApproach'
import { FAQs } from '@/components/sections/FAQs'
import { Statistics } from '@/components/sections/Statistics'
import { OfficeLocations } from '@/components/sections/OfficeLocations'
import { FinalCTA } from '@/components/sections/FinalCTA'

type PageLayoutRendererProps = {
  layout: Page['layout']
}

export function PageLayoutRenderer({
  layout,
}: PageLayoutRendererProps) {
  return (
    <>
      {(layout ?? []).map((block, index) => {
        const key = block.id ?? index

        switch (block.blockType) {
          case 'HomeHero':
            return <HomeHero key={key} {...block} />

          case 'aboutFirm':
            return <AboutFirm key={key} {...block} />

          case 'contact':
            return <Contact key={key} {...block} />

          case 'consultationForm':
            return <ConsultationForm key={key} {...block} />

          case 'recognition':
            return <Recognition key={key} {...block} />

          case 'practiceAreasGrid':
            return <PracticeAreasGrid key={key} {...block} />

          case 'process':
            return <Process key={key} {...block} />

          case 'attorneysGrid':
            return <AttorneysGrid key={key} {...block} />

          case 'caseResults':
            return <CaseResults key={key} {...block} />

          case 'testimonials':
            return <Testimonials key={key} {...block} />

          case 'insights':
            return <Insights key={key} {...block} />

          case 'ourApproach':
            return <OurApproach key={key} {...block} />

          case 'faqs':
            return <FAQs key={key} {...block} />

          case 'statistics':
            return <Statistics key={key} {...block} />

          case 'officeLocations':
            return <OfficeLocations key={key} {...block} />

          case 'finalCTA':
            return <FinalCTA key={key} {...block} />

          default:
            return null
        }
      })}
    </>
  )
}

