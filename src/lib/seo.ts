import type { Metadata } from "next";
import { siteConfig, siteUrl } from "./config";
import type { PostWithRelations } from "./types";

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function postMetadata(post: PostWithRelations, siteName = siteConfig.siteName): Metadata {
  const title = post.seo.title ?? `${post.title} | ${siteName}`;
  const description = post.seo.description ?? post.excerpt;
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: post.seo.canonical || url },
    openGraph: { title: post.seo.ogTitle ?? title, description: post.seo.ogDescription ?? description, url, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt, authors: [post.author.name], images: [{ url: post.seo.ogImage ?? post.featuredImage.url, alt: post.featuredImage.alt }] },
    twitter: { card: post.seo.twitterCard ?? "summary_large_image", title, description, images: [post.seo.ogImage ?? post.featuredImage.url] },
  };
}

export function articleJsonLd(post: PostWithRelations, siteName = siteConfig.siteName) {
  return { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, image: [post.featuredImage.url], datePublished: post.publishedAt, dateModified: post.updatedAt, mainEntityOfPage: `${siteUrl}/blog/${post.slug}`, author: { "@type": "Person", name: post.author.name, url: `${siteUrl}/author/${post.author.slug}` }, publisher: { "@type": "Organization", name: siteName, url: siteUrl } };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })) };
}
