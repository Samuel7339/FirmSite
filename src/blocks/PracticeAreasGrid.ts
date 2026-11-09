import type { Block } from 'payload'

type PracticeAreasGridData = {
  displayMode?: 'selected' | 'all'
  viewAllLabel?: string
  viewAllDestinationType?: 'page' | 'custom'
}

export const PracticeAreasGrid: Block = {
  slug: 'practiceAreasGrid',
  interfaceName: 'PracticeAreasGridBlock',

  labels: {
    singular: 'Practice Areas Section',
    plural: 'Practice Areas Sections',
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
      defaultValue: 'Our Practice Areas',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'displayMode',
      type: 'select',
      label: 'Practice Areas Display Mode',
      defaultValue: 'selected',
      options: [
        { label: 'Selected Practice Areas', value: 'selected' },
        { label: 'All Practice Areas', value: 'all' },
      ],
      admin: {
        description:
          'Choose specific practice areas or automatically display all published practice areas.',
      },
    },
    {
      name: 'practiceAreas',
      type: 'relationship',
      relationTo: 'practice-areas',
      hasMany: true,
      admin: {
        condition: (_, siblingData) =>
          (siblingData as PracticeAreasGridData)?.displayMode === 'selected',
        description: 'Select the practice areas to display in this section.',
      },
      validate: (value, { siblingData }) => {
        const data = siblingData as PracticeAreasGridData

        if (
          data?.displayMode === 'selected' &&
          (!Array.isArray(value) || value.length === 0)
        ) {
          return 'Please select at least one practice area.'
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
                (siblingData as PracticeAreasGridData)?.viewAllLabel?.trim(),
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
          const data = siblingData as PracticeAreasGridData

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
          const data = siblingData as PracticeAreasGridData

          return (
            Boolean(data?.viewAllLabel?.trim()) &&
            data?.viewAllDestinationType === 'custom'
          )
        },
      },
    },
  ],
}

