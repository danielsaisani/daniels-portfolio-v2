type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

type Blog = {
  id: number;
  documentId: string;
  slug: string;
  description: string | null;
  author: { name: string };
  publishedAt: string;
  updatedAt: string;
  blocks: { body: string }[];
  title: string
}

type BlogMetaData = {
  id: number;
  documentId: string;
  slug: string;
  description: string | null;
  author: { name: string };
  publishedAt: string;
  updatedAt: string;
  title: string
}

type UnpublishedBlog = {
  id: number;
  documentId: string;
  slug: string;
  description: string | null;
  author: { name: string };
  updatedAt: string;
  publishedAt: string | null;
  blocks: { body: string }[] | null;
  title: string
}

type UnpublishedBlogsResponse = {
  response: {
    data: UnpublishedBlog[]
  }
}

type BlogsResponse = {
  response: {
    data: BlogMetaData[]
  }
}

type BlogResponse = {
  response: {
    data: Blog
  }
}



function extractTweetIds(content) {
  let tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g);
  return tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0]) || [];
}

async function getBlog(blogId) {
  let params = new URLSearchParams({
    documentId: blogId,
  })

  const blogResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?${params.toString()}`)

  const blogData = await blogResponse.json()

  // console.log(`Response from NextJS backend: ${JSON.stringify(blogData, null, 2)}`)

  return blogData as BlogResponse
}

async function getAllBlogs() {
  const allBlogsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/`)

  const blogsData = await allBlogsResponse.json()

  console.log(`Response from NextJS backend: ${JSON.stringify(blogsData, null, 2)}`)

  return blogsData as BlogsResponse
}

async function getAllUnpublishedBlogs() {
  const allBlogsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs?status=draft`)

  const blogsData = await allBlogsResponse.json()

  // console.log(`Response from NextJS backend: ${JSON.stringify(blogsData, null, 2)}`)

  return blogsData as UnpublishedBlogsResponse
}

async function getAllUnpublishedBlogData() {

  let publishedBlogObjects = await getAllBlogs()
  let blogObjects = await getAllUnpublishedBlogs();

  const data = blogObjects.response.data.map((blogObject) => {

    const blogId = blogObject.documentId
    const slug = blogObject.slug
    const title = blogObject.title
    const publishedAt = blogObject.publishedAt
    const documentId = blogObject.documentId

    return {
      slug,
      title,
      publishedAt,
      documentId,
    };
  }).filter((blogObject) => {
    return !blogObject.publishedAt && !publishedBlogObjects.response.data.map((blog) => blog.documentId).includes(blogObject.documentId);
  });

  return data

}

async function getAllBlogData() {

  let blogObjects = await getAllBlogs();

  const data = blogObjects.response.data.map((blogObject) => {

    const blogId = blogObject.documentId
    const slug = blogObject.slug
    const publishedAt = blogObject.publishedAt
    const title = blogObject.title

    return {
      publishedAt,
      slug,
      title,
      blogId
    };
  });

  return data

}

async function getBlogData(blogId) {

  let blogObject = await getBlog(blogId);

  return blogObject.response.data

}

export async function getBlogPosts() {
  const allBlogs = await getAllBlogData();
  return allBlogs
}

export async function getUnpublishedBlogPosts() {
  const allUnpublishedBlogs = await getAllUnpublishedBlogData();
  return allUnpublishedBlogs
}

export async function getBlogPost(blogId) {
  const blog = await getBlogData(blogId);
  return blog
}