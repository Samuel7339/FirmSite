
import type { Block } from 'payload'

export const Process: Block = {
  slug: 'process',
  interfaceName: 'ProcessBlock',

  labels: {
    singular: 'Our Process Section',
    plural: 'Our Process Sections',
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
      name: 'steps',
      type: 'relationship',
      relationTo: 'process-steps',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select the process steps to display in this section.',
      },
    },
  ],
}
