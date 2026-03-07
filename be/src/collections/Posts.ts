import type {CollectionConfig, FieldHook} from 'payload'
import {Post} from "@/payload-types";

const populateSlug: FieldHook<Post> = ({value, data}) => {
    // Only set if creating or if the value is empty
    if (!value && data && data.title) {
        return data.title
            .normalize('NFD')                   // Decompose combined graphemes (accents)
            .replace(/[\u0300-\u036f]/g, '')    // Remove accents
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')               // Replace spaces with -
            .replace(/[^\w-]+/g, '')            // Remove all non-word chars
            .replace(/--+/g, '-');
    }
    return value;
};

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
    ],
}
