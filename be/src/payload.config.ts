import {sqliteAdapter} from '@payloadcms/db-sqlite'
import {lexicalEditor} from '@payloadcms/richtext-lexical'
import path from 'path'
import {buildConfig, TaskConfig} from 'payload'
import {fileURLToPath} from 'url'
import sharp from 'sharp'

import {Users} from './collections/Users'
import {Media} from './collections/Media'
import {Posts} from "@/collections/Posts";
import {Authors} from "@/collections/Authors";
import {Tags} from "@/collections/Tags";
import {Pages} from "@/collections/Pages";
import {Comments} from "@/collections/Comments";

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

type D1Comment = {
    id: number;
    content: string;
    commenter_email: string;
    commenter_name: string;
    post_id: number;
    parent_id?: number | null;
    user_ip?: string | null;
}

export default buildConfig({
    admin: {
        user: Users.slug,
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    collections: [Users, Media, Posts, Authors, Tags, Pages, Comments],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || '',
    typescript: {
        outputFile: path.resolve(dirname, '..', '..', 'fe', 'payload-types.ts'),
    },
    db: sqliteAdapter({
        client: {
            url: process.env.DATABASE_URL || '',
        },
    }),
    sharp,
    plugins: [],
    jobs: {
        tasks: [
            {
                retries: 2,
                slug: 'importComments',
                schedule: [
                    {
                        cron: '0 8 * * *', // Every day at 8:00 AM
                        queue: 'daily', // Queue to add the job to
                    },
                ],
                inputSchema: [
                    {
                        name: 'date',
                        type: 'date',
                    },
                ],
                handler: async ({input, req}) => {
                    if (!process.env.CLOUDFLARE_D1_TOKEN) {
                        return;
                    }
                    const query = await req.payload.find({
                        collection: 'comments',
                        where: {
                            d1Id: {
                                exists: true
                            }
                        },
                        depth: 0,
                        sort: '-d1Id',
                        limit: 1
                    })
                    const biggestCommentImportId = query.docs[0]?.d1Id || 0
                    const payload = {
                        "sql": "SELECT * FROM comments WHERE id > ? order by id asc",
                        "params": [biggestCommentImportId]
                    }
                    const d1Url = "https://api.cloudflare.com/client/v4/accounts/4bd7e0101ed0269b44aa0d935e24aa5a/d1/database/b569de49-b082-4bc5-8de5-ed8f219b9d4b/query"
                    const response = await fetch(d1Url, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${process.env.CLOUDFLARE_D1_TOKEN}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload)
                    })
                    if (!response.ok) {
                        throw new Error("request failed")
                    }
                    const data: { result: { results: D1Comment[] }[] } = await response.json()
                    const c = await Promise.all(data.result.map(r => r.results).flat().map((d1Comment) => {
                        return req.payload.create({
                            collection: 'comments',
                            data: {
                                content: d1Comment.content,
                                commenterEmail: d1Comment.commenter_email,
                                commenterName: d1Comment.commenter_name,
                                post: d1Comment.post_id,
                                parent: d1Comment.parent_id,
                                d1Id: d1Comment.id
                            },
                        })
                    }))

                    return {
                        output: {success: true, newComments: c.length},
                    }
                },
            } as TaskConfig<'importComments'>,
        ],
        // Important: You also need to configure a runner to execute scheduled jobs
        autoRun: [
            {
                cron: '*/5 * * * *', // Check for jobs every minute
                queue: 'daily', // Process jobs from 'daily' queue
                limit: 10,
            },
        ],
    }
})
