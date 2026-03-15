import {stringify} from 'qs-esm'
import type {Where} from 'payload'
import type {Post} from "../../payload-types.ts";

const padZero = (s: string | number) => String(s).padStart(2, '0')
export const postToPath = (post: Post) => {
    const d = new Date(post.createdAt)
    return `/${d.getFullYear()}/${padZero(d.getMonth() + 1)}/${padZero(d.getDay())}/${post.slug}`
}

export const postToPublishDate = (post: Post) : string => {
    const d = new Date(post.publishedAt || post.createdAt)
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()}`
}


export const getPosts = async (limit: number = 10) => {
    const stringifiedQuery = stringify({
        limit,
        depth: 2,
    })
    console.log(stringifiedQuery)
    const res = await fetch(`http://localhost:3000/api/posts?${stringifiedQuery}`)
    const posts: { docs: Post[] } = await res.json()
    return posts.docs
}

export const getPostsWithTags = async (tags: string[], limit: number = 10) => {
    const stringifiedQuery = stringify({
        where: {
            'tags.slug': {
                'in': tags
            }
        } satisfies Where,
        limit,
        depth: 2,
    })
    const res = await fetch(`http://localhost:3000/api/posts?${stringifiedQuery}`)
    const posts: { docs: Post[] } = await res.json()
    return posts.docs
}