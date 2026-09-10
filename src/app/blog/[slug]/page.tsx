import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReadingProgress } from "@/components/reading-progress";
import { ViewTracker } from "@/components/view-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BlogPostRenderer } from "@/components/templates";
import { getPostBySlug, getPosts, getRedirect, getSiteSettings } from "@/lib/data";
import { articleJsonLd, breadcrumbJsonLd, postMetadata, safeJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const post = await getPostBySlug((await params).slug); if (!post) return { title: "Article not found" }; const settings = await getSiteSettings(); return postMetadata(post, settings.siteName); }

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const post = await getPostBySlug(slug);
  if (!post) {
    const redirect = await getRedirect(slug);
    if (redirect) permanentRedirect(`/blog/${redirect}`);
    notFound();
  }
  const settings = await getSiteSettings();
  const related = (await getPosts({ categorySlug: post.category.slug, pageSize: 4 })).posts.filter((item) => item.id !== post.id).slice(0, 3);
  const breadcrumbs = [{ name: "Home", url: siteUrl }, { name: post.category.name, url: `${siteUrl}/category/${post.category.slug}` }, { name: post.title, url: `${siteUrl}/blog/${post.slug}` }];
  return <><ReadingProgress /><ViewTracker postId={post.id} /><SiteHeader /><main className="article-page"><div className="container"><Breadcrumbs items={[{ label: post.category.name, href: `/category/${post.category.slug}` }, { label: post.title }]} /><div className="article-renderer"><BlogPostRenderer post={post} /></div></div></main>{related.length > 0 && <section className="related-section"><div className="container"><h2>You may also like</h2><div className="article-grid">{related.map((item) => <ArticleCard key={item.id} post={item} />)}</div></div></section>}<SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd(post, settings.siteName)) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd(breadcrumbs)) }} /></>;
}
