
import type { Access } from 'payload'

export const adminOnly: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const adminOrEditorCreateDraft: Access = ({
  req: { user },
  data,
}) => {
  if (user?.role === 'admin') return true

  if (user?.role === 'editor') {
    // Editors cannot create published records.
    // Allow access when Payload is checking permissions
    // without an actual submitted data object.
    if (!data) return true

    return data._status !== 'published'
  }

  return false
}

export const adminPublishEditorDraftUpdate: Access = ({
  req: { user },
  data,
}) => {
  if (user?.role === 'admin') return true

  if (user?.role === 'editor') {
    // Editors can edit records, but cannot submit
    // an update explicitly requesting publication.
    if (!data) return true

    return data._status !== 'published'
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
