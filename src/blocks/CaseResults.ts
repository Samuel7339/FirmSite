import type { Block } from 'payload'

type CaseResultsData = {
  displayMode?: 'selected' | 'all'
  viewAllLabel?: string
  viewAllDestinationType?: 'page' | 'custom'
}

export const CaseResults: Block = {
  slug: 'caseResults',
  interfaceName: 'CaseResultsBlock',

  labels: {
    singular: 'Case Results Section',
    plural: 'Case Results Sections',
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
      defaultValue: 'Our Case Results',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Case Display Mode',
      defaultValue: 'selected',
      options: [
        { label: 'Selected Cases', value: 'selected' },
        { label: 'All Cases', value: 'all' },
      ],
      admin: {
        description:
          'Choose specific cases or automatically display all published cases.',
      },
    },
    {
      name: 'cases',
      type: 'relationship',
      relationTo: 'cases',
      hasMany: true,
      admin: {
        condition: (_, siblingData) =>
          (siblingData as CaseResultsData)?.displayMode === 'selected',
        description: 'Select the cases to display in this section.',
      },
      validate: (value, { siblingData }) => {
        const data = siblingData as CaseResultsData

        if (
          data?.displayMode === 'selected' &&
          (!Array.isArray(value) || value.length === 0)
        ) {
          return 'Please select at least one case.'
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
                (siblingData as CaseResultsData)?.viewAllLabel?.trim(),
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
          const data = siblingData as CaseResultsData

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
          const data = siblingData as CaseResultsData

          return (
            Boolean(data?.viewAllLabel?.trim()) &&
            data?.viewAllDestinationType === 'custom'
          )
        },
      },
    },
  ],
}

