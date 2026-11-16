
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

export const AboutFirm: Block = {
  slug: 'aboutFirm',
  interfaceName: 'AboutFirmBlock',

  labels: {
    singular: 'About Firm Section',
    plural: 'About Firm Sections',
  },

  fields: [
    // Section Heading
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: 'Who We Are',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'About Our Firm',
          admin: {
            width: '50%',
          },
        },
      ],
    },

    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    {
      name: 'description',
      type: 'richText',
      required: true,
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
            width: '25%',
          },
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
            width: '40%',
            condition: (_, siblingData) =>
              (siblingData as ButtonData)?.destinationType === 'page',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          label: 'Custom Button URL',
          admin: {
            width: '40%',
            condition: (_, siblingData) =>
              (siblingData as ButtonData)?.destinationType === 'custom',
          },
        },
      ],
    },
  ],
}
