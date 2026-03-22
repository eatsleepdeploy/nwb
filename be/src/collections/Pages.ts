import type {CollectionConfig} from 'payload'
import {populateSlug, setPublished} from "@/collections/utils";

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
    },
    versions: {drafts: true},

    access: {
        read: () => {
            return true
        },
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
            name: 'content',
            type: 'richText',
        },
        {
            name: 'publishedAt',
            type: 'date',
            required: true,
            hooks: {
                beforeChange: [setPublished],
            },
        },
    ],
}
