import type {CollectionConfig} from 'payload'
import {deploy, populateSlug, setPublished} from "@/collections/utils";

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
    },
    versions: {drafts: true},
    hooks: {
        afterChange: [deploy]
    },
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
