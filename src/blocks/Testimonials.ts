import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',

  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
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
          defaultValue: 'What Our Clients Say',
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
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select the testimonials to display in this section.',
      },
      validate: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return 'Please select at least one testimonial.'
        }

        return true
      },
    },
  ],
}