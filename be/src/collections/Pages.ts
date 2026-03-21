import type {CollectionConfig} from 'payload'
import {populateSlug, setPublished} from "@/collections/utils";

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'title',
    },
    versions: {drafts: true},

    access: {
        read: ({req}) => {
            // If there is a user logged in,
            // let them retrieve all documents
            if (req.user) return true

            // If there is no user,
            // restrict the documents that are returned
            // to only those where `_status` is equal to `published`
            return {
                _status: {
                    equals: 'published',
                },
            }
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
