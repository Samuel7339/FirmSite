'use client'

import { useState } from 'react'
import Link from 'next/link'

type NavigationItem = {
  id?: string | null
  label?: string | null
  destinationType?: string | null
  selectedPage?: string | null
  customUrl?: string | null
}

type ConsultationButton = {
  label?: string | null
  destinationType?: 'page' | 'custom' | null
  selectedPage?: string | null
  customUrl?: string | null
} | null | undefined

type MobileNavigationProps = {
  navigation: NavigationItem[]
  consultationButton?: ConsultationButton
  consultationUrl?: string | null
  siteName?: string
  logo?: any
}

export function MobileNavigation({
  navigation,
  consultationButton,
  consultationUrl,
  siteName = 'Law Firm',
  logo,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const resolvedConsultationUrl = consultationUrl || '/contact'

  return (
    <div>
      {/* Universal Square Hamburger Menu Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white transition-all duration-200 hover:border-[#B58B60] hover:bg-[#B58B60]/10 hover:text-[#B58B60]"
      >
        <span className="flex flex-col gap-1.5" aria-hidden="true">
          <span className="h-[2px] w-5 bg-current transition-all" />
          <span className="h-[2px] w-5 bg-current transition-all" />
          <span className="h-[2px] w-5 bg-current transition-all" />
        </span>
      </button>

      {/* Refined & Balanced Full-Screen Navigation Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation drawer"
          className="fixed inset-0 z-[100] flex flex-col justify-between overflow-y-auto bg-[#182A3A] text-white"
        >
          {/* Header Area: Branding on Left, Square Close Button on Right */}
          <div className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between border-b border-white/10 px-6 py-4 lg:min-h-[88px] lg:px-10">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              {logo && typeof logo === 'object' && logo.url ? (
                <img
                  src={logo.url}
                  alt={logo.alt || siteName}
                  className="h-9 w-auto object-contain sm:h-11"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B58B60] font-serif text-sm text-[#B58B60]">
                    ⚖
                  </span>
                  <div className="flex flex-col">
                    <span className="font-serif text-base font-normal tracking-[0.18em] uppercase text-white sm:text-lg">
                      {siteName}
                    </span>
                    <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#B58B60]">
                      Attorneys & Counselors
                    </span>
                  </div>
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-11 w-11 items-center justify-center border border-white/20 bg-white/5 text-white transition-all duration-200 hover:border-[#B58B60] hover:bg-[#B58B60]/10 hover:text-[#B58B60]"
            >
              <span className="text-2xl font-light leading-none">✕</span>
            </button>
          </div>

          {/* Navigation Links Area: Centered, Elegantly Constrained Column */}
          <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-8 py-12 sm:px-12 md:py-16">
            <nav className="flex flex-col space-y-4 sm:space-y-6">
              {navigation.map((item, index) => {
                const href =
                  item.destinationType === 'custom'
                    ? item.customUrl
                    : item.selectedPage || '/'

                if (!href || !item.label) return null

                return (
                  <Link
                    key={item.id || index}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between border-b border-white/5 pb-3 text-sm font-serif font-normal uppercase tracking-[0.15em] text-white/90 transition-all duration-300 hover:border-white/15 hover:pl-2 hover:text-[#D8C2A2] sm:text-[15px]"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-[#B58B60] opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                )
              })}

              {/* Distinct Consultation Link Treatment */}
              {consultationButton?.label && (
                <div className="pt-6 sm:pt-8">
                  <Link
                    href={resolvedConsultationUrl}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex w-full items-center justify-center border border-[#B58B60] bg-[#B58B60]/10 px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D8C2A2] transition-all duration-300 hover:bg-[#B58B60] hover:text-[#182A3A]"
                  >
                    {consultationButton.label}
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* Search Area: Constrained, Consistent Heights, Balanced Spacing */}
          <div className="mx-auto w-full max-w-xl border-t border-white/10 px-8 py-8 sm:px-12">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const input = form.elements.namedItem('q') as HTMLInputElement | null
                if (input && input.value.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(input.value.trim())}`
                  setIsOpen(false)
                }
              }}
              className="flex h-12 w-full items-stretch border border-white/20 bg-white/5"
            >
              <input
                type="search"
                name="q"
                placeholder="Search this site"
                className="w-full bg-transparent px-4 text-xs text-white placeholder-stone-400 outline-none focus:ring-1 focus:ring-[#B58B60] sm:text-sm"
              />
              <button
                type="submit"
                className="border-l border-white/20 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#B58B60] transition-colors hover:bg-white/10 hover:text-white"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
