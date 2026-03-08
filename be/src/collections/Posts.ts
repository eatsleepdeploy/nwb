import type {CollectionConfig} from 'payload'
import {populateSlug} from "@/collections/utils";

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
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            hooks: {
                beforeChange: [populateSlug],
            },
        },
        {
            name: 'author', // The name of the field
            type: 'relationship', // The field type
            relationTo: 'authors', // The slug of the upload-enabled collection
            required: true,
        },
        {
            name: 'excerpt',
            type: 'textarea',
            required: false
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
        {
            name: 'tags', // The name of the field
            type: 'relationship', // The field type
            relationTo: 'tags', // The slug of the upload-enabled collection
            required: false,
            hasMany: true
        },
    ],
}
