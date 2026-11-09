
import type { Block } from 'payload'

type TestimonialsData = {
  viewAllDestinationType?: 'page' | 'custom'
}

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',

  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
  },

  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'What Our Clients Say',
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
    {
      type: 'row',
      fields: [
        {
          name: 'viewAllLabel',
          type: 'text',
          defaultValue: 'View All Testimonials',
          label: 'Button Label',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'viewAllDestinationType',
          type: 'select',
          label: 'Button Destination',
          defaultValue: 'custom',
          options: [
            { label: 'Choose an Existing Page', value: 'page' },
            { label: 'Enter a Custom URL', value: 'custom' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'selectedViewAllPage',
      type: 'select',
      label: 'Select Page',
      options: [
        { label: 'Home', value: '/' },
        { label: 'About Us', value: '/about' },
        { label: 'Practice Areas', value: '/practice-areas' },
        { label: 'Attorneys', value: '/attorneys' },
        { label: 'Cases', value: '/cases' },
        { label: 'Insights', value: '/insights' },
        { label: 'Contact', value: '/contact' },
      ],
      admin: {
        condition: (_, siblingData) =>
          (siblingData as TestimonialsData)?.viewAllDestinationType === 'page',
      },
    },
    {
      name: 'viewAllUrl',
      type: 'text',
      label: 'Custom Button URL',
      defaultValue: '/testimonials',
      admin: {
        condition: (_, siblingData) =>
          (siblingData as TestimonialsData)?.viewAllDestinationType === 'custom',
      },
    },
  ],
}
