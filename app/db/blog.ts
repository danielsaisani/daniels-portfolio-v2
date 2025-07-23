import axios from 'axios';

// Type Definitions
type Blog = {
  id: number;
  documentId: string;
  slug: string;
  description: string | null;
  author: { name: string };
  publishedAt: string;
  updatedAt: string;
  blocks: { body: string }[];
  title: string;
};

type BlogMetaData = Omit<Blog, 'blocks'>;

type UnpublishedBlog = Omit<Blog, 'blocks'> & {
  publishedAt: string | null;
  blocks: { body: string }[] | null;
};

type UnpublishedBlogsResponse = {
  response: {
    data: UnpublishedBlog[];
  };
};

type BlogsResponse = {
  response: {
    data: BlogMetaData[];
  };
};

type BlogResponse = {
  response: {
    data: Blog;
  };
};

// Centralized API Fetch Function
async function _fetchFromApi<T>(endpoint: string, params: URLSearchParams = new URLSearchParams()): Promise<T | null> {
  const apiBaseUrl = process.env.BLOG_API_BASE_URL || 'https://danielsaisani.com';
  const url = `${apiBaseUrl}/api/blogs${endpoint}?${params.toString()}`;
  
  console.log(`[API] Attempting to fetch from: ${url}`);
  try {
    const response = await axios.get(url);
    console.log(`[API] Successfully fetched from: ${url}. Status: ${response.status}`);
    if (response.data && response.data.response && response.data.response.data !== undefined) {
      return response.data as T;
    } else {
      console.warn(`[API] Unexpected response structure from ${url}:`, JSON.stringify(response.data, null, 2));
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[API] Axios error fetching ${url}: ${error.message}. Status: ${error.response?.status}`, error.toJSON());
    } else {
      console.error(`[API] Generic error fetching ${url}:`, error);
    }
    return null;
  }
}

// Internal Helper Functions
async function _getBlog(blogId: string): Promise<BlogResponse | null> {
  const queryParams = new URLSearchParams({ documentId: blogId });
  return _fetchFromApi<BlogResponse>('/', queryParams);
}

async function _getAllBlogs(): Promise<BlogsResponse | null> {
  return _fetchFromApi<BlogsResponse>('/');
}

async function _getAllUnpublishedBlogs(): Promise<UnpublishedBlogsResponse | null> {
  const queryParams = new URLSearchParams({ status: 'draft' });
  return _fetchFromApi<UnpublishedBlogsResponse>('/', queryParams);
}

async function _getAllUnpublishedBlogData() {
  console.log('[Data] Starting to get all unpublished blog data...');
  const publishedBlogs = await _getAllBlogs();
  const unpublishedBlogs = await _getAllUnpublishedBlogs();
  console.log(`[Data] Fetched published count: ${publishedBlogs?.response?.data?.length || 0}, unpublished count: ${unpublishedBlogs?.response?.data?.length || 0}`);

  const publishedBlogIds = new Set((publishedBlogs?.response?.data || []).map(blog => blog.documentId));
  
  const trulyUnpublished = (unpublishedBlogs?.response?.data || []).filter(blog => 
    !blog.publishedAt && !publishedBlogIds.has(blog.documentId)
  );

  console.log(`[Data] Filtered to ${trulyUnpublished.length} truly unpublished entries.`);
  return trulyUnpublished.map(({ slug, title, publishedAt, documentId }) => ({
    slug,
    title,
    publishedAt,
    documentId,
  }));
}

async function _getAllBlogData() {
  console.log('[Data] Starting to get all blog data...');
  const blogObjects = await _getAllBlogs();
  console.log(`[Data] Fetched ${blogObjects?.response?.data?.length || 0} blog metadata entries.`);

  return (blogObjects?.response?.data || []).map(({ publishedAt, slug, title, documentId: blogId }) => ({
    publishedAt,
    slug,
    title,
    blogId,
  }));
}

async function _getBlogData(blogId: string) {
  console.log(`[Data] Getting full blog data for blogId: ${blogId}`);
  const blogObject = await _getBlog(blogId);

  if (!blogObject?.response?.data) {
    console.warn(`[Data] No data found for blogId: ${blogId}`);
    return null;
  }
  console.log(`[Data] Successfully retrieved data for blogId: ${blogId}, title: ${blogObject.response.data.title}`);
  return blogObject.response.data;
}

// Exported functions - these are the main interface for other modules
export async function getBlogPosts() {
  console.log('[API] External: Fetching all blog posts metadata.');
  try {
    return await _getAllBlogData();
  } catch (error) {
    console.error('[API] Error in getBlogPosts:', error);
    return [];
  }
}

export async function getUnpublishedBlogPosts() {
  console.log('[API] External: Fetching all unpublished blog posts metadata.');
  try {
    return await _getAllUnpublishedBlogData();
  } catch (error) {
    console.error('[API] Error in getUnpublishedBlogPosts:', error);
    return [];
  }
}

export async function getBlogPost(blogId: string) {
  console.log(`[API] External: Fetching specific blog post for blogId: ${blogId}`);
  try {
    return await _getBlogData(blogId);
  } catch (error) {
    console.error(`[API] Error in getBlogPost for blogId ${blogId}:`, error);
    return null;
  }
}