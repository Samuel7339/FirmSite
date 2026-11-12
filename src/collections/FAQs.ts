import type { CollectionConfig } from 'payload'

import {
  adminOnly,
  adminOrEditorCreateDraft,
  adminPublishEditorDraftUpdate,
  publishedOrStaff,
} from '../access/accessControl'

export const FAQs: CollectionConfig = {
  slug: 'faqs',

  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'sortOrder', 'updatedAt'],
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
      name: 'question',
      type: 'text',
      required: true,
    },

    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },

    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'general',
          options: [
            { label: 'General', value: 'general' },
            { label: 'Practice Areas', value: 'practice-areas' },
            { label: 'Attorneys', value: 'attorneys' },
            { label: 'Cases', value: 'cases' },
            { label: 'Consultation', value: 'consultation' },
          ],
          admin: { width: '30%' },
        },
        {
          name: 'sortOrder',
          type: 'number',
          defaultValue: 0,
          admin: { width: '30%' },
        },
        {
          name: 'practiceArea',
          type: 'relationship',
          relationTo: 'practice-areas',
          admin: {
            width: '40%',
            description: 'Optional: associate this FAQ with a practice area.',
            condition: (_, siblingData) =>
              siblingData?.category === 'practice-areas',
          },
        },
      ],
    },
  ],
}