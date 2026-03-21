import {stringify} from 'qs-esm'
import type {Tag} from "../../payload-types.ts";



export const getTags = async () => {
    const stringifiedQuery = stringify({
        depth: 1,
        limit: Number.MAX_SAFE_INTEGER
    })
    const res = await fetch(`http://localhost:3000/api/tags?${stringifiedQuery}`)
    const response: { docs: Tag[] } = await res.json()
    return response.docs
}

