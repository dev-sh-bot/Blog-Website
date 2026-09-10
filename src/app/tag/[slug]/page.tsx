import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getTag, getTags, getPosts } from "@/lib/data";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateStaticParams() { return (await getTags()).map((tag) => ({ slug: tag.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const tag = await getTag((await params).slug); return tag ? { title: `Articles tagged ${tag.name}`, description: `Articles tagged with ${tag.name}.`, alternates: { canonical: `${siteUrl}/tag/${tag.slug}` } } : { title: "Tag not found" }; }
export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) { const tag = await getTag((await params).slug); if (!tag) notFound(); const { posts } = await getPosts({ tagSlug: tag.slug, pageSize: 50 }); return <><SiteHeader /><main><section className="page-hero"><div className="container"><span className="eyebrow">Topic</span><h1>{tag.name}</h1><p>Articles tagged with {tag.name}.</p></div></section><section className="section container"><div className="listing-note"><article><h3>A thread through the journal</h3><p>This tag gathers stories that share a subject, mood, method, or recurring question.</p></article><article><h3>Read in any order</h3><p>Begin with the article that catches your attention. There is no required path through the collection.</p></article><article><h3>Find the next thread</h3><p>Use the categories and related tags on each story to keep exploring what interests you.</p></article></div><div className="article-grid">{posts.map((post) => <ArticleCard key={post.id} post={post} />)}</div>{posts.length === 0 && <div className="admin-card"><h2>No articles found</h2><p>We haven’t published anything under this tag yet.</p></div>}</section></main><SiteFooter /></>; }
