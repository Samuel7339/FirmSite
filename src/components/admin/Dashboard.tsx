
import GlobalContentSearch from './GlobalContentSearch'


import type { AdminViewServerProps, CollectionSlug } from 'payload'

const hiddenCollectionSlugs = new Set([
  'payload-kv',
  'payload-locked-documents',
  'payload-preferences',
  'payload-migrations',
])

export default async function Dashboard({
  initPageResult,
}: AdminViewServerProps) {
  const currentUser = initPageResult.req.user

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F7F4] p-8">
        <p className="text-base text-slate-600">
          Please log in to access the dashboard.
        </p>
      </main>
    )
  }

  const payloadConfig = initPageResult.req.payload.config
  const isAdmin = currentUser.role === 'admin'

  const getLabel = (value: unknown, fallback: string): string => {
    if (typeof value === 'string') return value

    if (
      typeof value === 'object' &&
      value !== null &&
      'en' in value &&
      typeof value.en === 'string'
    ) {
      return value.en
    }

    return fallback
  }

  // Retrieve the latest version of each record from collections that support drafts.
  const pendingDrafts = isAdmin
    ? (
        await Promise.all(
          payloadConfig.collections.map(async (collection) => {
            const versionsConfig = collection.versions as
              | { drafts?: boolean }
              | undefined

            if (!versionsConfig?.drafts) {
              return []
            }

            const result = await initPageResult.req.payload.findVersions({
              collection: collection.slug as CollectionSlug,
              limit: 1000,
              sort: '-updatedAt',
              depth: 0,
              overrideAccess: true,
            })

            const collectionLabel = getLabel(
              collection.labels?.singular,
              collection.slug,
            )

            // Store only the latest version for each original record.
            const latestVersionByParent = new Map<
              string,
              (typeof result.docs)[number]
            >()

            for (const versionDoc of result.docs) {
              const parentId = versionDoc.parent as unknown as string | number

const key = String(parentId)

              if (!latestVersionByParent.has(key)) {
                latestVersionByParent.set(key, versionDoc)
              }
            }

            // Include only records whose latest version is a draft.
            return Array.from(latestVersionByParent.values())
              .filter((versionDoc) => {
                const versionData = versionDoc.version as
                  | { _status?: string }
                  | null
                  | undefined

                return versionData?._status === 'draft'
              })
              .map((draft) => ({
                id: draft.id,
                parent: draft.parent,
                version: draft.version,
                collection: collection.slug,
                collectionLabel,
                updatedAt: draft.updatedAt,
              }))
          }),
        )
      ).flat()
    : []

  // Each record is already deduplicated by its latest version.
  const uniqueDrafts = pendingDrafts

  const groups = new Map<
    string,
    {
      title: string
      links: {
        label: string
        href: string
      }[]
    }
  >()

  const addLink = (
    groupName: string,
    label: string,
    href: string,
  ) => {
    if (!groups.has(groupName)) {
      groups.set(groupName, {
        title: groupName,
        links: [],
      })
    }

    groups.get(groupName)!.links.push({
      label,
      href,
    })
  }

  // Add only actual application collections.
  for (const collection of payloadConfig.collections) {
    if (
      hiddenCollectionSlugs.has(collection.slug) ||
      collection.slug.startsWith('payload-')
    ) {
      continue
    }

    const groupName = getLabel(collection.admin?.group, 'Other')

    addLink(
      groupName,
      getLabel(collection.labels?.plural, collection.slug),
      `/admin/collections/${collection.slug}`,
    )
  }

  // Add configured globals.
  for (const global of payloadConfig.globals) {
    const groupName = getLabel(global.admin?.group, 'Other')

    addLink(
      groupName,
      getLabel(global.label, global.slug),
      `/admin/globals/${global.slug}`,
    )
  }

  const dashboardGroups = Array.from(groups.values()).filter(
    (group) => group.links.length > 0,
  )

  const collectionCount = payloadConfig.collections.filter(
    (collection) =>
      !collection.slug.startsWith('payload-') &&
      !hiddenCollectionSlugs.has(collection.slug),
  ).length

  const globalCount = payloadConfig.globals.length

  const contentItemCount = collectionCount + globalCount

  const overviewItems = [
    {
      label: 'Content Collections',
      value: collectionCount,
      description: 'Manage your website content',
      icon: '▤',
      iconBg: 'bg-[#F0F3F7]',
      iconColor: 'text-[#344B64]',
    },
    {
      label: 'Global Settings',
      value: globalCount,
      description: 'Manage shared website settings',
      icon: '⚙',
      iconBg: 'bg-[#F8F2E8]',
      iconColor: 'text-[#A17C4B]',
    },
    {
      label: 'Management Groups',
      value: dashboardGroups.length,
      description: 'Organized content sections',
      icon: '▦',
      iconBg: 'bg-[#F1F0F6]',
      iconColor: 'text-[#71618D]',
    },
    {
      label: 'Total Managed Areas',
      value: contentItemCount,
      description: 'Collections and global settings',
      icon: '✧',
      iconBg: 'bg-[#EDF4F1]',
      iconColor: 'text-[#477766]',
    },
  ]

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F6F2] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
      {/* Subtle Background Decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#E9E2D5]/30 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[1500px] flex-col gap-10">

        {/* Dashboard Header */}
        <header className="flex flex-col justify-between gap-5 border-b border-[#E5E0D7] pb-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#D8C7A8] bg-[#192B3D] shadow-sm">
              <span className="font-serif text-3xl text-[#D8B982]">
                H
              </span>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#A17C4B]">
                Hawthorne Legal
              </p>

              <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-[#192B3D]">
                Administration
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-[#E3DED4] bg-white/80 px-4 py-2 sm:self-center">
            <span className="h-2 w-2 rounded-full bg-[#668C70]" />
            <span className="text-xs font-medium tracking-wide text-[#526273]">
              Content Management Workspace
            </span>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-2xl border border-[#34495A] bg-[#192B3D] shadow-[0_12px_35px_rgba(25,43,61,0.12)]">
          {/* Decorative Elements */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-40 h-[430px] w-[430px] rounded-full border border-[#D8B982]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-24 h-[300px] w-[300px] rounded-full border border-[#D8B982]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-[20%] h-48 w-48 rounded-full border border-[#D8B982]/10"
          />

          <div className="relative z-10 grid gap-10 px-7 py-9 sm:px-10 sm:py-11 lg:grid-cols-[1fr_280px] lg:items-center lg:px-12 lg:py-14">

            {/* Welcome Content */}
            <div className="max-w-3xl">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-9 bg-[#D8B982]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D8B982]">
                  Administration Workspace
                </p>
              </div>

              <h2 className="font-serif text-3xl font-normal leading-tight tracking-tight text-white sm:text-4xl lg:text-[46px]">
                Welcome to Your
                <span className="block text-[#D8B982]">
                  Workspace
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#D4DCE4] sm:text-base sm:leading-8">
                Manage your website content, maintain your firm's
                information, and keep everything up to date from
                one centralized workspace.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-md bg-[#D8B982] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.13em] text-[#192B3D] no-underline shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#E6CCA0] hover:shadow-md"
                >
                  Visit Website
                  <span aria-hidden="true" className="text-base">
                    ↗
                  </span>
                </a>

                <a
                  href="/admin/account"
                  className="inline-flex items-center rounded-md border border-white/25 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.13em] text-white no-underline transition duration-200 hover:border-[#D8B982] hover:bg-white/5 hover:text-[#D8B982]"
                >
                  Account Settings
                </a>
              </div>
            </div>

            {/* Workspace Snapshot */}
            <div className="relative rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D8B982]">
                Workspace Snapshot
              </p>

              <p className="mt-3 font-serif text-4xl font-semibold text-white">
                {contentItemCount.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-[#C3CFD9]">
                Configured content areas
              </p>

              <div className="my-5 h-px bg-white/10" />

              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-[#C3CFD9]">
                  Collections
                </span>

                <span className="text-sm font-semibold text-white">
                  {collectionCount}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between py-1">
                <span className="text-sm text-[#C3CFD9]">
                  Global Settings
                </span>

                <span className="text-sm font-semibold text-white">
                  {globalCount}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between py-1">
                <span className="text-sm text-[#C3CFD9]">
                  Management Groups
                </span>

                <span className="text-sm font-semibold text-white">
                  {dashboardGroups.length}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-3">
                <span className="text-sm text-[#D8B982]">✧</span>
                <span className="text-xs text-[#D4DCE4]">
                  Your website content, organized in one place.
                </span>
              </div>
            </div>
          </div>

          {/* Gold Bottom Accent */}
          <div className="h-[3px] w-full bg-gradient-to-r from-[#192B3D] via-[#D8B982] to-[#192B3D]" />
        </section>

        {/* Pending Review */}
        {isAdmin && (
          <section
            aria-labelledby="pending-review-heading"
            className="border-t border-[#E5E0D7] pt-10"
          >
            <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-[#E8DFCD] bg-[#F7F4ED] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A052]" />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A7A42]">
                    Content Approval
                  </p>
                </div>

                <h2
                  id="pending-review-heading"
                  className="mt-3 font-serif text-2xl font-semibold tracking-tight text-[#192B3D] sm:text-3xl"
                >
                  Pending Review
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-[#64717D] sm:text-base">
                  Review unpublished content across your website before approving and publishing it.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4 rounded-xl border border-[#E8DFCD] bg-white px-5 py-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#F7F4ED] text-xl text-[#9A7A42]">
                  ▤
                </div>

                <div>
                  <p className="text-2xl font-semibold leading-none text-[#192B3D]">
                    {uniqueDrafts.length}
                  </p>

                  <p className="mt-1.5 text-xs font-medium text-[#64717D]">
                    {uniqueDrafts.length === 1
                      ? 'Draft awaiting review'
                      : 'Drafts awaiting review'}
                  </p>
                </div>
              </div>
            </div>
                     
            {/* Draft List */}
            {uniqueDrafts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#D9DDE4] bg-white px-6 py-12 text-center shadow-sm sm:py-14">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F7F4ED] text-3xl text-[#9A7A42]">
                  ✓
                </div>

                <h3 className="mt-5 font-serif text-xl font-semibold text-[#192B3D] sm:text-2xl">
                  All caught up!
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A8792] sm:text-base">
                  There are no unpublished content drafts waiting for review.
                  New drafts will appear here when they are saved.
                </p>

                <div className="mx-auto mt-6 h-1 w-12 rounded-full bg-[#C5A052]" />
              </div>
            ) : (
              <div className="space-y-3">
                {uniqueDrafts.map((draft) => {
                  const parentId = draft.parent as unknown as string | number

                  const versionData = draft.version as unknown as Record<
  string,
  unknown
>

                  const contentTitle =
                    [
                      versionData.title,
                      versionData.name,
                      versionData.question,
                      versionData.heading,
                    ].find(
                      (value): value is string =>
                        typeof value === 'string' &&
                        value.trim().length > 0,
                    ) || 'Untitled content'

                  return (
                    <div
                      key={`${draft.collection}-${String(parentId)}`}
                      className="group flex flex-col gap-5 rounded-xl border border-[#E7E2D9] bg-white p-5 shadow-sm transition-all duration-200 hover:border-[#D8C49A] hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F7F4ED] text-xl text-[#9A7A42] transition-colors group-hover:bg-[#EFE6D4]">
                          ▤
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-base font-semibold text-[#192B3D] sm:text-lg">
                            {contentTitle}
                          </h3>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-md border border-[#E8DFCD] bg-[#FAF8F3] px-2.5 py-1 text-xs font-medium text-[#8C713F]">
                              {draft.collectionLabel}
                            </span>

                            <span className="text-xs text-[#8A9299]">
                              Updated ·{' '}
                              {draft.updatedAt
                                ? new Date(
                                    draft.updatedAt,
                                  ).toLocaleDateString()
                                : 'Date unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={`/admin/collections/${draft.collection}/${encodeURIComponent(String(parentId))}`}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#192B3D] bg-[#192B3D] px-5 py-2.5 text-sm font-semibold text-white no-underline transition-all duration-200 hover:border-[#344B64] hover:bg-[#344B64] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A7A42]"
                      >
                        Open Draft

                        <span
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* Overview */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-7 bg-[#A17C4B]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#A17C4B]">
                  Workspace Overview
                </p>
              </div>

              <h2 className="mt-3 font-serif text-2xl font-normal tracking-tight text-[#192B3D] sm:text-3xl">
                Everything at a Glance
              </h2>
            </div>

            <p className="text-xs text-[#7A8792]">
              Your configured Payload workspace
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {overviewItems.map((item, index) => (
              <article
                key={item.label}
                className="group relative overflow-hidden rounded-xl border border-[#E7E2D9] bg-white p-6 shadow-[0_2px_10px_rgba(25,43,61,0.035)] transition duration-200 hover:-translate-y-1 hover:border-[#C4A16A]/60 hover:shadow-[0_12px_25px_rgba(25,43,61,0.07)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#526273]">
                    {item.label}
                  </p>

                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    {item.icon}
                  </span>
                </div>

                <p className="mt-5 font-serif text-4xl font-semibold tracking-tight text-[#192B3D]">
                  {item.value.toLocaleString()}
                </p>

                <p className="mt-2 text-xs leading-5 text-[#7A8792]">
                  {item.description}
                </p>

                <div
                  className={`absolute bottom-0 left-0 h-[3px] transition-all duration-300 group-hover:w-full ${
                    index === 0
                      ? 'w-10 bg-[#344B64]'
                      : index === 1
                        ? 'w-10 bg-[#C4A16A]'
                        : index === 2
                          ? 'w-10 bg-[#71618D]'
                          : 'w-10 bg-[#668C70]'
                  }`}
                />
              </article>
            ))}
          </div>
        </section>

        {/* Content Management */}
        <section className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#A17C4B]" />

              <p className="text-[10px] font-bold uppercase tracking-[0.23em] text-[#A17C4B]">
                Manage Your Website
              </p>
            </div>

            <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-serif text-2xl font-normal tracking-tight text-[#192B3D] sm:text-3xl">
                  Content Management
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#71808D]">
                  Access your website collections and shared settings.
                  Everything is organized according to your Payload
                  configuration.
                </p>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#E5DED2] bg-white px-4 py-2 text-xs font-medium text-[#667585]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C4A16A]" />
                {dashboardGroups.length} Management Groups
              </span>
            </div>
          </div>

          {dashboardGroups.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {dashboardGroups.map((group, index) => (
                <article
                  key={group.title}
                  className="group overflow-hidden rounded-xl border border-[#E7E2D9] bg-white shadow-[0_2px_10px_rgba(25,43,61,0.035)] transition duration-200 hover:border-[#D8C8AD] hover:shadow-[0_8px_25px_rgba(25,43,61,0.055)]"
                >
                  {/* Group Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE5DC] bg-[#F3F1EB] px-5 py-5 sm:px-7">
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E4D9C6] bg-white font-serif text-sm font-semibold text-[#A17C4B] shadow-sm">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <div>
                        <h3 className="font-serif text-xl font-semibold tracking-tight text-[#192B3D]">
                          {group.title}
                        </h3>

                        <p className="mt-1 text-xs text-[#7A8792]">
                          {group.links.length}{' '}
                          {group.links.length === 1
                            ? 'section available'
                            : 'sections available'}
                        </p>
                      </div>
                    </div>

                    <span className="flex h-8 min-w-8 items-center justify-center rounded-full border border-[#E3D7C4] bg-white px-3 text-xs font-semibold text-[#A17C4B]">
                      {group.links.length}
                    </span>
                  </div>

                  {/* Group Links */}
                  <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                    {group.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="group/link flex min-h-[68px] items-center justify-between gap-3 rounded-lg border border-[#ECE9E2] bg-[#FCFBF9] px-5 py-4 text-sm font-medium text-[#263B50] no-underline transition duration-200 hover:border-[#D7C3A1] hover:bg-[#F7F3EA] hover:text-[#8E6D40]"
                      >
                        <span>{link.label}</span>

                        <span
                          aria-hidden="true"
                          className="shrink-0 text-lg text-[#B28C55] opacity-70 transition duration-200 group-hover/link:translate-x-1 group-hover/link:opacity-100"
                        >
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D8D0C3] bg-white px-6 py-14 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F1E9] font-serif text-2xl text-[#A17C4B]">
                H
              </span>

              <p className="mt-5 font-serif text-xl text-[#192B3D]">
                No content sections available
              </p>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A8792]">
                Your configured collections and globals will appear
                here once they are available.
              </p>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-4 border-t border-[#E5E0D7] pt-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A17C4B]">
              Hawthorne Legal
            </p>

            <p className="mt-1 text-xs text-[#7A8792]">
              Administration Workspace
            </p>
          </div>

          <p className="text-xs text-[#8A9299]">
            Your website. Your content. One workspace.
          </p>
        </footer>
      </div>
    </main>
  )
}
