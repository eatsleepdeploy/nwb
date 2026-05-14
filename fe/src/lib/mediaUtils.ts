import {getImage} from "astro:assets";
import type {Image} from "@lib/types";
import type {Post} from "@root/payload-types.ts";
import type {SerializedEditorState} from "lexical";

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

export const getThubmnailAndAuthorImages = async (posts: Post[]) => {
    const imagesAndPosts: ImageData[] = await Promise.all(posts.map(async (post) => {
        if (!post.featuredImage?.sizes.thumbnail) {
            return null;
        }
        const img = post.featuredImage.sizes.thumbnail?.url ? post.featuredImage.sizes.thumbnail : post.featuredImage;
        const image = await imagePathToUrl({
            path: img.url,
            alt: post.featuredImage.alt,
            height: img.height,
            width: img.width
        })
        return {id: post.id, image}
    }))

    const imagesAndAuthors: ImageData[] = await Promise.all(posts.map(async (post) => {
        if (!post.author?.photo) {
            return null;
        }
        const img = post.author.photo.sizes.thumbnail?.url ? post.author.photo.sizes.thumbnail : post.author.photo;
        const image = await imagePathToUrl({
            path: img.url,
            alt: post.author.photo.alt,
            height: img.height,
            width: img.width
        })
        return {id: post.author.id, image}
    }))

    const imagesByPostId = reduceImageDataListById(imagesAndPosts)
    const imagesByAuthorId = reduceImageDataListById(imagesAndAuthors)
    return {imagesByAuthorId, imagesByPostId}
}

export const getMainImage = async (post: Post) => {
    if (!post.featuredImage?.url) {
        return {src: ''}
    }
    return imagePathToUrl({
        path: post.featuredImage.url,
        alt: post.featuredImage.alt,
        height: post.featuredImage.height,
        width: post.featuredImage.width
    })
}


export const parseImagesFromContent = (content: SerializedEditorState) => {
    return Promise.all(content.root.children.map(async (node: any) => {
        if (node.type === 'upload' && node.value.url) {
            const thisImage = await imagePathToUrl({
                path: node.value.url,
                alt: node.value.alt,
                height: node.value.height,
                width: node.value.width
            })
            node.value.url = thisImage.src
        }
    }))
}