import type {Post} from "../../payload-types.ts";

const padZero = (s: string | number) => String(s).padStart(2, '0')
export const postToPath = (post: Post) => {
    const d =  new Date(post.createdAt)
    return `/${d.getFullYear()}/${padZero(d.getMonth() + 1)}/${padZero(d.getDay())}/${post.slug}`
}


export const getPosts = async () => {
    const res = await fetch("http://localhost:3000/api/posts")
    const posts: { docs: Post[] } = await res.json()
    return posts.docs
}