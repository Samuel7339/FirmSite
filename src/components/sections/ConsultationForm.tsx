
'use client'

import { useState, type FormEvent } from 'react'
import type { ConsultationFormBlock, Form } from '@/payload-types'

type ConsultationFormProps = ConsultationFormBlock
type FormField = NonNullable<Form['fields']>[number]

function getRichTextText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(getRichTextText).filter(Boolean).join(' ')
  }

  if (typeof value !== 'object' || value === null) {
    return ''
  }

  const node = value as Record<string, unknown>
  const text = typeof node.text === 'string' ? node.text : ''
  const children = getRichTextText(node.root ?? node.children)

  return [text, children].filter(Boolean).join(' ')
}

export function ConsultationForm({
  eyebrow,
  heading,
  description,
  form,
  submitButtonLabel,
  privacyNotice,
}: ConsultationFormProps) {
  const selectedForm =
    typeof form === 'object' && form !== null ? form : null

  const [values, setValues] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  function updateValue(name: string, value: string) {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedForm) return

    setIsSubmitting(true)
    setError('')

    try {
      const submissionData = (selectedForm.fields ?? [])
        .filter((field) => field.blockType !== 'message')
        .map((field) => ({
          field: field.name,
          value:
            values[field.name] ??
            String(
              field.blockType === 'checkbox'
                ? Boolean(
                    'defaultValue' in field ? field.defaultValue : false,
                  )
                : 'defaultValue' in field
                  ? field.defaultValue ?? ''
                  : '',
            ),
        }))

      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: selectedForm.id,
          submissionData,
        }),
      })
        
      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.message ||
            result.message ||
            'Unable to submit your consultation request. Please try again.',
        )
      }

      setIsSubmitted(true)
      setValues({})
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderField(field: FormField, index: number) {
    if (field.blockType === 'message') {
      const message = getRichTextText(field.message)

      return message ? (
        <p
          key={field.id ?? index}
          className="text-sm leading-relaxed text-[#526171]"
        >
          {message}
        </p>
      ) : null
    }

    const label = field.label || field.name

    const defaultValue =
      field.blockType === 'checkbox'
        ? String(
            Boolean(
              'defaultValue' in field ? field.defaultValue : false,
            ),
          )
        : String(
            'defaultValue' in field ? field.defaultValue ?? '' : '',
          )

    const value = values[field.name] ?? defaultValue

    const inputClassName =
      'mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-sm text-[#182A3A] outline-none transition-colors focus:border-[#B58B60] focus:ring-1 focus:ring-[#B58B60]'

    return (
      <div
        key={field.id ?? field.name}
        className="min-w-0"
        style={{ width: `${field.width ?? 100}%` }}
      >
        {field.blockType === 'checkbox' ? (
          <label className="flex items-center gap-3 text-sm text-[#526171]">
            <input
              type="checkbox"
              checked={value === 'true'}
              required={Boolean(field.required)}
              onChange={(event) =>
                updateValue(field.name, String(event.target.checked))
              }
              className="h-4 w-4 accent-[#B58B60]"
            />
            {label}
          </label>
        ) : (
          <>
            <label
              htmlFor={`consultation-${field.name}`}
              className="text-xs font-semibold uppercase tracking-wider text-[#182A3A]"
            >
              {label}
              {field.required && (
                <span className="ml-1 text-red-600">*</span>
              )}
            </label>

            {field.blockType === 'textarea' ? (
              <textarea
                id={`consultation-${field.name}`}
                name={field.name}
                value={value}
                required={Boolean(field.required)}
                onChange={(event) =>
                  updateValue(field.name, event.target.value)
                }
                rows={4}
                className={inputClassName}
              />
            ) : field.blockType === 'select' ? (
              <select
                id={`consultation-${field.name}`}
                name={field.name}
                value={value}
                required={Boolean(field.required)}
                onChange={(event) =>
                  updateValue(field.name, event.target.value)
                }
                className={inputClassName}
              >
                <option value="">Select an option</option>
                {(field.options ?? []).map((option) => (
                  <option
                    key={option.id ?? option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.blockType === 'radio' ? (
              <div className="mt-3 flex flex-wrap gap-4">
                {(field.options ?? []).map((option) => (
                  <label
                    key={option.id ?? option.value}
                    className="flex items-center gap-2 text-sm text-[#526171]"
                  >
                    <input
                      type="radio"
                      name={field.name}
                      value={option.value}
                      checked={value === option.value}
                      required={Boolean(field.required)}
                      onChange={() =>
                        updateValue(field.name, option.value)
                      }
                      className="accent-[#B58B60]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : (
              <input
                id={`consultation-${field.name}`}
                name={field.name}
                type={
                  field.blockType === 'email'
                    ? 'email'
                    : field.blockType === 'number'
                      ? 'number'
                      : 'text'
                }
                value={value}
                required={Boolean(field.required)}
                onChange={(event) =>
                  updateValue(field.name, event.target.value)
                }
                className={inputClassName}
              />
            )}
          </>
        )}
      </div>
    )
  }

  const confirmationMessage = selectedForm
    ? getRichTextText(selectedForm.confirmationMessage)
    : ''

  return (
    <section className="relative px-4 pb-20 sm:px-6 md:pb-28 lg:px-8">
      <div className="mx-auto max-w-6xl border border-[#D8C2A2]/60 border-l-4 border-l-[#B58B60] bg-[#F3EEE5] p-8 shadow-2xl sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column */}
          <div className="lg:col-span-5">
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A77C50]">
                {eyebrow}
              </p>
            )}

            <h2 className="mt-2 font-serif text-3xl font-normal leading-tight text-[#182A3A] sm:text-4xl">
              {heading}
            </h2>

            {description && (
              <p className="mt-4 text-sm leading-relaxed text-[#526171] sm:text-base">
                {description}
              </p>
            )}
          </div>

          {/* Right Column: Dynamic Payload Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div
                className="border border-green-200 bg-green-50 p-6 text-sm leading-relaxed text-green-800"
                role="status"
              >
                {confirmationMessage ||
                  'Thank you for requesting a consultation. Our team will get back to you shortly.'}
              </div>
            ) : selectedForm ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-wrap gap-x-4 gap-y-5">
                  {(selectedForm.fields ?? []).map(renderField)}
                </div>

                {/* Privacy Notice */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    id="consultation-privacy"
                    type="checkbox"
                    required
                    className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[#182A3A] focus:ring-[#B58B60]"
                  />

                  <label
                    htmlFor="consultation-privacy"
                    className="text-[11px] leading-tight text-[#526171]"
                  >
                    {privacyNotice ||
                      'I understand this communication does not create an attorney-client relationship.'}
                  </label>
                </div>

                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center bg-[#182A3A] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md transition-all duration-300 hover:bg-[#34495A] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : submitButtonLabel ||
                        selectedForm.submitButtonLabel ||
                        'Request Consultation'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-red-600">
                The consultation form could not be loaded. Please select a
                form in Payload Admin.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
