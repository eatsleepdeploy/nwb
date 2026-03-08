import {stringify} from 'qs-esm'
import type {Where} from 'payload'
import type {Post} from "../../payload-types.ts";

const padZero = (s: string | number) => String(s).padStart(2, '0')
export const postToPath = (post: Post) => {
    const d = new Date(post.createdAt)
    return `/${d.getFullYear()}/${padZero(d.getMonth() + 1)}/${padZero(d.getDay())}/${post.slug}`
}


export const getPosts = async () => {
    const res = await fetch("http://localhost:3000/api/posts")
    const posts: { docs: Post[] } = await res.json()
    return posts.docs
}


export const getBestOfNWBPosts = async () => {
    const stringifiedQuery = stringify({
        where: {
            'tags.slug': {
                equals: 'best-of-nwb'
            }
        } satisfies Where,
        depth: 1,
    }, {addQueryPrefix: true})
    console.log(stringifiedQuery)
    const res = await fetch(`http://localhost:3000/api/posts${stringifiedQuery}`)
    const posts: { docs: Post[] } = await res.json()
    console.log('GOT', posts.docs.length)
    return posts.docs
}