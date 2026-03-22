import {stringify} from 'qs-esm'
import type {Page} from "@root/payload-types.ts";


export const getPages = async (limit: number = 10) => {
    const stringifiedQuery = stringify({
        limit,
        depth: 2,
        sort: '-publishedAt',
        draft: process.env.IS_PREVIEW === 'true',
    })
    console.log(stringifiedQuery)
    const res = await fetch(`http://localhost:3000/api/pages?${stringifiedQuery}`)
    const posts: { docs: Page[] } = await res.json()
    return posts.docs
}
