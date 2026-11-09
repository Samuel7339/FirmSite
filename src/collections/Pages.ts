
import { slugField, type CollectionConfig } from 'payload'

import {
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
  adminOnly,
} from '../access/accessControl'

import { HomeHero } from '../blocks/HomeHero'
import { AboutFirm } from '../blocks/AboutFirm'
import { Contact } from '../blocks/Contact'
import { ConsultationForm } from '../blocks/ConsultationForm'
import { Recognition } from '../blocks/Recognition'
import { PracticeAreasGrid } from '../blocks/PracticeAreasGrid'
import { Process } from '../blocks/Process'
import { AttorneysGrid } from '../blocks/AttorneysGrid'
import { CaseResults } from '../blocks/CaseResults'
import { Testimonials } from '../blocks/Testimonials'
import { Insights } from '../blocks/Insights'
import { OurApproach } from '../blocks/OurApproach'
import { FAQs } from '../blocks/FAQs'
import { Statistics } from '../blocks/Statistics'
import { OfficeLocations } from '../blocks/OfficeLocations'
import { FinalCTA } from '../blocks/FinalCTA'

export const Pages: CollectionConfig = {
  slug: 'pages',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Website Content',
  },

  access: {
    read: publishedOrStaff,
    create: adminOrEditorCreateDraft,
    update: adminPublishEditorDraftUpdate,
    delete: adminOnly,
  },

  versions: {
    drafts: true,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'title',
    }),
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      admin: {
        description:
          'Build your page by adding, editing, and arranging the available website sections.',
      },
      blocks: [
        HomeHero,
        AboutFirm,
        Contact,
        ConsultationForm,
        Recognition,
        PracticeAreasGrid,
        Process,
        AttorneysGrid,
        CaseResults,
        Testimonials,
        Insights,
        OurApproach,
        FAQs,
        Statistics,
        OfficeLocations,
        FinalCTA,
      ],
    },
  ],
}
