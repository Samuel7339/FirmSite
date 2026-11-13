
import type { Page, Faq } from '@/payload-types'
import { payloadEditable } from '@payload-inline-visual-editor/react'

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
  pageId: Page['id']
  pageSlug?: string
  allFaqs?: Faq[]
}

export function PageLayoutRenderer({
  layout,
  pageId,
  pageSlug,
  allFaqs,
}: PageLayoutRendererProps) {
  return (
    <div
      {...payloadEditable.scope({
        collection: 'pages',
        id: pageId,
      })}
      style={{ display: 'contents' }}
    >
      <div
        {...payloadEditable.container('layout')}
        style={{ display: 'contents' }}
      >
        {(layout ?? []).map((block, index) => {
          const key = block.id ?? index
          const editablePath = `layout.${index}`

          let section: React.ReactNode = null

          switch (block.blockType) {
            case 'HomeHero':
              section = (
                <HomeHero {...block} editablePath={editablePath} />
              )
              break

            case 'aboutFirm':
              section = (
                <AboutFirm {...block} editablePath={editablePath} />
              )
              break

            case 'contact':
              section = (
                <Contact {...block} editablePath={editablePath} />
              )
              break

            case 'consultationForm':
              section = (
                <ConsultationForm {...block} editablePath={editablePath} />
              )
              break

            case 'recognition':
              section = (
                <Recognition {...block} editablePath={editablePath} />
              )
              break

            case 'practiceAreasGrid':
              section = (
                <PracticeAreasGrid {...block} editablePath={editablePath} />
              )
              break

            case 'process':
              section = (
                <Process {...block} editablePath={editablePath} />
              )
              break

            case 'attorneysGrid':
              section = (
                <AttorneysGrid {...block} editablePath={editablePath} />
              )
              break

            case 'caseResults':
              section = (
                <CaseResults {...block} editablePath={editablePath} />
              )
              break

            case 'testimonials':
              section = (
                <Testimonials {...block} editablePath={editablePath} />
              )
              break

            case 'insights':
              section = (
                <Insights {...block} editablePath={editablePath} />
              )
              break

            case 'ourApproach':
              section = (
                <OurApproach {...block} editablePath={editablePath} />
              )
              break

            case 'faqs':
              section = (
                <FAQs
                  {...block}
                  editablePath={editablePath}
                  allFaqs={allFaqs}
                  groupByCategory={pageSlug === 'faqs'}
                />
              )
              break

            case 'statistics':
              section = (
                <Statistics {...block} editablePath={editablePath} />
              )
              break

            case 'officeLocations':
              section = (
                <OfficeLocations {...block} editablePath={editablePath} />
              )
              break

            case 'finalCTA':
              section = (
                <FinalCTA {...block} editablePath={editablePath} />
              )
              break

            default:
              return null
          }

          return (
            <div
              key={key}
              {...payloadEditable(editablePath, {
                row: {
                  id: block.id,
                  blockType: block.blockType,
                },
              })}
              style={{ display: 'contents' }}
            >
              {section}
            </div>
          )
        })}
      </div>
    </div>
  )
}
