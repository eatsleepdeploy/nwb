import {getImage} from "astro:assets";
import type {Image} from "@lib/types";

type ImagePathToUrlArgs = { path: string, alt: string, height?: number, width?: number }
export const imagePathToUrl = async ({path, alt, height, width}: ImagePathToUrlArgs): Promise<Image> => {
    return {
        src: (await getImage({src: `http://localhost:3000${path}`, alt, height, width})).src,
        alt,
        height,
        width
    }
}