import type {CollectionConfig} from 'payload'


export const Authors: CollectionConfig = {
    slug: 'authors',
    admin: {
        useAsTitle: 'name',
    },
    versions: {drafts: true},

    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'photo', // The name of the field
            type: 'upload', // The field type
            relationTo: 'media', // The slug of the upload-enabled collection
            required: true,
        },
        {
            name: 'bio',
            type: 'richText',
            required: true,
        },
    ],
}
