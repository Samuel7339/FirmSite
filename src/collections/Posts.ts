
import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const Posts: CollectionConfig = {
  slug: 'posts',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'publishedAt', 'updatedAt'],
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short introduction displayed on article cards.',
      },
    },

    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'content',
      type: 'richText',
      required: true,
    },

    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'attorneys',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'publishedAt',
          type: 'date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },

    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
