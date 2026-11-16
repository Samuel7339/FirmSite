
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },

  auth: true,

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          defaultValue: 'editor',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
          ],
          access: {
            update: ({ req: { user } }) => user?.role === 'admin',
          },
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
}
