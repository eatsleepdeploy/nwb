import {stringify} from 'qs-esm'
import type {Comment, Post} from "@root/payload-types.ts";


export const commentToCreatedDate = (comment: Comment) : string => {
    const d = new Date(comment.createdAt)
    return `${d.toLocaleString('default', { month: 'long' })} ${d.getDate()}, ${d.getFullYear()} At ${d.toLocaleString('default', { hour: 'numeric', minute: '2-digit' })}`
}



export type CommentWithChildren = Comment & {children: CommentWithChildren[]}

function nestComments(data: Comment[]): CommentWithChildren[] {
    const map = new Map();
    const tree: CommentWithChildren[] = [];

    // Step 1 & 2: Initialize map and add 'children' array to each item
    data.forEach(item => {
        // Create a shallow copy to avoid mutating the original data
        map.set(item.id, { ...item, children: [] });
    });

    // Step 3, 4 & 5: Iterate and build the tree structure
    map.forEach(item => {
        if (item.parent) {
            const parent = map.get(item.parent);
            if (parent) {
                parent.children.push(item);
            }
        } else {
            tree.push(item); // This is a root item
        }
    });
    return tree;
}

export const getComments = async (post: Post) => {
    const stringifiedQuery = stringify({
        where: {
            post: {equals: post.id},
            visible: {equals: true}
        },
        depth: 0,
        sort: '-createdAt',
        draft: process.env.IS_PREVIEW === 'true',
    })
    console.log(stringifiedQuery)
    const res = await fetch(`http://localhost:3000/api/comments?${stringifiedQuery}`)
    const posts: { docs: Comment[] } = await res.json()
    return nestComments(posts.docs)
}
