import type {CollectionConfig} from 'payload'
import {deploy, populateSlug} from "@/collections/utils";


export const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        useAsTitle: 'title',
    },
    versions: false,
    access: {
        read: () => true,
    },
    hooks: {
        afterChange: [deploy]
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
            name: 'description',
            type: 'textarea',
            required: false
        },
    ],
}
