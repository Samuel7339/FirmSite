
import type { Block } from 'payload'

type ButtonData = {
  destinationType?: 'page' | 'custom'
}

export const OurApproach: Block = {
  slug: 'ourApproach',
  interfaceName: 'OurApproachBlock',

  labels: {
    singular: 'Our Approach Section',
    plural: 'Our Approach Sections',
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
      defaultValue: 'Preparation Before Argument',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },

    // Button
    {
      name: 'buttonLabel',
      type: 'text',
      label: 'Button Label',
    },
    {
      name: 'destinationType',
      type: 'select',
      label: 'Button Destination',
      defaultValue: 'custom',
      options: [
        { label: 'Choose an Existing Page', value: 'page' },
        { label: 'Enter a Custom URL', value: 'custom' },
      ],
    },
    {
      name: 'selectedPage',
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
