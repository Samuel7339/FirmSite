
import type { Block } from 'payload'

type InsightsData = {
  displayMode?: 'selected' | 'all'
  viewAllLabel?: string
  viewAllDestinationType?: 'page' | 'custom'
}

export const Insights: Block = {
  slug: 'insights',
  interfaceName: 'InsightsBlock',

  labels: {
    singular: 'Insights Section',
    plural: 'Insights Sections',
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
      defaultValue: 'Latest Insights',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Insights Display Mode',
      defaultValue: 'selected',
      options: [
        { label: 'Selected Insights', value: 'selected' },
        { label: 'All Insights', value: 'all' },
      ],
      admin: {
        description:
          'Choose specific insights or automatically display all published posts.',
      },
    },
    {
      name: 'posts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        condition: (_, siblingData) =>
          (siblingData as InsightsData)?.displayMode === 'selected',
        description: 'Select the insights to display in this section.',
      },
      validate: (value, { siblingData }) => {
        const data = siblingData as InsightsData
      
        if (
          data?.displayMode === 'selected' &&
          (!Array.isArray(value) || value.length === 0)
        ) {
          return 'Please select at least one insight.'
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
              Boolean((siblingData as InsightsData)?.viewAllLabel?.trim()),
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
        condition: (_, siblingData) => {
          const data = siblingData as InsightsData
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
          const data = siblingData as InsightsData
          return (
            Boolean(data?.viewAllLabel?.trim()) &&
            data?.viewAllDestinationType === 'custom'
          )
        },
      },
    },
  ],
}
