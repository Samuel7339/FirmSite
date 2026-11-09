
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
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

  plugins: [],
})
