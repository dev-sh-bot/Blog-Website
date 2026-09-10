import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getCategory, getPosts } from "@/lib/data";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateStaticParams() { return (await getCategories()).map((category) => ({ slug: category.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const category = await getCategory((await params).slug); return category ? { title: `${category.name} articles`, description: category.description, alternates: { canonical: `${siteUrl}/category/${category.slug}` } } : { title: "Category not found" }; }
export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) { const slug = (await params).slug; const category = await getCategory(slug); if (!category) notFound(); const query = await searchParams; const page = Number(query.page ?? 1) || 1; const { posts, total } = await getPosts({ categorySlug: slug, page, pageSize: 9 }); const pages = Math.ceil(total / 9); return <><SiteHeader /><main><div className="container"><Breadcrumbs items={[{ label: "Categories", href: "/blog" }, { label: category.name }]} /></div><section className="page-hero"><div className="container"><span className="eyebrow">Explore a subject</span><h1>{category.name}</h1><p>{category.description}</p></div></section><section className="section container"><div className="listing-note"><article><h3>What this section is about</h3><p>{category.description} Follow the stories that feel useful now, and return when your interests change.</p></article><article><h3>How to browse</h3><p>Start with the newest article, then use each story’s tags and related reading to follow a smaller question.</p></article><article><h3>Keep an open mind</h3><p>A category is a doorway, not a limit. Many of the best ideas connect this subject to another part of life.</p></article></div><div className="section-heading"><div><span className="eyebrow">{total} stories</span><h2>Latest {category.name} articles</h2></div></div>{posts.length ? <div className="article-grid">{posts.map((post) => <ArticleCard key={post.id} post={post} />)}</div> : <div className="admin-card"><h2>No articles yet</h2><p>Check back soon for new stories in this category.</p></div>}{pages > 1 && <div className="pagination">{Array.from({ length: pages }, (_, index) => index + 1).map((item) => <Link key={item} className={item === page ? "active" : ""} href={`/category/${slug}?page=${item}`}>{item}</Link>)}</div>}</section></main><SiteFooter /></>; }
