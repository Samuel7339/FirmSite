
import type { Block } from 'payload'

type FAQsData = {
  viewAllLabel?: string
  viewAllDestinationType?: 'page' | 'custom'
}

export const FAQs: Block = {
  slug: 'faqs',
  interfaceName: 'FAQsBlock',

  labels: {
    singular: 'FAQs Section',
    plural: 'FAQs Sections',
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
      defaultValue: 'Frequently Asked Questions',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      required: true,
      admin: {
        description: 'Select the FAQs to display in this section.',
      },
      validate: (value) => {
        if (!Array.isArray(value) || value.length === 0) {
          return 'Please select at least one FAQ.'
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
          label: 'Button Label',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'viewAllDestinationType',
          type: 'select',
          label: 'Button Destination',
          options: [
            { label: 'Choose an Existing Page', value: 'page' },
            { label: 'Enter a Custom URL', value: 'custom' },
          ],
          admin: {
            width: '50%',
            condition: (_, siblingData) =>
              Boolean((siblingData as FAQsData)?.viewAllLabel?.trim()),
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
        { label: 'FAQs', value: '/faqs' },
        { label: 'Contact', value: '/contact' },
      ],
      admin: {
        condition: (_, siblingData) => {
          const data = siblingData as FAQsData
          return (
            Boolean(data?.viewAllLabel?.trim()) &&
            data?.viewAllDestinationType === 'page'
          )
        },
      },
    },
    {
      name: 'viewAllUrl',
      type: 'text',
      label: 'Custom Button URL',
      admin: {
        condition: (_, siblingData) => {
          const data = siblingData as FAQsData
          return (
            Boolean(data?.viewAllLabel?.trim()) &&
            data?.viewAllDestinationType === 'custom'
          )
        },
      },
    },
  ],
}
