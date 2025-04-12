import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const BlogServerApiResponseSchema = z.object({
    data: z.array(
        z.object({
            id: z.number(),
            documentId: z.string(),
            title: z.string(),
            description: z.string().nullable(),
            slug: z.string(),
            publishedAt: z.string(),
            updatedAt: z.string(),
        })
    ).nullable()
})

export async function GET(request: NextApiRequest) {

    const blogsResponse = await fetch(`${process.env.STRAPI_URL}/articles`, {
        headers: {
            'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
        }
    })

    const blogs = await blogsResponse.json()    

    console.log(`API Response : ${JSON.stringify(blogs)}`)

    const response = BlogServerApiResponseSchema.parse(blogs)

    return Response.json({ response })

}