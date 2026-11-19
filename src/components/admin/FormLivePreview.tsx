
'use client'

import { useState } from 'react'
import { useAllFormFields } from '@payloadcms/ui'
import { reduceFieldsToValues } from 'payload/shared'
import type { Form } from '@/payload-types'
import { ConsultationForm } from '@/components/sections/ConsultationForm'

type PreviewMode = 'desktop' | 'tablet' | 'mobile'

const previewWidths: Record<PreviewMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px',
}

export function FormLivePreview() {
  // Subscribe to the complete Payload form state.
  const [fields] = useAllFormFields()

  // Convert Payload's nested field state into regular form data.
  const formData = reduceFieldsToValues(fields, true) as Record<
    string,
    unknown
  >

  const [mode, setMode] = useState<PreviewMode>('desktop')

  const title =
    typeof formData.title === 'string' ? formData.title : ''

  const submitButtonLabel =
    typeof formData.submitButtonLabel === 'string'
      ? formData.submitButtonLabel
      : ''

  const formFields = Array.isArray(formData.fields)
    ? (formData.fields as NonNullable<Form['fields']>)
    : []

  const previewForm = {
    id: 'admin-preview',
    title,
    fields: formFields,
    submitButtonLabel,
    confirmationType: 'message',
    emails: [],
  } as unknown as Form

  return (
    <section className="w-full min-w-0 rounded-xl border border-gray-200 bg-white p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Visitor Preview
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Updates using your current unsaved Form Builder changes.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
          {(['desktop', 'tablet', 'mobile'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setMode(item)}
              className={`rounded-md px-2.5 py-2 text-xs font-medium capitalize transition ${
                mode === item
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full min-w-0 overflow-x-auto rounded-lg border border-gray-200 bg-gray-100 p-2">
        <div
          className="mx-auto min-w-0 bg-white shadow-sm transition-all"
          style={{
            width: previewWidths[mode],
            maxWidth: '100%',
          }}
        >
          <ConsultationForm
            blockType="consultationForm"
            eyebrow="GET IN TOUCH"
            heading={title || 'Request a Consultation'}
            description=""
            form={previewForm}
            submitButtonLabel={
              submitButtonLabel || 'Request Consultation'
            }
            privacyNotice="I understand this communication does not create an attorney-client relationship."
            previewMode
          />
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-500">
        Preview only. Form submissions are disabled.
      </p>
    </section>
  )
}
