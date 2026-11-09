
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
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
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
          name: 'officeName',
          type: 'text',
          required: true,
        },
        {
          name: 'address',
          type: 'textarea',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'mapUrl',
          type: 'text',
          admin: {
            description: 'Google Maps location link.',
          },
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
