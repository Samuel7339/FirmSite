
'use client'

import { useState, type FormEvent } from 'react'
import { payloadEditable } from '@payload-inline-visual-editor/react'
import type { ContactBlock, Form, Media } from '@/payload-types'

type ContactProps = ContactBlock & {
  editablePath: string
}

type FormField = NonNullable<Form['fields']>[number]

function getImageUrl(
  image: string | number | Media | null | undefined,
): string | undefined {
  if (typeof image === 'object' && image !== null) {
    return image.url || undefined
  }

  return undefined
}

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

export function Contact({
  eyebrow,
  heading,
  description,
  image,
  form,
  editablePath,
}: ContactProps) {
  const imageUrl = getImageUrl(image)

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
            'Unable to submit your message. Please try again.',
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
          className="text-sm leading-relaxed text-stone-600"
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
      'mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-sm text-[#17243A] outline-none transition focus:border-[#C59A3F]'

    return (
      <div
        key={field.id ?? field.name}
        className="min-w-0"
        style={{ width: `${field.width ?? 100}%` }}
      >
        {field.blockType === 'checkbox' ? (
          <label className="flex items-center gap-3 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={value === 'true'}
              required={Boolean(field.required)}
              onChange={(event) =>
                updateValue(field.name, String(event.target.checked))
              }
              className="h-4 w-4 accent-[#C59A3F]"
            />
            {label}
          </label>
        ) : (
          <>
            <label
              htmlFor={field.name}
              className="text-sm font-medium text-[#17243A]"
            >
              {label}
              {field.required && (
                <span className="ml-1 text-red-600">*</span>
              )}
            </label>

            {field.blockType === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={value}
                required={Boolean(field.required)}
                onChange={(event) =>
                  updateValue(field.name, event.target.value)
                }
                rows={5}
                className={inputClassName}
              />
            ) : field.blockType === 'select' ? (
              <select
                id={field.name}
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
                    className="flex items-center gap-2 text-sm text-stone-700"
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
                      className="accent-[#C59A3F]"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            ) : (
              <input
                id={field.name}
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
    <section className="bg-white px-6 py-20 md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          {eyebrow && (
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-[#D6A84B]" />
              <p
                {...payloadEditable(`${editablePath}.eyebrow`)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]"
              >
                {eyebrow}
              </p>
            </div>
          )}

          <h2
            {...payloadEditable(`${editablePath}.heading`)}
            className="font-serif text-3xl font-normal leading-tight text-[#0B1025] sm:text-4xl md:text-5xl"
          >
            {heading}
          </h2>

          {description && (
            <p
              {...payloadEditable(`${editablePath}.description`)}
              className="mt-5 text-base leading-relaxed text-stone-600"
            >
              {description}
            </p>
          )}

          <div
            {...payloadEditable(`${editablePath}.form`)}
            className="mt-8 border border-stone-200/80 bg-[#F8F6F0] p-8 shadow-sm"
          >
            <h3 className="font-serif text-2xl font-normal text-[#0B1025]">
              Get in Touch
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Our legal team is available to assist you. Please reach out
              using the form below.
            </p>

            {isSubmitted ? (
              <div className="mt-6 border border-green-200 bg-green-50 p-5 text-sm leading-relaxed text-green-800">
                {confirmationMessage ||
                  'Thank you for contacting us. Our team will get back to you shortly.'}
              </div>
            ) : selectedForm ? (
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex flex-wrap gap-x-4 gap-y-5">
                  {(selectedForm.fields ?? []).map(renderField)}
                </div>

                {error && (
                  <p className="mt-4 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 bg-[#17243A] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#263650] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? 'Sending...'
                    : selectedForm.submitButtonLabel || 'Submit'}
                </button>
              </form>
            ) : (
              <p className="mt-6 text-sm text-red-600">
                The selected contact form could not be loaded. Please check
                the form selection in Payload Admin.
              </p>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden bg-stone-100 shadow-xl">
              <img
                {...payloadEditable(`${editablePath}.image`)}
                src={imageUrl}
                alt={heading}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full border border-[#D6A84B]/50 sm:-bottom-4 sm:-right-4" />
          </div>
        )}
      </div>
    </section>
  )
}
