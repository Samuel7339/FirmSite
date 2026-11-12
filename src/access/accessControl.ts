
import type { Access } from 'payload'

export const adminOnly: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const adminOrEditorCreateDraft: Access = ({ req: { user } }) => {
  return Boolean(user)
}

export const adminPublishEditorDraftUpdate: Access = ({ req: { user } }) => {
  if (user?.role === 'admin') return true

  if (user?.role === 'editor') {
    return {
      _status: {
        equals: 'draft',
      },
    }
  }

  return false
}



export const publishedOrStaff: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    or: [
      {
        _status: {
          equals: 'published',
        },
      },
      {
        _status: {
          exists: false,
        },
      },
    ],
  }
}
