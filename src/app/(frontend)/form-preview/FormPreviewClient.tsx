
'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import type {
  ContactBlock,
  ConsultationFormBlock,
  Form,
} from '@/payload-types'

import { Contact } from '@/components/sections/Contact'
import { ConsultationForm } from '@/components/sections/ConsultationForm'

interface FormPreviewClientProps {
  initialForm: Form
  initialBlock: ContactBlock | ConsultationFormBlock
}

export default function FormPreviewClient({
  initialForm,
  initialBlock,
}: FormPreviewClientProps) {
  const { data } = useLivePreview<Form>({
    initialData: initialForm,
    serverURL:
      process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  if (initialBlock.blockType === 'contact') {
    return (
      <Contact
        {...initialBlock}
        form={data}
        editablePath=""
        previewMode
      />
    )
  }

  if (initialBlock.blockType === 'consultationForm') {
    return (
      <ConsultationForm
        {...initialBlock}
        form={data}
        editablePath=""
        previewMode
      />
    )
  }

  return null
}
