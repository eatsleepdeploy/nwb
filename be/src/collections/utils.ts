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

// ToDo: Turn this into a task
export const deploy = async ({doc, req}: { doc: Post | Page, req: Request }) => {
    if (!process.env.CLOUDFLARE_D1_TOKEN) {
        console.log(`process.env.CLOUDFLARE_D1_TOKEN is empty, not doing owt`)
        return doc
    }
    await req.payload.jobs.queue({
      task: 'buildAndOrDeploy',
      input: {
        status: doc._status
      },
    })
    return doc
}