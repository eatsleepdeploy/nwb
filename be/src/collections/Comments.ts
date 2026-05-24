import crypto from 'crypto';
import {CollectionConfig} from 'payload'
import {deploy} from "@/collections/utils";


export const Comments: CollectionConfig = {
    slug: 'comments',
    admin: {
        useAsTitle: 'id',
    },
    versions: {drafts: false},
    hooks: {
        beforeChange: [
            async ({data, originalDoc}: { data: Partial<any>, originalDoc?: any }) => {
                const email = data.commenterEmail || originalDoc?.commenterEmail
                if (!email) {
                    return data
                }
                const hash = crypto.createHash('sha256')
                   .update(email.toLowerCase().trim())
                   .digest('hex');
                data.commenterAvatar = `https://gravatar.com/avatar/${hash}.jpg?d=mp`
                return data
            }
        ],
        afterChange: [deploy]
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
        {
            name: 'd1Id',
            type: "number",
            required: false,
            unique: true
        },
        {
          name: 'createdAt',
          type: 'date',
          label: 'Created At',
          index: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime', // Allows precise date and time selection
            },
            position: 'sidebar', // Cleanly tuck it away in the UI
          },
        },
    ],
}
