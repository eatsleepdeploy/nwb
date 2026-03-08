import {getImage} from "astro:assets";
import type {Image} from "@lib/types";
import type {Post} from "@root/payload-types.ts";

type ImagePathToUrlArgs = { path: string, alt: string, height?: number, width?: number }
export const imagePathToUrl = async ({path, alt, height, width}: ImagePathToUrlArgs): Promise<Image> => {
    return {
        src: (await getImage({src: `http://localhost:3000${path}`, alt, height, width})).src,
        alt,
        height,
        width
    }
}

type ImageData = { id: number, image: Image } | null
const reduceImageDataListById = (data: ImageData[]) => data.reduce((acc, curr) => {
    if (curr) {
        acc.set(curr.id, curr)
    }
    return acc
}, new Map() as Map<number, ImageData>)

export const getImagesForPosts = async (posts: Post[]) => {
    const imagesAndPosts: ImageData[] = await Promise.all(posts.map(async (post) => {
        if (!post.featuredImage?.sizes.thumbnail) {
            return null;
        }
        const image = await imagePathToUrl({
            path: post.featuredImage.sizes.thumbnail.url,
            alt: post.featuredImage.alt,
            height: post.featuredImage.sizes.thumbnail.height,
            width: post.featuredImage.sizes.thumbnail.width
        })
        return {id: post.id, image}
    }))

    const imagesAndAuthors: ImageData[] = await Promise.all(posts.map(async (post) => {
        if (!post.author?.photo) {
            return null;
        }
        const image = await imagePathToUrl({
            path: post.author.photo.sizes.thumbnail.url,
            alt: post.author.photo.alt,
            height: post.author.photo.sizes.thumbnail.height,
            width: post.author.photo.sizes.thumbnail.width
        })
        return {id: post.author.id, image}
    }))

    const imagesByPostId = reduceImageDataListById(imagesAndPosts)
    const imagesByAuthorId = reduceImageDataListById(imagesAndAuthors)
    return {imagesByAuthorId, imagesByPostId}
}
