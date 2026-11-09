
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const Attorneys: CollectionConfig = {
  slug: 'attorneys',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'sortOrder', 'updatedAt'],
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
          name: 'name',
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
      fieldToUse: 'name',
    }),

    {
      name: 'position',
      type: 'text',
      required: true,
      admin: {
        description: 'Example: Senior Partner, Managing Partner, Associate.',
      },
    },

    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'shortBio',
      type: 'textarea',
      required: true,
    },

    {
      name: 'biography',
      type: 'richText',
    },

    {
      name: 'practiceAreas',
      type: 'relationship',
      relationTo: 'practice-areas',
      hasMany: true,
    },

    {
      name: 'qualifications',
      type: 'array',
      fields: [
        {
          name: 'qualification',
          type: 'text',
          required: true,
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: { width: '50%' },
        },
        {
          name: 'phone',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },

  ],
}
