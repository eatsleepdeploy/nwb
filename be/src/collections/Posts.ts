import {exec} from 'child_process'
import {CollectionConfig} from 'payload'
import {populateSlug, setPublished} from "@/collections/utils";
import {Post} from "@/payload-types";

export const Posts: CollectionConfig = {
    slug: 'posts',
    admin: {
        useAsTitle: 'title',
    },
    versions: {drafts: true},
    hooks: {
        afterChange: [
            ({doc}: { doc: Post }) => {
                exec('./build.sh')
                return doc
            }
        ]
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
