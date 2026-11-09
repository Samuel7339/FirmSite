
import type { ConsultationFormBlock } from '@/payload-types'

type ConsultationFormProps = ConsultationFormBlock

export function ConsultationForm({
  eyebrow,
  heading,
  description,
  submitButtonLabel,
  privacyNotice,
}: ConsultationFormProps) {
  return (
    <section className="bg-[#F7F5F0] px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          {eyebrow && (
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              {eyebrow}
            </p>
          )}

          <h2 className="max-w-xl font-serif text-4xl leading-tight text-[#17243A] md:text-5xl">
            {heading}
          </h2>

          {description && (
            <p className="mt-6 max-w-lg text-base leading-8 text-slate-600">
              {description}
            </p>
          )}
        </div>

        <form className="space-y-5 bg-white p-6 shadow-sm md:p-10">
          <div>
            <label htmlFor="consultation-name" className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              id="consultation-name"
              name="name"
              type="text"
              required
              className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label htmlFor="consultation-email" className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              id="consultation-email"
              name="email"
              type="email"
              required
              className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label htmlFor="consultation-phone" className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              id="consultation-phone"
              name="phone"
              type="tel"
              required
              className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
            />
          </div>

          <div>
            <label htmlFor="consultation-message" className="mb-2 block text-sm font-medium text-slate-700">
              How can we help you?
            </label>
            <textarea
              id="consultation-message"
              name="message"
              rows={4}
              required
              className="w-full border border-slate-300 px-4 py-3 outline-none focus:border-amber-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#17243A] px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#263b5a]"
          >
            {submitButtonLabel}
          </button>

          {privacyNotice && (
            <p className="text-xs leading-6 text-slate-500">
              {privacyNotice}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
