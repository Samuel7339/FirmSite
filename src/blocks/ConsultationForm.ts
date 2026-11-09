
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
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'GET IN TOUCH',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Schedule a Consultation',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      required: true,
      defaultValue: 'Request Consultation',
    },
    {
      name: 'privacyNotice',
      type: 'text',
    },
  ],
}
