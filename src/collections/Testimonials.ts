
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

    {
      name: 'designation',
      type: 'text',
      admin: {
        description: 'Optional client designation or organization.',
      },
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

    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      admin: {
        description: 'Optional rating from 1 to 5.',
      },
    },

    
  ],
}
