
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { AboutFirmBlock, Media } from '@/payload-types'

type AboutFirmProps = AboutFirmBlock

function getImageUrl(
    image: string | number | Media | null | undefined,
): string | undefined {
    if (typeof image === 'object' && image !== null) {
        return image.url || undefined
    }

    return undefined
}

export function AboutFirm({
    eyebrow,
    heading,
    image,
    description,
    buttonLabel,
    destinationType,
    selectedPage,
    customUrl,
}: AboutFirmProps) {
    const imageUrl = getImageUrl(image)


    const buttonUrl =
        destinationType === 'page' ? selectedPage : customUrl

    return (
        <section className="bg-white px-6 py-20 md:px-12 md:py-28">
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <div>
                    {eyebrow && (
                        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                            {eyebrow}
                        </p>
                    )}

                    <h2 className="font-serif text-4xl leading-tight text-[#17243A] md:text-5xl">
                        {heading}
                    </h2>

                    {description && (
                        <div className="mt-6 max-w-none text-base leading-8 text-slate-600 [&_p]:mb-5 [&_strong]:font-semibold [&_strong]:text-[#17243A] [&_a]:text-amber-700 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6">
                            <RichText data={description} />
                        </div>
                    )}

                    {buttonLabel && buttonUrl && (
                        <Link
                            href={buttonUrl}
                            className="mt-9 inline-flex min-h-14 items-center justify-center bg-[#17243A] px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-[#263954]"
                        >
                            {buttonLabel}
                        </Link>
                    )}
                </div>

                <div className="relative">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={heading}
                            className="aspect-[4/5] w-full object-cover"
                        />
                    ) : (
                        <div className="flex aspect-[4/5] w-full items-center justify-center bg-gradient-to-br from-[#263954] to-[#17243A]">
                            <span className="font-serif text-3xl tracking-widest text-amber-400">
                                ABOUT OUR FIRM
                            </span>
                        </div>
                    )}

                    <div className="absolute -bottom-4 -left-4 -z-10 h-full w-full border border-amber-600/50" />
                </div>
            </div>
        </section>
    )
}
