import axios from 'axios';

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
  try {
    let params = new URLSearchParams({
      documentId: blogId,
    })
    // console.log(`URL: ${process.env.BASE_URL}/api/blogs/`)
    // const blogResponse = await axios.get(`${process.env.BASE_URL}/api/blogs?${params.toString()}`)
    const blogResponse = await axios.get(`https://danielsaisani.com/api/blogs?${params.toString()}`)


    const blogData = await blogResponse.data

    // console.log(`Response from NextJS backend: ${JSON.stringify(blogData, null, 2)}`)

    return blogData as BlogResponse
  }
  catch (error) {
    console.error('Fetch failed:', error)
    return {
      response: {
        data: null
      }
    }
  }
}

async function getAllBlogs() {

  try {
    // console.log(`URL: ${process.env.BASE_URL}/api/blogs/`)
    // const allBlogsResponse = await fetch(`${process.env.BASE_URL}/api/blogs/`)

    const allBlogsResponse = await axios.get(`https://danielsaisani.com/api/blogs/`)

    const blogsData = await allBlogsResponse.data
    // console.log(`Response from NextJS backend: ${JSON.stringify(blogsData, null, 2)}`)
    return blogsData as BlogsResponse
  }
  catch (error) {
    console.error('Fetch failed:', error);
    return {
      response: {
        data: []
      }
    }
  }



}

async function getAllUnpublishedBlogs() {
  try {
    // console.log(`URL: ${process.env.BASE_URL}/api/blogs?status=draft`)
    // const allBlogsResponse = await axios.get(`${process.env.BASE_URL}/api/blogs?status=draft`);
    const allBlogsResponse = await axios.get(`https://danielsaisani.com/api/blogs?status=draft`);

    return allBlogsResponse.data as UnpublishedBlogsResponse;
  } catch (error) {
    console.error('Fetch failed:', error);
    return {
      response: {
        data: []
      }
    };
  }
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
  try {
    const allBlogs = await getAllBlogData();
    return allBlogs
  } catch (error) {
    console.error(error);
    return []
  }
}

export async function getUnpublishedBlogPosts() {
  const allUnpublishedBlogs = await getAllUnpublishedBlogData();
  return allUnpublishedBlogs
}

export async function getBlogPost(blogId) {
  const blog = await getBlogData(blogId);
  return blog
}