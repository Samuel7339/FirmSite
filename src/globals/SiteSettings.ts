import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',

  label: 'Site Settings',

  admin: {
    group: 'Website Settings',
  },

  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Law Firm',
    },
    {
      name: 'siteDescription',
      type: 'textarea',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'favicon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'contactInformation',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'email',
              type: 'email',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'phone',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'address',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      labels: {
        singular: 'Social Link',
        plural: 'Social Links',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'X', value: 'x' },
              ],
              admin: {
                width: '50%',
              },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}