export type PostStatus = "draft" | "published" | "scheduled" | "archived";
export type BlogTemplate = "classic" | "magazine" | "minimal";

export type ImageAsset = {
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type MediaRecord = ImageAsset & {
  id: string;
  name: string;
  path: string;
  contentType: string;
  size: number;
  createdAt: string;
};

export type AdminRecord = {
  uid: string;
  email?: string;
  name?: string;
  role: "owner" | "admin" | "editor";
  active: boolean;
};

export type SubscriberRecord = {
  email: string;
  createdAt: string;
  source: string;
};

export type RedirectRecord = {
  from: string;
  to: string;
  createdAt: string;
};

export type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  role?: string;
  socialLinks?: { twitter?: string; linkedin?: string };
};

export type Taxonomy = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

export type SeoFields = {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  focusKeyword?: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: ImageAsset;
  authorId: string;
  categoryId: string;
  tagIds: string[];
  template: BlogTemplate;
  status: PostStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  viewCount: number;
  seo: SeoFields;
  featured?: boolean;
};

export type PostWithRelations = BlogPost & {
  author: Author;
  category: Taxonomy;
  tags: Taxonomy[];
};

export type PostFilters = {
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  search?: string;
  sort?: "newest" | "oldest" | "popular";
  page?: number;
  pageSize?: number;
  cursor?: string;
};

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  metaTitle: string;
  metaDescription: string;
  seoKeywords: string[];
  googleSiteVerification: string;
  contactEmail: string;
  defaultOgImage: string;
  customLinks: CustomSiteLink[];
  socialLinks: {
    twitter: string;
    linkedin: string;
    instagram: string;
    youtube: string;
    facebook: string;
    tiktok: string;
    pinterest: string;
  };
};

export type CustomSiteLink = {
  label: string;
  url: string;
};
