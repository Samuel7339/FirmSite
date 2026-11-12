
import type { Block } from 'payload'

type ButtonData = {
  destinationType?: 'page' | 'custom'
}

export const HomeHero: Block = {
  slug: 'HomeHero',
  interfaceName: 'HeroBlock',

  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          admin: {
            width: '40%',
            description: 'Small uppercase text above the main heading.',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          admin: {
            width: '60%',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },

    // Primary Button
    {
      name: 'primaryButton',
      type: 'group',
      label: 'Primary Button',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Button Label',
              admin: {
                width: '50%',
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
                width: '50%',
              },
            },
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
    },

    // Secondary Button
    {
      name: 'secondaryButton',
      type: 'group',
      label: 'Secondary Button',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Button Label',
              admin: {
                width: '50%',
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
                width: '50%',
              },
            },
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
    },
  ],
}
