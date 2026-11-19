
import { getPayload } from 'payload'
import config from '@/payload.config'
import type {
  ContactBlock,
  ConsultationFormBlock,
  Form,
} from '@/payload-types'
import FormPreviewClient from './FormPreviewClient'

interface FormPreviewPageProps {
  searchParams: Promise<{
    formId?: string
    new?: string
  }>
}

export default async function FormPreviewPage({
  searchParams,
}: FormPreviewPageProps) {
  const { formId, new: isNew } = await searchParams

  // New Form: show an empty ConsultationForm preview.
  if (isNew === 'true' && !formId) {
    const emptyForm: Form = {
      id: '',
      title: 'New Form',
      confirmationType: 'message',
      emails: [],
      fields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const consultationBlock: ConsultationFormBlock = {
      blockType: 'consultationForm',
      heading: 'Schedule a Consultation',
      form: emptyForm,
      submitButtonLabel: 'Request Consultation',
      eyebrow: 'GET IN TOUCH',
      description: '',
      privacyNotice: '',
    }

    return (
      <FormPreviewClient
        initialForm={emptyForm}
        initialBlock={consultationBlock}
      />
    )
  }

  if (!formId) {
    return <PreviewMessage message="No form ID was provided." />
  }

  const payload = await getPayload({ config })

  let form: Form

  try {
    form = await payload.findByID({
      collection: 'forms',
      id: formId,
      depth: 2,
    })
  } catch {
    return <PreviewMessage message="The requested form could not be found." />
  }

  if (!form) {
    return <PreviewMessage message="The requested form could not be found." />
  }

  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    depth: 2,
    draft: true,
  })

  const formIdString = String(form.id)

  let matchingBlock: ContactBlock | ConsultationFormBlock | null = null

  for (const page of pages.docs) {
    const layout = Array.isArray(page.layout) ? page.layout : []

    const block = layout.find((item) => {
      if (
        item.blockType !== 'contact' &&
        item.blockType !== 'consultationForm'
      ) {
        return false
      }

      const relationship = item.form

      const relatedFormId =
        typeof relationship === 'object' &&
          relationship !== null &&
          'id' in relationship
          ? String(relationship.id)
          : String(relationship)

      return relatedFormId === formIdString
    })

    if (block) {
      matchingBlock = block as ContactBlock | ConsultationFormBlock
      break
    }
  }

  if (!matchingBlock) {
    return (
      <PreviewMessage message="This form is not currently assigned to a Contact or ConsultationForm block on a page." />
    )
  }

  return (
    <FormPreviewClient
      initialForm={form}
      initialBlock={matchingBlock}
    />
  )
}

function PreviewMessage({ message }: { message: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F6F0] p-8">
      <p className="max-w-lg text-center text-sm text-[#344054]">
        {message}
      </p>
    </main>
  )
}
