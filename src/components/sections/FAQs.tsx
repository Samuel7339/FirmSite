'use client'

import { useState } from 'react'
import Link from 'next/link'

import type { Faq, FAQsBlock } from '@/payload-types'

type FAQsProps = FAQsBlock & {
    allFaqs?: Faq[]
    groupByCategory?: boolean
}

const categories = [
    { label: 'General', value: 'general' },
    { label: 'Practice Areas', value: 'practice-areas' },
    { label: 'Attorneys', value: 'attorneys' },
    { label: 'Cases', value: 'cases' },
    { label: 'Consultation', value: 'consultation' },
] as const

export function FAQs({
    eyebrow,
    heading,
    description,
    faqs,
    allFaqs,
    groupByCategory = false,
    viewAllLabel,
    viewAllDestinationType,
    selectedViewAllPage,
    viewAllUrl,
}: FAQsProps) {
    const [openFaqId, setOpenFaqId] = useState<string | number | null>(
        null,
    )

    const buttonUrl =
        viewAllDestinationType === 'page'
            ? selectedViewAllPage
            : viewAllUrl

    const selectedItems = (faqs ?? []).filter(
        (item): item is Faq =>
            typeof item === 'object' && item !== null,
    )

    const items = groupByCategory
        ? (allFaqs ?? [])
        : selectedItems

    const groupedFAQs = categories
        .map((category) => ({
            ...category,
            faqs: items.filter(
                (item) => item.category === category.value,
            ),
        }))
        .filter((group) => group.faqs.length > 0)

    function renderFAQ(item: Faq) {
        const isOpen = openFaqId === item.id

        return (
            <div key={item.id} className="transition-colors">
                <button
                    type="button"
                    onClick={() =>
                        setOpenFaqId(isOpen ? null : item.id)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition-colors hover:bg-stone-50 md:px-8"
                >
                    <span className="font-serif text-lg font-normal text-[#0B1025] md:text-xl">
                        {item.question}
                    </span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-stone-200 text-lg font-light text-[#C59A3F] transition-colors">
                        {isOpen ? '−' : '+'}
                    </span>
                </button>

                {isOpen && (
                    <div className="px-6 pb-7 md:px-8">
                        <p className="text-sm leading-relaxed text-stone-600">
                            {item.answer}
                        </p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <section className="bg-[#F8F6F0] px-6 py-20 md:px-12 md:py-28 lg:px-20">
            <div className="mx-auto max-w-4xl">
                <div className="mb-16 text-center">
                    {eyebrow && (
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <span className="h-px w-6 bg-[#D6A84B]" />
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59A3F]">
                                {eyebrow}
                            </p>
                            <span className="h-px w-6 bg-[#D6A84B]" />
                        </div>
                    )}

                    <h2 className="font-serif text-3xl font-normal leading-tight text-[#0B1025] sm:text-4xl md:text-5xl">
                        {heading}
                    </h2>

                    {description && (
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-600">
                            {description}
                        </p>
                    )}
                </div>

                {groupByCategory ? (
                    <div className="space-y-12">
                        {groupedFAQs.map((group) => (
                            <div key={group.value}>
                                <h3 className="mb-5 font-serif text-2xl font-normal text-[#0B1025] md:text-3xl">
                                    {group.label}
                                </h3>

                                <div className="divide-y divide-stone-200/80 border border-stone-200/80 bg-white shadow-sm">
                                    {group.faqs.map(renderFAQ)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-stone-200/80 border border-stone-200/80 bg-white shadow-sm">
                        {selectedItems.map(renderFAQ)}
                    </div>
                )}

                {!groupByCategory && viewAllLabel && buttonUrl && (
                    <div className="mt-14 text-center">
                        <Link
                            href={buttonUrl}
                            className="inline-flex min-h-12 items-center justify-center border border-[#0B1025] bg-[#0B1025] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:border-[#D6A84B] hover:bg-[#D6A84B] hover:text-[#0B1025]"
                        >
                            {viewAllLabel}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
