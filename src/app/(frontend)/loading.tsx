
export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F7F4] px-6">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        {/* Brand */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-white shadow-[0_4px_20px_rgba(17,24,39,0.05)]">
            <span className="font-serif text-4xl text-[rgb(196,154,67)]">
              H
            </span>
          </div>

          <h1 className="font-serif text-xl font-semibold tracking-[0.18em] text-[#172438]">
            HAWTHORNE
          </h1>

          <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.38em] text-[#A18A60]">
            Legal
          </p>
        </div>

        {/* Loading spinner */}
        <div className="relative mb-6 h-10 w-10">
          <div className="absolute inset-0 rounded-full border-[3px] border-[#E8E4DC]" />

          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-transparent border-t-[#C49A43]" />
        </div>

        {/* Loading text */}
        <p className="font-serif text-lg text-[#172438]">
          Preparing your experience
        </p>

        <p className="mt-2 text-xs tracking-wide text-[#89919A]">
          Please wait while we load the page.
        </p>

        {/* Animated progress indicator */}
        <div className="mt-8 h-0.5 w-36 overflow-hidden rounded-full bg-[#E8E4DC]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-[#C49A43]" />
        </div>
      </div>
    </main>
  )
}
