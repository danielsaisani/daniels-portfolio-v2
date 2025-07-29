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
            publishedAt: z.string().nullable(),
            updatedAt: z.string(),
            createdAt: z.string(),
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
        createdAt: z.string(),
        updatedAt: z.string(),
        author: z.object({
            name: z.string()
        }).nullable(),
        blocks: z.array(
            z.object({
                id: z.number(),
                body: z.string(),
            })
        )
    }).nullable()
})

export async function GET(request: NextRequest) {
    let params = request.nextUrl.searchParams;
    const blogId = params.get('documentId') ? params.get('documentId') : "";

    if (blogId) {
        params.append('populate', '*');
    }

    console.log(`Received request for blogs with params: ${params.toString()}`);

    let blogServerResponse;
    try {
        blogServerResponse = await fetch(`${process.env.STRAPI_URL}/articles/${blogId}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
            },
            cache: 'no-store', // Ensure fresh data from Strapi
        });

        if (!blogServerResponse.ok) {
            const errorBody = await blogServerResponse.text(); // Attempt to get more error info
            console.error(`Blog server returned error: ${blogServerResponse.status} ${blogServerResponse.statusText}. Body: ${errorBody}`);
            return new Response(JSON.stringify({ success: false, error: `Blog server error: ${blogServerResponse.status}. ${errorBody}` }), { 
                status: blogServerResponse.status, // Use Strapi's error status if available
                headers: { 'Content-Type': 'application/json' } 
            });
        }
    } catch (networkError) {
        console.error('Network error fetching from blog server:', networkError);
        return new Response(JSON.stringify({ success: false, error: "Failed to connect to blog server." }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }

    let blogData;
    try {
        blogData = await blogServerResponse.json();
    } catch (jsonError) {
        console.error('Failed to parse JSON from blog server:', jsonError);
        // Attempt to get text body if JSON parsing fails, in case the error response wasn't JSON
        const textBody = await blogServerResponse.text().catch(() => "Could not retrieve error body.");
        console.error('Response body (text):', textBody);
        return new Response(JSON.stringify({ success: false, error: "Invalid JSON response from blog server." }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }

    // Be cautious logging potentially large objects in production
    // console.log(`API Response Data: ${JSON.stringify(blogData)}`); 

    try {
        const responseSchema = blogId ? BlogServerApiBlogResponseSchema : BlogServerApiBlogsResponseSchema;
        const validatedResponse = responseSchema.parse(blogData);
        // Successfully validated, return the data in the original structure for the client
        return Response.json({ response: validatedResponse });
    } catch (zodError) {
        if (zodError instanceof z.ZodError) {
            console.error('Zod validation error:', zodError.errors);
        } else {
            console.error('Unknown Zod-related error:', zodError);
        }
        return new Response(JSON.stringify({ success: false, error: "Unexpected data structure from blog server." }), { 
            status: 500, 
            headers: { 'Content-Type': 'application/json' } 
        });
    }
}