import type { CollectionConfig } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',

  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'designation', 'sortOrder', 'updatedAt'],
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
          name: 'clientName',
          type: 'text',
          required: true,
          admin: { width: '20%' },
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
          admin: { width: '15%' },
        },
        {
          name: 'designation',
          type: 'text',
          admin: {
            width: '35%',
            description: 'Optional client designation or organization.',
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            width: '25%',
            description: 'Optional rating from 1 to 5.',
          },
        },
      ],
    },

    {
      name: 'testimonial',
      type: 'textarea',
      required: true,
    },

    {
      name: 'clientImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}