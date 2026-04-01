import {exec} from 'child_process'
import {CollectionConfig} from 'payload'
 import {Post} from "@/payload-types";

export const Comments: CollectionConfig = {
    slug: 'comments',
    admin: {
        useAsTitle: 'id',
    },
    versions: {drafts: false},
    hooks: {
        afterChange: [
            ({doc}: { doc: Post }) => {
                exec('./build.sh')
                console.log('STATUS:: ' + doc._status)
                return doc
            }
        ],
    },
    access: {
        read: () => {
            return true
        },
    },
    fields: [
        {
            name: 'content',
            type: 'textarea',
            required: true,
        },
        {
            name: 'commenterEmail',
            type: 'email',
            required: true,
        },
        {
            name: 'commenterName',
            type: 'text',
            required: true,
        },
        {
            name: 'commenterWebsite',
            type: 'text',
            required: false,
        },
        {
            name: 'commenterAvatar',
            type: 'text',
            required: false,
        },
        {
            name: 'visible',
            type: 'checkbox',
            defaultValue: false
        },
        {
            name: 'post',
            type: 'relationship',
            relationTo: 'posts',
            required: true,
        },
        {
            name: 'parent',
            type: 'relationship',
            relationTo: 'comments',
            required: false,
        },
    ],
}
