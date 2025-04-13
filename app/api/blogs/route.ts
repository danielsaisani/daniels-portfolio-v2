import { NextRequest } from 'next/server'
import { z } from 'zod'

const BlogServerApiBlogsResponseSchema = z.object({
    data: z.array(
        z.object({
            id: z.number(),
            documentId: z.string(),
            title: z.string(),
            description: z.string().nullable(),
            slug: z.string().nullable(),
            publishedAt: z.string(),
            updatedAt: z.string(),
        })
    ).nullable()
})

const BlogServerApiBlogResponseSchema = z.object({
    data: z.object({
        id: z.number(),
        documentId: z.string(),
        title: z.string(),
        description: z.string().nullable(),
        slug: z.string().nullable(),
        publishedAt: z.string(),
        updatedAt: z.string(),
        author: z.object({
            name: z.string()
        }),
        blocks: z.array(
            z.object({
                id: z.number(),
                body: z.string(),
            })
        )
    }).nullable()
})

export async function GET(request: NextRequest) {

    let params = request.nextUrl.searchParams

    const blogId = params.get('documentId') ? params.get('documentId') : ""

    if (blogId) {
        params.append('populate', '*')
    }

    console.log(`Received request with params: ${params.toString()}`)

    const blogServerResponse = await fetch(`${process.env.STRAPI_URL}/articles/${blogId}?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
        },
    })

    const blogData = await blogServerResponse.json()

    console.log(`API Response : ${JSON.stringify(blogData)}`)

    const response = blogId ? BlogServerApiBlogResponseSchema.parse(blogData) : BlogServerApiBlogsResponseSchema.parse(blogData)

    return Response.json({ response })

}