import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAuthor, getAuthors, getPosts } from "@/lib/data";
import { siteUrl } from "@/lib/config";
import { safeJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateStaticParams() { return (await getAuthors()).map((author) => ({ slug: author.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const author = await getAuthor((await params).slug); return author ? { title: `Articles by ${author.name}`, description: author.bio, alternates: { canonical: `${siteUrl}/author/${author.slug}` } } : { title: "Author not found" }; }
export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) { const author = await getAuthor((await params).slug); if (!author) notFound(); const { posts } = await getPosts({ authorSlug: author.slug, pageSize: 50 }); const personJsonLd = { "@context": "https://schema.org", "@type": "Person", name: author.name, description: author.bio, url: `${siteUrl}/author/${author.slug}`, image: author.avatarUrl }; return <><SiteHeader /><main><section className="page-hero"><div className="container"><span className="eyebrow">Author archive</span><h1>{author.name}</h1><p>{author.bio}</p></div></section><section className="section container"><div className="author-intro"><Image src={author.avatarUrl} alt={author.name} width={88} height={88} /><div><span className="eyebrow">A voice in the journal</span><h2>{author.name}</h2><p>{author.bio} Their archive brings together the questions, observations, and practical ideas they have chosen to explore with readers.</p></div></div><div className="listing-note"><article><h3>{posts.length} published stories</h3><p>Browse this writer’s work by the newest perspective or follow the categories that appear most often.</p></article><article><h3>Read for the voice</h3><p>An author archive is a way to notice patterns, not a promise that every story will answer the same question.</p></article><article><h3>Keep exploring</h3><p>When a story ends, use its topic and related articles to discover another point of view.</p></article></div><div className="author-card"><Image src={author.avatarUrl} alt={author.name} width={72} height={72} /><div><h2>{author.name}</h2><p>{author.bio}</p></div></div><div className="article-grid">{posts.map((post) => <ArticleCard key={post.id} post={post} />)}</div></section></main><SiteFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(personJsonLd) }} /></>; }
