
import type { Block } from 'payload'

export const Contact: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',

  labels: {
    singular: 'Contact Section',
    plural: 'Contact Sections',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: 'Get In Touch',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Let Us Discuss Your Legal Needs',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
      admin: {
        description: 'Select the form to display in this contact section.',
      },
    },
  ],
}
