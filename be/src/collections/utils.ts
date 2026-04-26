import type {FieldHook} from "payload";
import {Post, Page} from "@/payload-types";
import {exec} from "child_process";

export const populateSlug: FieldHook<Post> = ({value, data}) => {
    // Only set if creating or if the value is empty
    if (!value && data && data.title) {
        return data.title
            .normalize('NFD')                   // Decompose combined graphemes (accents)
            .replace(/[\u0300-\u036f]/g, '')    // Remove accents
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')               // Replace spaces with -
            .replace(/[^\w-]+/g, '')            // Remove all non-word chars
            .replace(/--+/g, '-');
    }
    return value;
};


export const setPublished: FieldHook<Post> = ({value, data}) => {
    if (value) {
        return value;
    }
    return data?.updatedAt || new Date();
};


export const deploy = ({doc}: { doc: Post | Page }) => {
    if (process.env.IS_HOMESRV !== 'true') {
        return doc
    }
    if (doc._status == 'published') {
        exec('./build-and-deploy.sh')
    } else {
        exec('./build.sh')
    }
    return doc
}