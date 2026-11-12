import type { Block } from 'payload'

export const Statistics: Block = {
  slug: 'statistics',
  interfaceName: 'StatisticsBlock',
  labels: {
    singular: 'Statistics Section',
    plural: 'Statistics Sections',
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
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'statistics',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: {
                width: '30%',
                description: 'Example: 20+, 500+, 95%.',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                width: '30%',
              },
            },
            {
              name: 'description',
              type: 'text',
              admin: {
                width: '40%',
              },
            },
          ],
        },
      ],
    },
  ],
}