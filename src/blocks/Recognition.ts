
import type { Block } from 'payload'

type RecognitionData = {
  displayMode?: 'selected' | 'all'
}

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
          defaultValue: 'Recognised for Our Commitment to Excellence',
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
      name: 'displayMode',
      type: 'select',
      label: 'Awards Display Mode',
      defaultValue: 'selected',
      options: [
        {
          label: 'Selected Awards & Recognitions',
          value: 'selected',
        },
        {
          label: 'All Awards & Recognitions',
          value: 'all',
        },
      ],
      admin: {
        description:
          'Choose specific awards and recognitions or automatically display all published records.',
      },
    },
    {
      name: 'awards',
      type: 'relationship',
      relationTo: 'awards',
      hasMany: true,
      admin: {
        condition: (_, siblingData) =>
          (siblingData as RecognitionData)?.displayMode === 'selected',
        description:
          'Select the awards and recognitions to display in this section.',
      },
      validate: (value, { siblingData }) => {
        const data = siblingData as RecognitionData

        if (
          data?.displayMode === 'selected' &&
          (!Array.isArray(value) || value.length === 0)
        ) {
          return 'Please select at least one award or recognition.'
        }

        return true
      },
    },
  ],
}
