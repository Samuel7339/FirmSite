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
            <div key={item.id}>
                <button
                    type="button"
                    onClick={() =>
                        setOpenFaqId(isOpen ? null : item.id)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-8"
                >
                    <span className="font-serif text-lg text-[#17243A] md:text-xl">
                        {item.question}
                    </span>

                    <span className="shrink-0 text-2xl text-amber-700">
                        {isOpen ? '−' : '+'}
                    </span>
                </button>

                {isOpen && (
                    <div className="px-6 pb-7 md:px-8">
                        <p className="text-sm leading-7 text-slate-600">
                            {item.answer}
                        </p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <section className="bg-[#F4F6F8] px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto max-w-5xl">
                <div className="mb-14 text-center">
                    {eyebrow && (
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                            {eyebrow}
                        </p>
                    )}

                    <h2 className="font-serif text-4xl leading-tight text-[#17243A] md:text-5xl">
                        {heading}
                    </h2>

                    {description && (
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600">
                            {description}
                        </p>
                    )}
                </div>

                {groupByCategory ? (
                    <div className="space-y-12">
                        {groupedFAQs.map((group) => (
                            <div key={group.value}>
                                <h3 className="mb-5 font-serif text-2xl text-[#17243A] md:text-3xl">
                                    {group.label}
                                </h3>

                                <div className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
                                    {group.faqs.map(renderFAQ)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-stone-200 border-y border-stone-200 bg-white">
                        {selectedItems.map(renderFAQ)}
                    </div>
                )}

                {!groupByCategory && viewAllLabel && buttonUrl && (
                    <div className="mt-10 text-center">
                        <Link
                            href={buttonUrl}
                            className="inline-flex min-h-14 items-center justify-center bg-[#17243A] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#263954]"
                        >
                            {viewAllLabel}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
