import type {CollectionConfig} from 'payload'
import {populateSlug} from "@/collections/utils";


export const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        useAsTitle: 'title',
    },
    versions: false,
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
    ],
}
