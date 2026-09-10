import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { SearchForm } from "@/components/search-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Search articles", robots: { index: false, follow: true } };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; cursor?: string }> }) { const params = await searchParams; const q = params.q ?? ""; const { posts, total, nextCursor } = await getPosts({ search: q, cursor: params.cursor, pageSize: 12 }); const nextHref = nextCursor ? `/search?q=${encodeURIComponent(q)}&cursor=${encodeURIComponent(nextCursor)}` : null; return <><SiteHeader /><main><section className="page-hero"><div className="container"><span className="eyebrow">Search the journal</span><h1>{q ? `Results for “${q}”` : "Find your next read."}</h1><p>{q ? `${total} article${total === 1 ? "" : "s"} found.` : "Search practical guides, ideas and insights."}</p><SearchForm /></div></section><section className="section container"><div className="listing-note"><article><h3>Search by curiosity</h3><p>Try a subject, feeling, place, activity, or question.</p></article><article><h3>Use a few words</h3><p>Short phrases can help the journal surface a more focused set of stories.</p></article><article><h3>Keep exploring</h3><p>If there is no match, browse the full journal and start somewhere else.</p></article></div>{posts.length ? <div className="article-grid">{posts.map((post) => <ArticleCard key={post.id} post={post} />)}</div> : <div className="admin-card"><h2>No results</h2><p>Try a different keyword or browse the latest articles.</p></div>}{nextHref && <div className="load-more"><Link className="button button-light" href={nextHref}>Load more results ↗</Link></div>}</section></main><SiteFooter /></>; }
