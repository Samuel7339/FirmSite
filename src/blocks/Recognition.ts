import type { Block } from 'payload'

export const Recognition: Block = {
  slug: 'recognition',
  interfaceName: 'RecognitionBlock',
  labels: {
    singular: 'Recognition & Awards',
    plural: 'Recognition & Awards Sections',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featuredAwards',
      type: 'array',
      label: 'Featured Award Cards',
      minRows: 3,
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'organization',
          type: 'text',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'recognitions',
      type: 'array',
      label: 'Recognition Items',
      minRows: 6,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'organization',
          type: 'text',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}