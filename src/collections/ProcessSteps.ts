
import type { CollectionConfig } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const ProcessSteps: CollectionConfig = {
  slug: 'process-steps',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sortOrder'],
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
            width: '50%',
          },
        },
        {
          name: 'sortOrder',
          type: 'number',
          label: 'Sort Order',
          min: 0,
          defaultValue: 0,
          admin: {
            width: '50%',
            description: 'Controls the display order. Lower numbers appear first.',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
  ],
}
