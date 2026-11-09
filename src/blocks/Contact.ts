
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
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Get In Touch',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Let Us Discuss Your Legal Needs',
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
  ],
}


