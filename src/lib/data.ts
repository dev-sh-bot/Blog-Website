import "server-only";

import { cache } from "react";
import { FieldPath } from "firebase-admin/firestore";
import { getAdminDb } from "./firebase/admin";
import { siteConfig } from "./config";
import { demoAuthors, demoCategories, demoPosts, demoTags } from "./seed-data";
import type { AdminRecord, Author, BlogPost, CustomSiteLink, MediaRecord, PostFilters, PostWithRelations, SiteSettings, Taxonomy } from "./types";

type RelationContext = { authors: Author[]; categories: Taxonomy[]; tags: Taxonomy[] };

function resolvePost(post: BlogPost, context: RelationContext): PostWithRelations {
  const author = context.authors.find((item) => item.id === post.authorId) ?? demoAuthors.find((item) => item.id === post.authorId) ?? demoAuthors[0];
  const category = context.categories.find((item) => item.id === post.categoryId) ?? demoCategories.find((item) => item.id === post.categoryId) ?? demoCategories[0];
  const tags = post.tagIds.map((id) => context.tags.find((item) => item.id === id) ?? demoTags.find((item) => item.id === id)).filter((tag): tag is Taxonomy => Boolean(tag));
  return { ...post, author, category, tags };
}

function normalizeDate(value: unknown) {
  return value && typeof value === "object" && "toDate" in value && typeof value.toDate === "function" ? (value.toDate() as Date).toISOString() : String(value ?? new Date().toISOString());
}

function normalizePost(raw: Record<string, unknown>): BlogPost {
  return { ...raw, publishedAt: normalizeDate(raw.publishedAt), createdAt: normalizeDate(raw.createdAt), updatedAt: normalizeDate(raw.updatedAt), tagIds: Array.isArray(raw.tagIds) ? raw.tagIds.map(String) : [], seo: (raw.seo as BlogPost["seo"]) ?? {}, featuredImage: (raw.featuredImage as BlogPost["featuredImage"]) ?? { url: "", alt: "" }, viewCount: Number(raw.viewCount ?? 0), readingTime: Number(raw.readingTime ?? 1) } as BlogPost;
}

async function getTaxonomyCollection<T extends { id: string }>(collection: "authors" | "categories" | "tags", fallback: T[]) {
  const db = getAdminDb();
  if (!db) return fallback;
  const snapshot = await db.collection(collection).orderBy("name").limit(500).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T);
}

async function getRelationContext(): Promise<RelationContext> {
  const [authors, categories, tags] = await Promise.all([getTaxonomyCollection("authors", demoAuthors), getTaxonomyCollection("categories", demoCategories), getTaxonomyCollection("tags", demoTags)]);
  return { authors, categories, tags };
}

function isVisible(post: BlogPost) {
  return post.status === "published" && new Date(post.publishedAt).getTime() <= Date.now();
}

async function firestorePosts() {
  const db = getAdminDb();
  if (!db) return null;
  const snapshot = await db.collection("posts").where("status", "==", "published").orderBy("publishedAt", "desc").limit(100).get();
  return snapshot.docs.map((doc) => normalizePost({ id: doc.id, ...doc.data() }));
}

type DecodedCursor = { id?: string; publishedAt?: string };

function encodeCursor(post: BlogPost) {
  return Buffer.from(JSON.stringify({ id: post.id, publishedAt: post.publishedAt })).toString("base64url");
}

function decodeCursor(value?: string): DecodedCursor | null {
  if (!value) return null;
  try {
    const decoded = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as DecodedCursor;
    return decoded.id && decoded.publishedAt ? decoded : null;
  } catch {
    return null;
  }
}

async function firestoreCursorPage(filters: PostFilters, context: RelationContext): Promise<{ posts: PostWithRelations[]; total: number; nextCursor?: string } | null> {
  const db = getAdminDb();
  const pageSize = Math.min(Math.max(filters.pageSize ?? 9, 1), 100);
  const canUseFirestoreCursor = !filters.search && (!filters.sort || filters.sort === "newest") && (!filters.page || filters.page <= 1);
  if (!db || !canUseFirestoreCursor) return null;

  const category = filters.categorySlug ? context.categories.find((item) => item.slug === filters.categorySlug) : undefined;
  const tag = filters.tagSlug ? context.tags.find((item) => item.slug === filters.tagSlug) : undefined;
  const author = filters.authorSlug ? context.authors.find((item) => item.slug === filters.authorSlug) : undefined;
  if ((filters.categorySlug && !category) || (filters.tagSlug && !tag) || (filters.authorSlug && !author)) return null;

  try {
    let query = db.collection("posts")
      .where("status", "==", "published")
      .where("publishedAt", "<=", new Date());
    if (category) query = query.where("categoryId", "==", category.id);
    if (tag) query = query.where("tagIds", "array-contains", tag.id);
    if (author) query = query.where("authorId", "==", author.id);
    query = query.orderBy("publishedAt", "desc").orderBy(FieldPath.documentId(), "desc");

    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;
    if (!total) return null;

    let pageQuery = query;
    const cursor = decodeCursor(filters.cursor);
    if (cursor) pageQuery = pageQuery.startAfter(new Date(cursor.publishedAt!), cursor.id!);
    const snapshot = await pageQuery.limit(pageSize + 1).get();
    const pageDocs = snapshot.docs.slice(0, pageSize);
    const posts = pageDocs.map((doc) => normalizePost({ id: doc.id, ...doc.data() }));
    const nextCursor = snapshot.docs.length > pageSize && posts.length ? encodeCursor(posts[posts.length - 1]) : undefined;
    return { posts: posts.map((post) => resolvePost(post, context)), total, nextCursor };
  } catch {
    return null;
  }
}

export async function getPosts(filters: PostFilters = {}): Promise<{ posts: PostWithRelations[]; total: number; nextCursor?: string }> {
  const context = await getRelationContext();
  if (filters.categorySlug && !context.categories.some((item) => item.slug === filters.categorySlug)) return { posts: [], total: 0 };
  if (filters.tagSlug && !context.tags.some((item) => item.slug === filters.tagSlug)) return { posts: [], total: 0 };
  if (filters.authorSlug && !context.authors.some((item) => item.slug === filters.authorSlug)) return { posts: [], total: 0 };
  const cursorPage = await firestoreCursorPage(filters, context);
  if (cursorPage) return cursorPage;
  let posts = (await firestorePosts()) ?? demoPosts;
  posts = posts.filter(isVisible);
  if (filters.categorySlug) {
    const category = context.categories.find((item) => item.slug === filters.categorySlug);
    if (category) posts = posts.filter((post) => post.categoryId === category.id);
  }
  if (filters.tagSlug) {
    const tag = context.tags.find((item) => item.slug === filters.tagSlug);
    if (tag) posts = posts.filter((post) => post.tagIds.includes(tag.id));
  }
  if (filters.authorSlug) {
    const author = context.authors.find((item) => item.slug === filters.authorSlug);
    if (author) posts = posts.filter((post) => post.authorId === author.id);
  }
  const query = filters.search?.trim().toLowerCase();
  if (query) {
    const terms = query.split(/\s+/).filter(Boolean);
    posts = posts.filter((post) => {
      const haystack = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
  }
  if (filters.sort === "oldest") posts.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  else if (filters.sort === "popular") posts.sort((a, b) => b.viewCount - a.viewCount);
  else posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const total = posts.length;
  const pageSize = filters.pageSize ?? 9;
  let start = (Math.max(1, filters.page ?? 1) - 1) * pageSize;
  if (filters.cursor) {
    try { const cursor = JSON.parse(Buffer.from(filters.cursor, "base64url").toString("utf8")) as { id?: string }; const cursorIndex = cursor.id ? posts.findIndex((post) => post.id === cursor.id) : -1; if (cursorIndex >= 0) start = cursorIndex + 1; } catch { start = 0; }
  }
  const pagePosts = posts.slice(start, start + pageSize);
  const nextCursor = start + pageSize < total && pagePosts.length ? encodeCursor(pagePosts[pagePosts.length - 1]) : undefined;
  return { posts: pagePosts.map((post) => resolvePost(post, context)), total, nextCursor };
}

export async function getAllPublishedPosts(): Promise<PostWithRelations[]> {
  const context = await getRelationContext();
  const db = getAdminDb();
  if (!db) return demoPosts.filter(isVisible).map((post) => resolvePost(post, context));
  try {
    let query = db.collection("posts")
      .where("status", "==", "published")
      .where("publishedAt", "<=", new Date())
      .orderBy("publishedAt", "desc")
      .orderBy(FieldPath.documentId(), "desc");
    const posts: BlogPost[] = [];
    while (true) {
      const snapshot = await query.limit(500).get();
      posts.push(...snapshot.docs.map((doc) => normalizePost({ id: doc.id, ...doc.data() })));
      if (snapshot.size < 500) break;
      query = query.startAfter(snapshot.docs[snapshot.docs.length - 1]);
    }
    return posts.filter(isVisible).map((post) => resolvePost(post, context));
  } catch {
    const posts = (await firestorePosts()) ?? demoPosts;
    return posts.filter(isVisible).map((post) => resolvePost(post, context));
  }
}

export async function getPostBySlug(slug: string) {
  const db = getAdminDb();
  const context = await getRelationContext();
  if (db) {
    const snapshot = await db.collection("posts").where("slug", "==", slug).limit(1).get();
    if (!snapshot.empty) {
      const post = normalizePost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      return isVisible(post) ? resolvePost(post, context) : null;
    }
  }
  if (!db) {
    const post = demoPosts.find((item) => item.slug === slug);
    return post && isVisible(post) ? resolvePost(post, context) : null;
  }
  return null;
}

export async function getRedirect(slug: string) {
  const db = getAdminDb();
  if (!db) return null;
  const redirect = await db.collection("redirects").doc(slug).get();
  if (!redirect.exists) return null;
  const target = redirect.data()?.to;
  return typeof target === "string" && target ? target : null;
}

export async function getCategory(slug: string) { return (await getCategories()).find((item) => item.slug === slug) ?? null; }
export async function getTag(slug: string) { return (await getTags()).find((item) => item.slug === slug) ?? null; }
export async function getAuthor(slug: string) { return (await getAuthors()).find((item) => item.slug === slug) ?? null; }
export async function getCategories() { return getTaxonomyCollection("categories", demoCategories); }
export async function getAuthors() { return getTaxonomyCollection("authors", demoAuthors); }
export async function getTags() { return getTaxonomyCollection("tags", demoTags); }

export async function getAdminPost(id: string) {
  const db = getAdminDb();
  if (db) {
    const doc = await db.collection("posts").doc(id).get();
    if (doc.exists) return normalizePost({ id: doc.id, ...doc.data() });
    return null;
  }
  return demoPosts.find((post) => post.id === id) ?? null;
}

export async function getAdminPosts(): Promise<PostWithRelations[]> {
  const context = await getRelationContext();
  const db = getAdminDb();
  const posts = db ? (await db.collection("posts").orderBy("updatedAt", "desc").limit(500).get()).docs.map((doc) => normalizePost({ id: doc.id, ...doc.data() })) : demoPosts;
  return posts.map((post) => resolvePost(post, context));
}

export async function getAdminCounts() {
  const db = getAdminDb();
  const posts = db ? (await db.collection("posts").limit(500).get()).docs.map((doc) => normalizePost({ id: doc.id, ...doc.data() })) : demoPosts;
  const source = posts;
  const [categories, authors] = await Promise.all([getCategories(), getAuthors()]);
  return { total: source.length, published: source.filter((post) => post.status === "published").length, drafts: source.filter((post) => post.status === "draft").length, scheduled: source.filter((post) => post.status === "scheduled").length, archived: source.filter((post) => post.status === "archived").length, categories: categories.length, authors: authors.length };
}

export async function getMediaAssets(): Promise<MediaRecord[]> {
  const db = getAdminDb();
  if (db) {
    const snapshot = await db.collection("media").orderBy("createdAt", "desc").limit(100).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), createdAt: normalizeDate(doc.data().createdAt) }) as MediaRecord);
  }
  return demoPosts.slice(0, 6).map((post) => ({ id: post.id, ...post.featuredImage, name: post.featuredImage.alt, path: "demo", contentType: "image/jpeg", size: 0, createdAt: post.createdAt }));
}

export async function getAdminUsers(): Promise<AdminRecord[]> {
  const db = getAdminDb();
  if (!db) return [];
  const snapshot = await db.collection("admins").limit(200).get();
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    const role = data.role === "owner" || data.role === "admin" || data.role === "editor" ? data.role : "editor";
    return { uid: doc.id, email: typeof data.email === "string" ? data.email : "", name: typeof data.name === "string" ? data.name : "", role, active: data.active === true };
  }).sort((left, right) => (left.email || left.uid).localeCompare(right.email || right.uid));
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const db = getAdminDb();
  if (!db) return siteConfig;
  const doc = await db.collection("settings").doc("site").get();
  const data = (doc.exists ? doc.data() : {}) as Partial<SiteSettings>;
  return {
    ...siteConfig,
    ...data,
    metaTitle: typeof data.metaTitle === "string" ? data.metaTitle : siteConfig.metaTitle,
    metaDescription: typeof data.metaDescription === "string" ? data.metaDescription : siteConfig.metaDescription,
    seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords.filter((keyword): keyword is string => typeof keyword === "string") : siteConfig.seoKeywords,
    googleSiteVerification: typeof data.googleSiteVerification === "string" ? data.googleSiteVerification : siteConfig.googleSiteVerification,
    customLinks: Array.isArray(data.customLinks) ? data.customLinks.filter((link): link is CustomSiteLink => typeof link === "object" && link !== null && "label" in link && typeof link.label === "string" && "url" in link && typeof link.url === "string") : siteConfig.customLinks,
    socialLinks: { ...siteConfig.socialLinks, ...(data.socialLinks ?? {}) },
  };
});
