import axios from 'axios';

// Type definitions (assuming these are correct and don't need changes for this subtask)
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

// This function is not directly using axios, so it's not modified for API base URL or detailed logging here.
// If it were to be used by external callers needing configurable base URLs, it would need changes.
function extractTweetIds(content) {
  let tweetMatches = content.match(/<StaticTweet\sid="[0-9]+"\s\/>/g);
  return tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0]) || [];
}

async function getBlog(blogId) {
  const apiBaseUrl = process.env.BLOG_API_BASE_URL || 'https://danielsaisani.com';
  let queryParams = new URLSearchParams({ documentId: blogId });
  const url = `${apiBaseUrl}/api/blogs?${queryParams.toString()}`;

  console.log(`[getBlog] Attempting to fetch from: ${url}`);
  try {
    const blogResponse = await axios.get(url);
    console.log(`[getBlog] Successfully fetched from: ${url}. Status: ${blogResponse.status}`);
    // It's good practice to check response structure if it can vary
    if (blogResponse.data && blogResponse.data.response && blogResponse.data.response.data !== undefined) {
      return blogResponse.data as BlogResponse;
    } else {
      console.warn(`[getBlog] Unexpected response structure from ${url}:`, JSON.stringify(blogResponse.data, null, 2));
      // Return null or a custom error object that matches expected error structure
      return { response: { data: null } };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[getBlog] Axios error fetching ${url}: ${error.message}. Status: ${error.response?.status}`, error.toJSON());
    } else {
      console.error(`[getBlog] Generic error fetching ${url}:`, error);
    }
    return { response: { data: null } }; // Ensure consistent error response structure
  }
}

async function getAllBlogs() {
  const apiBaseUrl = process.env.BLOG_API_BASE_URL || 'https://danielsaisani.com';
  const url = `${apiBaseUrl}/api/blogs/`;

  console.log(`[getAllBlogs] Attempting to fetch from: ${url}`);
  try {
    const allBlogsResponse = await axios.get(url);
    console.log(`[getAllBlogs] Successfully fetched from: ${url}. Status: ${allBlogsResponse.status}`);
    if (allBlogsResponse.data && allBlogsResponse.data.response && Array.isArray(allBlogsResponse.data.response.data)) {
        return allBlogsResponse.data as BlogsResponse;
    } else {
        console.warn(`[getAllBlogs] Unexpected response structure from ${url}:`, JSON.stringify(allBlogsResponse.data, null, 2));
        return { response: { data: [] } };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[getAllBlogs] Axios error fetching ${url}: ${error.message}. Status: ${error.response?.status}`, error.toJSON());
    } else {
      console.error(`[getAllBlogs] Generic error fetching ${url}:`, error);
    }
    return { response: { data: [] } }; // Ensure consistent error response structure
  }
}

async function getAllUnpublishedBlogs() {
  const apiBaseUrl = process.env.BLOG_API_BASE_URL || 'https://danielsaisani.com';
  const url = `${apiBaseUrl}/api/blogs?status=draft`;

  console.log(`[getAllUnpublishedBlogs] Attempting to fetch from: ${url}`);
  try {
    const allBlogsResponse = await axios.get(url);
    console.log(`[getAllUnpublishedBlogs] Successfully fetched from: ${url}. Status: ${allBlogsResponse.status}`);
    if (allBlogsResponse.data && allBlogsResponse.data.response && Array.isArray(allBlogsResponse.data.response.data)) {
        return allBlogsResponse.data as UnpublishedBlogsResponse;
    } else {
        console.warn(`[getAllUnpublishedBlogs] Unexpected response structure from ${url}:`, JSON.stringify(allBlogsResponse.data, null, 2));
        return { response: { data: [] } };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[getAllUnpublishedBlogs] Axios error fetching ${url}: ${error.message}. Status: ${error.response?.status}`, error.toJSON());
    } else {
      console.error(`[getAllUnpublishedBlogs] Generic error fetching ${url}:`, error);
    }
    return { response: { data: [] } }; // Ensure consistent error response structure
  }
}

// Functions below this line call the ones above, so they benefit from the logging and env var usage indirectly.

async function getAllUnpublishedBlogData() {
  console.log('[getAllUnpublishedBlogData] Starting...');
  let publishedBlogObjects = await getAllBlogs();
  let blogObjects = await getAllUnpublishedBlogs();
  console.log(`[getAllUnpublishedBlogData] Fetched published count: ${publishedBlogObjects?.response?.data?.length || 0}, unpublished count: ${blogObjects?.response?.data?.length || 0}`);

  const data = (blogObjects?.response?.data || []).map((blogObject) => { // Added null checks
    const blogId = blogObject.documentId;
    const slug = blogObject.slug;
    const title = blogObject.title;
    const publishedAt = blogObject.publishedAt;
    const documentId = blogObject.documentId;

    return {
      slug,
      title,
      publishedAt,
      documentId,
    };
  }).filter((blogObject) => {
    return !blogObject.publishedAt && !(publishedBlogObjects?.response?.data || []).map((blog) => blog.documentId).includes(blogObject.documentId); // Added null checks
  });
  console.log(`[getAllUnpublishedBlogData] Filtered to ${data.length} truly unpublished entries.`);
  return data;
}

async function getAllBlogData() {
  console.log('[getAllBlogData] Starting...');
  let blogObjects = await getAllBlogs();
  console.log(`[getAllBlogData] Fetched ${blogObjects?.response?.data?.length || 0} blog metadata entries.`);

  const data = (blogObjects?.response?.data || []).map((blogObject) => { // Added null check
    const blogId = blogObject.documentId;
    const slug = blogObject.slug;
    const publishedAt = blogObject.publishedAt;
    const title = blogObject.title;

    return {
      publishedAt,
      slug,
      title,
      blogId
    };
  });
  return data;
}

async function getBlogData(blogId) {
  console.log(`[getBlogData] Getting full blog data for blogId: ${blogId}`);
  let blogObject = await getBlog(blogId);

  if (!blogObject?.response?.data) { // Added null checks
    console.warn(`[getBlogData] No data found for blogId: ${blogId}`);
    return null;
  }
  console.log(`[getBlogData] Successfully retrieved data for blogId: ${blogId}, title: ${blogObject.response.data.title}`);
  return blogObject.response.data;
}

// Exported functions - these are the main interface for other modules
export async function getBlogPosts() {
  console.log('[getBlogPosts] External API: Fetching all blog posts metadata.');
  try {
    const allBlogs = await getAllBlogData();
    return allBlogs;
  } catch (error) {
    console.error('[getBlogPosts] Error in external API:', error);
    return [];
  }
}

export async function getUnpublishedBlogPosts() {
  console.log('[getUnpublishedBlogPosts] External API: Fetching all unpublished blog posts metadata.');
  try {
    const allUnpublishedBlogs = await getAllUnpublishedBlogData();
    return allUnpublishedBlogs;
  } catch (error) {
    console.error('[getUnpublishedBlogPosts] Error in external API:', error);
    return [];
  }
}

export async function getBlogPost(blogId) {
  console.log(`[getBlogPost] External API: Fetching specific blog post for blogId: ${blogId}`);
  try {
    const blog = await getBlogData(blogId);
    return blog;
  } catch (error) {
    console.error(`[getBlogPost] Error in external API for blogId ${blogId}:`, error);
    return null;
  }
}