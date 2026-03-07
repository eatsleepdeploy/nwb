import type {CollectionConfig} from 'payload'

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
    },
    versions: {drafts: true},

    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        // ToDo: work out how to make this KT-safe
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true
        },
        {
          name: 'featuredImage', // The name of the field
          type: 'upload', // The field type
          relationTo: 'media', // The slug of the upload-enabled collection
          required: true,
        },
        {
            name: 'subcontent',
            type: 'richText',
        },
    ],
}
