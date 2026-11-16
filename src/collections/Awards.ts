
import type { CollectionConfig } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const Awards: CollectionConfig = {
  slug: 'awards',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'organization', 'sortOrder'],
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
          name: 'category',
          type: 'select',
          label: 'Category',
          required: true,
          options: [
            {
              label: 'Award',
              value: 'award',
            },
            {
              label: 'Recognition',
              value: 'recognition',
            },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'organization',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
            description: 'Name of the organization that granted the award or recognition.',
          },
        },
        {
          name: 'sortOrder',
          type: 'number',
          label: 'Sort Order',
          min: 0,
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
      admin: {
        description: 'Optional details about this award or recognition.',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description:
          'Optional Lucide icon name, for example: trophy, award, star, scale.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional logo or image for this award or recognition.',
      },
    },
  ],
}
