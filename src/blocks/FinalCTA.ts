
import type { Block } from 'payload'

type ButtonData = {
  destinationType?: 'page' | 'custom'
}

export const FinalCTA: Block = {
  slug: 'finalCTA',
  interfaceName: 'FinalCTABlock',

  labels: {
    singular: 'Final CTA Section',
    plural: 'Final CTA Sections',
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
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
      required: true,
      defaultValue: 'Schedule a Consultation',
    },
    {
      name: 'destinationType',
      type: 'select',
      label: 'Button Destination',
      defaultValue: 'page',
      options: [
        { label: 'Choose an Existing Page', value: 'page' },
        { label: 'Enter a Custom URL', value: 'custom' },
      ],
    },
    {
      name: 'selectedPage',
      type: 'select',
      label: 'Select Page',
      defaultValue: '/contact',
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
          (siblingData as ButtonData)?.destinationType === 'page',
      },
    },
    {
      name: 'customUrl',
      type: 'text',
      label: 'Custom Button URL',
      admin: {
        condition: (_, siblingData) =>
          (siblingData as ButtonData)?.destinationType === 'custom',
      },
    },
  ],
}
