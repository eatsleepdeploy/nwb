import {stringify} from 'qs-esm'
import type {Comment, Post} from "@root/payload-types.ts";


export const commentToCreatedDate = (comment: Comment) : string => {
    const d = new Date(comment.createdAt)
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} At ${d.toLocaleString('default', { hour: 'numeric', minute: '2-digit' })}`
}

export const getComments = async (post: Post) => {
    const stringifiedQuery = stringify({
        where: {
            post: {equals: post.id},
            visible: {equals: true}
        },
        depth: 2,
        sort: '-createdAt',
        draft: process.env.IS_PREVIEW === 'true',
    })
    console.log(stringifiedQuery)
    const res = await fetch(`http://localhost:3000/api/comments?${stringifiedQuery}`)
    const posts: { docs: Comment[] } = await res.json()
    return posts.docs
}
