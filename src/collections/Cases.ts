
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const Cases: CollectionConfig = {
  slug: 'cases',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'caseType', 'sortOrder', 'updatedAt'],
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
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: { width: '60%' },
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
          admin: { width: '40%' },
        },
      ],
    },

    slugField({
      fieldToUse: 'title',
    }),

    {
      name: 'caseType',
      type: 'text',
      required: true,
      admin: {
        description: 'Example: Corporate Dispute, Property Dispute.',
      },
    },

    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },

    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'practiceArea',
      type: 'relationship',
      relationTo: 'practice-areas',
    },

    {
      name: 'outcome',
      type: 'textarea',
      admin: {
        description: 'Publicly approved case outcome or result.',
      },
    },

    {
      name: 'content',
      type: 'richText',
    },

    {
      name: 'caseDate',
      type: 'date',
    },

  ],
}
