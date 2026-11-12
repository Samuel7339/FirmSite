
import type { Block } from 'payload'

export const OfficeLocations: Block = {
  slug: 'officeLocations',
  interfaceName: 'OfficeLocationsBlock',
  labels: {
    singular: 'Office Locations Section',
    plural: 'Office Locations Sections',
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
      name: 'offices',
      type: 'array',
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'officeName',
              type: 'text',
              required: true,
              admin: {
                width: '50%',
              },
            },
            {
              name: 'email',
              type: 'email',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'phone',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'mapUrl',
              type: 'text',
              admin: {
                width: '50%',
                description: 'Google Maps location link.',
              },
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
}
