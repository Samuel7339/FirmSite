
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { visualEditor } from 'payload-inline-visual-editor'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { PracticeAreas } from './collections/PracticeAreas'
import { Attorneys } from './collections/Attorneys'
import { Posts } from './collections/Posts'
import { Cases } from './collections/Cases'
import { Testimonials } from './collections/Testimonials'
import { FAQs } from './collections/FAQs'
import { Pages } from './collections/Pages'

import { SiteSettings } from './globals/SiteSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

type RecordData = Record<string, unknown>

const getText = (value: unknown): string => {
  return typeof value === 'string' ? value.trim() : ''
}

// Extract readable text from Payload Lexical rich text.
const getRichText = (value: unknown): string => {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value)) {
    return value.map(getRichText).filter(Boolean).join(' ')
  }

  if (!value || typeof value !== 'object') {
    return ''
  }

  const record = value as RecordData

  if (typeof record.text === 'string') {
    return record.text.trim()
  }

  if (Array.isArray(record.children)) {
    return record.children.map(getRichText).filter(Boolean).join(' ')
  }

  if (record.root) {
    return getRichText(record.root)
  }

  return ''
}

// Get the ID from a Payload upload relationship.
const getImageID = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as RecordData).id

    if (typeof id === 'string' || typeof id === 'number') {
      return String(id)
    }
  }

  return ''
}

// Find an image relationship inside page layout blocks.
const findLayoutImage = (value: unknown): string => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const image = findLayoutImage(item)
      if (image) return image
    }

    return ''
  }

  if (!value || typeof value !== 'object') {
    return ''
  }

  const record = value as RecordData

  const imageKeys = [
    'image',
    'featuredImage',
    'portrait',
    'heroImage',
    'backgroundImage',
    'photo',
  ]

  for (const key of imageKeys) {
    const image = getImageID(record[key])
    if (image) return image
  }

  for (const [key, child] of Object.entries(record)) {
    if (key === 'id' || key === 'url' || key === 'filename') continue

    const image = findLayoutImage(child)
    if (image) return image
  }

  return ''
}

// Find useful descriptive text inside page layout blocks.
const findLayoutDescription = (value: unknown): string => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const description = findLayoutDescription(item)
      if (description) return description
    }

    return ''
  }

  if (!value || typeof value !== 'object') {
    return ''
  }

  const record = value as RecordData

  const textKeys = [
    'description',
    'shortDescription',
    'intro',
    'subheading',
    'text',
    'summary',
  ]

  for (const key of textKeys) {
    const text = getRichText(record[key])
    if (text) return text
  }

  for (const child of Object.values(record)) {
    const description = findLayoutDescription(child)
    if (description) return description
  }

  return ''
}

// Generate a collection-specific description with fallbacks.
const getSEODescription = (
  doc: RecordData,
  collectionSlug: string,
): string => {
  const title = getText(doc.title)
  const name = getText(doc.name)

  switch (collectionSlug) {
    case 'pages': {
      const description =
        getText(doc.description) ||
        findLayoutDescription(doc.layout)

      return (
        description ||
        (title
          ? `Learn more about ${title} and how our legal team can assist you.`
          : 'Learn more about our legal services and how our team can assist you.')
      )
    }

    case 'attorneys': {
      const description =
        getText(doc.shortBio) ||
        getRichText(doc.biography)

      return (
        description ||
        (name
          ? `Meet ${name} and learn more about their legal experience and expertise.`
          : 'Meet our experienced legal team.')
      )
    }

    case 'practice-areas': {
      const description =
        getText(doc.shortDescription) ||
        getRichText(doc.description)

      return (
        description ||
        (title
          ? `Learn how our firm can assist you with ${title.toLowerCase()} matters.`
          : 'Explore the legal services offered by our firm.')
      )
    }

    case 'cases': {
      const description =
        getText(doc.summary) ||
        getRichText(doc.content)

      return (
        description ||
        (title
          ? `Explore the legal matter, approach, and outcome of ${title}.`
          : 'Explore our case studies and legal experience.')
      )
    }

    case 'posts': {
      const description =
        getText(doc.excerpt) ||
        getRichText(doc.content)

      return (
        description ||
        (title
          ? `Read ${title} and explore the latest legal insights from our firm.`
          : 'Explore the latest legal insights and updates from our firm.')
      )
    }

    default:
      return 'Learn more about our legal services.'
  }
}

// Find the appropriate image for each collection.
const getSEOImage = (
  doc: RecordData,
  collectionSlug: string,
): string => {
  let image = ''

  switch (collectionSlug) {
    case 'attorneys':
      image =
        getImageID(doc.portrait) ||
        getImageID(doc.image) ||
        getImageID(doc.featuredImage)
      break

    case 'practice-areas':
      image =
        getImageID(doc.image) ||
        getImageID(doc.featuredImage) ||
        getImageID(doc.heroImage)
      break

    case 'cases':
    case 'posts':
      image =
        getImageID(doc.featuredImage) ||
        getImageID(doc.image)
      break

    case 'pages':
      image = findLayoutImage(doc.layout)
      break
  }

  return image
}

export default buildConfig({
  admin: {
    user: Users.slug,

    importMap: {
      baseDir: path.resolve(dirname),
    },

    meta: {
      titleSuffix: '- Hawthorne Legal',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/branding/hawthorne-logo.png',
        },
      ],
    },

    // Live Preview — initially enabled only for Pages.
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data.slug === 'string' ? data.slug : ''

        return slug === 'home' || !slug ? '/' : `/${slug}`
      },

      collections: ['pages'],

      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },

    components: {
      graphics: {
        Logo: '/components/graphics/Logo',
        Icon: '/components/graphics/Icon',
      },

      views: {
        dashboard: {
          Component: '/components/admin/Dashboard',
        },
      },
    },
  },

  collections: [
    Users,
    Media,
    PracticeAreas,
    Attorneys,
    Posts,
    Cases,
    Testimonials,
    FAQs,
    Pages,
  ],

  globals: [SiteSettings, Header, Footer],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),

  sharp,

  plugins: [
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        email: true,
        select: true,
        radio: true,
        checkbox: true,
        number: true,
        message: true,
        date: false,
        payment: false,
      },
      redirectRelationships: ['pages'],
    }),

    seoPlugin({
      collections: [
        'pages',
        'practice-areas',
        'attorneys',
        'cases',
        'posts',
      ],

      uploadsCollection: 'media',

      generateTitle: ({ doc, collectionSlug }) => {
        const slug = collectionSlug || ''

        const title =
          slug === 'attorneys'
            ? getText(doc?.name)
            : getText(doc?.title)

        const suffixes: Record<string, string> = {
          pages: 'Legal Services',
          'practice-areas': 'Practice Area',
          attorneys: 'Attorney',
          cases: 'Case Study',
          posts: 'Insights',
        }

        const suffix = suffixes[slug] || 'Legal Services'

        return title
          ? `${title} | ${suffix}`
          : 'Legal Services'
      },

      generateDescription: ({ doc, collectionSlug }) => {
        return getSEODescription(doc as RecordData, collectionSlug || '')
      },

      generateImage: ({ doc, collectionSlug }) => {
        return getSEOImage(doc as RecordData, collectionSlug || '')
      },
    }),

    // Inline Visual Editor
    visualEditor(),
  ],
})
