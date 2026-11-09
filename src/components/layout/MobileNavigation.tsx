
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

type MobileNavigationProps = {
  navigation: NavigationItem[]
}

export function MobileNavigation({
  navigation,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        className="flex h-[66px] w-[66px] items-center justify-center border border-slate-500 text-white transition hover:border-[#D6A84B] hover:text-[#D6A84B]"
      >
        {isOpen ? (
          <span className="text-4xl font-light leading-none">×</span>
        ) : (
          <span className="flex flex-col gap-[7px]">
            <span className="h-[2px] w-[30px] bg-current" />
            <span className="h-[2px] w-[30px] bg-current" />
            <span className="h-[2px] w-[30px] bg-current" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-6 w-[320px] max-w-[calc(100vw-3rem)] border-t-2 border-[#D6A84B] bg-[#0B1025] px-7 py-6 shadow-2xl">
          <nav className="flex flex-col">
            {navigation.map((item, index) => {
              const href =
                item.destinationType === 'custom'
                  ? item.customUrl
                  : item.selectedPage

              if (!href) return null

              return (
                <Link
                  key={item.id || index}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="border-b border-white/10 py-4 text-sm font-medium uppercase tracking-widest text-gray-200 transition hover:text-[#D6A84B]"
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </div>
  )
}
