/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import * as z from "zod/mini"

const Comment = z.object({
    content: z.string().check(z.minLength(1)),
    commenterEmail: z.email(),
    commenterName: z.string().check(z.minLength(1)),
    postId: z.int().check(z.minimum(1)),
    parentId: z.optional(z.int().check(z.minimum(1))),
    url: z.url()
});
type CommentType = z.infer<typeof Comment>;

const akismetApiKey = '008437a2d9eb'
const akismetCommentCheckUrl = 'https://rest.akismet.com/1.1/comment-check'

const isItSpam = async (request: Request, comment: CommentType) => {
    const formData = new FormData();
    formData.append('api_key', akismetApiKey);
    formData.append('blog', 'https://nowankybollocks.com');
    formData.append('user_ip', request.headers.get('CF-Connecting-IP') || '');
    formData.append('user_agent', request.headers.get('User-Agent') || '');
    formData.append('referrer', request.headers.get('Referer') || '');
    formData.append('permalink', comment.url);
    formData.append('comment_type', "comment");
    formData.append('comment_author', comment.commenterName);
    formData.append('comment_author_email', comment.commenterEmail);
    formData.append('comment_content', comment.content);
    formData.append('blog_lang', 'en');
    formData.append('blog_charset', 'UTF-8');
    formData.append('user_role', 'guest');

    console.log(formData)
    const response = await fetch(akismetCommentCheckUrl, {
        method: 'POST',
        body: formData,
    });
    const response_text = await response.text()
    return response_text === 'true'
}
const post = async (request: Request) => {
    const comment = Comment.parse(await request.json());
    if (await isItSpam(request, comment)) {
        throw new Error('Spam')
    }
    // ToDo: Save in DB.
    return new Response(null, {
        status: 204,
    });
}

export default {
    async fetch(request, env, ctx): Promise<Response> {
        if (request.method === "POST") {
            try {
                return await post(request, env)
            } catch (err) {
                console.log(err)
                // Handle malformed JSON or empty body
                return new Response(
                    JSON.stringify({error: "Invalid payload."}),
                    {status: 400, headers: {"Content-Type": "application/json"}}
                );
            }
        }

        return new Response("o/");
    },
} satisfies ExportedHandler<Env>;
