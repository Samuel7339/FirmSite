
import type { Block } from 'payload'

type AttorneysGridData = {
  displayMode?: 'selected' | 'all'
  viewAllLabel?: string
  viewAllDestinationType?: 'page' | 'custom'
}

export const AttorneysGrid: Block = {
  slug: 'attorneysGrid',
  interfaceName: 'AttorneysGridBlock',

  labels: {
    singular: 'Attorneys Section',
    plural: 'Attorneys Sections',
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
          defaultValue: 'Meet Our Attorneys',
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
      name: 'displayMode',
      type: 'select',
      label: 'Attorney Display Mode',
      defaultValue: 'selected',
      options: [
        { label: 'Selected Attorneys', value: 'selected' },
        { label: 'All Attorneys', value: 'all' },
      ],
      admin: {
        description:
          'Choose specific attorneys or automatically display all published attorneys.',
      },
    },
    {
      name: 'attorneys',
      type: 'relationship',
      relationTo: 'attorneys',
      hasMany: true,
      admin: {
        condition: (_, siblingData) =>
          (siblingData as AttorneysGridData)?.displayMode === 'selected',
        description: 'Select the attorneys to display in this section.',
      },
      validate: (value, { siblingData }) => {
        const data = siblingData as AttorneysGridData

        if (
          data?.displayMode === 'selected' &&
          (!Array.isArray(value) || value.length === 0)
        ) {
          return 'Please select at least one attorney.'
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
              Boolean(
                (siblingData as AttorneysGridData)?.viewAllLabel?.trim(),
              ),
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
          const data = siblingData as AttorneysGridData

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
          const data = siblingData as AttorneysGridData

          return (
            Boolean(data?.viewAllLabel?.trim()) &&
            data?.viewAllDestinationType === 'custom'
          )
        },
      },
    },
  ],
}
