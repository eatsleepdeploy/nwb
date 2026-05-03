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
import {exec} from "child_process";
import {promisify} from "node:util";

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

const execPromise = promisify(exec);

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
        push: false,
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
                        queue: 'default', // Queue to add the job to
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
                    let didACreate = false;
                    const c = await Promise.all(data.result.map(r => r.results).flat().map((d1Comment) => {
                        didACreate = true;
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

                    // ToDo: Turn this on once configuration is complete.
                    // const sendEmailUrl = "https://api.cloudflare.com/client/v4/accounts/4bd7e0101ed0269b44aa0d935e24aa5a/email/sending/send"
                    // if (didACreate) {
                    //     await fetch(sendEmailUrl, {
                    //         method: "POST",
                    //         headers: {
                    //             "Authorization": `Bearer ${process.env.CLOUDFLARE_D1_TOKEN}`,
                    //             "Content-Type": "application/json",
                    //         },
                    //         body: JSON.stringify({
                    //             to: 'katie@subjectconsulting.com',
                    //             cc: ["jason@jasonkelly.dev"],
                    //             from: 'info@nowankybollocks.com',
                    //             subject: 'New NWB comments!',
                    //             html: `<h1>New comments received</h1><p>Visit <a href="https://nwb-admin.darter-tone.ts.net/admin/collections/comments">the admin</a> to approve them.</p>`,
                    //             text: "New comments received."
                    //         })
                    //     })
                    // }

                    return {
                        output: {success: true, newComments: c.length},
                    }
                },
            } as TaskConfig<'importComments'>,
            {
                slug: 'buildAndOrDeploy',
                handler: async ({input}) => {
                    // Your logic here
                    if (input.status == 'published') {
                        console.log('Publishing to prod')
                        // Commented for now to prevent publish spam during content migration
                        // await execPromise('./build-and-deploy.sh')
                        await execPromise('./build.sh')
                    } else {
                        console.log('Building staging')
                        await execPromise('./build.sh')
                    }
                    return {output: {success: true}};
                },
            },
        ],
        // Important: You also need to configure a runner to execute scheduled jobs
        autoRun: [
            {
                cron: '* * * * *', // Check for jobs every minute
                queue: 'default', // Process jobs from 'daily' queue
                limit: 10,
            },
        ],
    }
})
