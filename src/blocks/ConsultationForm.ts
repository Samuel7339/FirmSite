
import type { Block } from 'payload'

export const ConsultationForm: Block = {
  slug: 'consultationForm',
  interfaceName: 'ConsultationFormBlock',

  labels: {
    singular: 'Consultation Form Section',
    plural: 'Consultation Form Sections',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'eyebrow',
          type: 'text',
          defaultValue: 'GET IN TOUCH',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          defaultValue: 'Schedule a Consultation',
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
      type: 'row',
      fields: [
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          required: true,
          label: 'Select Consultation Form',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'submitButtonLabel',
          type: 'text',
          required: true,
          defaultValue: 'Request Consultation',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'privacyNotice',
      type: 'text',
    },
  ],
}
