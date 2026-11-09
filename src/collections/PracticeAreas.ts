
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'sortOrder', 'updatedAt'],
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
          admin: {
            width: '60%',
          },
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
          admin: {
            width: '40%',
          },
        },
      ],
    },

    slugField({
      fieldToUse: 'title',
    }),

    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short description displayed on practice area cards.',
      },
    },

    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Full description displayed on the practice area detail page.',
      },
    },

    {
      name: 'services',
      type: 'array',
      label: 'Services',
      fields: [
        {
          name: 'service',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
