
import type { Block } from 'payload'

type ButtonData = {
  destinationType?: 'page' | 'custom'
}

const pageOptions = [
  { label: 'Home', value: '/' },
  { label: 'About Us', value: '/about' },
  { label: 'Practice Areas', value: '/practice-areas' },
  { label: 'Attorneys', value: '/attorneys' },
  { label: 'Cases', value: '/cases' },
  { label: 'Insights', value: '/insights' },
  { label: 'Contact', value: '/contact' },
]

export const OurApproach: Block = {
  slug: 'ourApproach',
  interfaceName: 'OurApproachBlock',

  labels: {
    singular: 'Our Approach Section',
    plural: 'Our Approach Sections',
  },

  fields: [
    // Section Heading
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
          defaultValue: 'Preparation Before Argument',
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
      type: 'row',
      fields: [
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          admin: {
            width: '30%',
          },
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
          admin: {
            width: '35%',
          },
        },
        {
          name: 'selectedPage',
          type: 'select',
          label: 'Select Page',
          options: pageOptions,
          admin: {
            width: '35%',
            condition: (_, siblingData) =>
              (siblingData as ButtonData)?.destinationType === 'page',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          label: 'Custom Button URL',
          admin: {
            width: '35%',
            condition: (_, siblingData) =>
              (siblingData as ButtonData)?.destinationType === 'custom',
          },
        },
      ],
    },
  ],
}
