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
  blocks: { body: string }[] | null;
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
    data: Blog[]
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

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, '').trim();
  let frontMatterLines = frontMatterBlock.trim().split('\n');
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ');
    let value = valueArr.join(': ').trim();
    value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
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

  console.log(`Response from NextJS backend: ${JSON.stringify(blogsData, null, 2)}`)

  return blogsData as UnpublishedBlogsResponse
}

function readMDXContent(rawContent) {
  return parseFrontmatter(rawContent);
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
    return !blogObject.publishedAt && !publishedBlogObjects.response.data.map((blog)=>blog.documentId).includes(blogObject.documentId);
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
      title
    };
  });

  return data

}

export async function getBlogPosts() {
  const allBlogs = await getAllBlogData();
  return allBlogs
}

export async function getUnpublishedBlogPosts() {
  const allUnpublishedBlogs = await getAllUnpublishedBlogData();
  return allUnpublishedBlogs
}
