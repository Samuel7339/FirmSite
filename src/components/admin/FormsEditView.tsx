
'use client'

import { useEffect } from 'react'
import {
  DefaultEditView,
  useDocumentInfo,
  useLivePreviewContext,
} from '@payloadcms/ui'
import type { DocumentViewClientProps } from 'payload'
import { FormLivePreview } from './FormLivePreview'

export default function FormsEditView(props: DocumentViewClientProps) {
  const { id } = useDocumentInfo()
  const { setURL } = useLivePreviewContext()

  useEffect(() => {
    // Payload skips Live Preview URL initialization for new documents.
    // Initialize it so DefaultEditView renders its LivePreview slot.
    if (!id) {
      setURL('/form-preview?new=true')
    }
  }, [id, setURL])

  // Saved Forms continue using Payload's original Live Preview.
  if (id) {
    return <DefaultEditView {...props} />
  }

  // New Forms use our preview inside Payload's Form context.
  return (
    <DefaultEditView
      {...props}
      LivePreview={<FormLivePreview />}
    />
  )
}
