import type { GlobalConfig } from 'payload'

type FooterLinkData = {
  destinationType?: 'page' | 'custom'
}

export const Footer: GlobalConfig = {
  slug: 'footer',

  label: 'Footer',

  admin: {
    group: 'Website Settings',
  },

  fields: [
    {
      name: 'firmName',
      type: 'text',
      label: 'Firm Name',
      defaultValue: 'Attorneys & Counselors',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Footer Description',
      defaultValue:
        'Your trusted legal partner, resolving complex matters with expertise and care.',
    },
    {
      name: 'exploreLinks',
      type: 'array',
      label: 'Explore Links',
      labels: {
        singular: 'Explore Link',
        plural: 'Explore Links',
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
                width: '20%',
              },
            },
            {
              name: 'destinationType',
              type: 'select',
              defaultValue: 'page',
              options: [
                { label: 'Existing Page', value: 'page' },
                { label: 'Custom URL', value: 'custom' },
              ],
              admin: {
                width: '40%',
              },
            },
            {
              name: 'selectedPage',
              type: 'select',
              label: 'Select Page',
              options: [
                { label: 'Home', value: '/' },
                { label: 'About', value: '/about' },
                { label: 'Practice Areas', value: '/practice-areas' },
                { label: 'Attorneys', value: '/attorneys' },
                { label: 'Cases', value: '/cases' },
                { label: 'Insights', value: '/insights' },
                { label: 'Contact', value: '/contact' },
              ],
              admin: {
                width: '40%',
                condition: (_, siblingData) =>
                  (siblingData as FooterLinkData)?.destinationType === 'page',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'Custom URL',
              admin: {
                width: '40%',
                condition: (_, siblingData) =>
                  (siblingData as FooterLinkData)?.destinationType === 'custom',
              },
            },
          ],
        },
      ],
    },
  ],
}