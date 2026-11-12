
import type { GlobalConfig } from 'payload'

type HeaderLinkData = {
  destinationType?: 'page' | 'custom'
}

type ConsultationButtonData = {
  enabled?: boolean
  destinationType?: 'page' | 'custom'
}

const pageOptions = [
  { label: 'Home', value: '/' },
  { label: 'About', value: '/about' },
  { label: 'Practice Areas', value: '/practice-areas' },
  { label: 'Attorneys', value: '/attorneys' },
  { label: 'Cases', value: '/cases' },
  { label: 'Insights', value: '/insights' },
  { label: 'Contact', value: '/contact' },
]

export const Header: GlobalConfig = {
  slug: 'header',

  label: 'Header',

  admin: {
    group: 'Website Settings',
  },

  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Optional header logo. If empty, the Site Settings logo can be used.',
      },
    },

    {
      name: 'navigation',
      type: 'array',
      label: 'Navigation Links',
      labels: {
        singular: 'Navigation Link',
        plural: 'Navigation Links',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: {
                width: '30%',
              },
            },
            {
              name: 'destinationType',
              type: 'select',
              required: true,
              defaultValue: 'page',
              options: [
                { label: 'Existing Page', value: 'page' },
                { label: 'Custom URL', value: 'custom' },
              ],
              admin: {
                width: '30%',
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
                  (siblingData as HeaderLinkData)?.destinationType === 'page',
              },
            },
            {
              name: 'customUrl',
              type: 'text',
              label: 'Custom URL',
              admin: {
                width: '40%',
                condition: (_, siblingData) =>
                  (siblingData as HeaderLinkData)?.destinationType === 'custom',
              },
            },
          ],
        },
      ],
    },

    {
      name: 'consultationButton',
      type: 'group',
      label: 'Button',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enabled',
          defaultValue: true,
        },

        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Button Label',
              defaultValue: 'Book a Consultation',
              admin: {
                width: '50%',
                condition: (_, siblingData) =>
                  (siblingData as ConsultationButtonData)?.enabled === true,
              },
            },
            {
              name: 'destinationType',
              type: 'select',
              label: 'Destination Type',
              defaultValue: 'page',
              options: [
                { label: 'Existing Page', value: 'page' },
                { label: 'Custom URL', value: 'custom' },
              ],
              admin: {
                width: '50%',
                condition: (_, siblingData) =>
                  (siblingData as ConsultationButtonData)?.enabled === true,
              },
            },
          ],
        },

        {
          name: 'selectedPage',
          type: 'select',
          label: 'Select Page',
          options: pageOptions,
          defaultValue: '/contact',
          admin: {
            condition: (_, siblingData) => {
              const data = siblingData as ConsultationButtonData
              return data?.enabled === true && data?.destinationType === 'page'
            },
          },
        },

        {
          name: 'customUrl',
          type: 'text',
          label: 'Custom URL',
          admin: {
            condition: (_, siblingData) => {
              const data = siblingData as ConsultationButtonData
              return data?.enabled === true && data?.destinationType === 'custom'
            },
          },
        },
      ],
    },
  ],
}
