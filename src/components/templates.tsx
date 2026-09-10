import Image from "next/image";
import Link from "next/link";
import type { PostWithRelations } from "@/lib/types";
import { ArticleContent } from "./article-content";
import { ShareButtons } from "./share-buttons";
import { ArrowIcon } from "./icons";
import { extractArticleHeadings } from "@/lib/headings";
import { formatDate } from "@/lib/utils";

function ArticleByline({ post }: { post: PostWithRelations }) {
  return <div className="template-byline"><Link href={`/author/${post.author.slug}`} className="byline-author"><Image src={post.author.avatarUrl} alt="" width={40} height={40} /><span><small>Written by</small>{post.author.name}</span></Link><span className="byline-date"><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time><small>{post.readingTime} min read</small></span></div>;
}

function SharedArticle({ post }: { post: PostWithRelations }) {
  const headings = extractArticleHeadings(post.content);
  return <div className="article-reading-layout"><aside className="article-sidebar">{headings.length > 0 && <nav className="inline-toc" aria-label="Table of contents"><strong>In this story</strong>{headings.map((heading, index) => <a key={heading.id} href={`#${heading.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{heading.label}</a>)}</nav>}<ShareButtons title={post.title} /><Link className="back-to-journal text-link" href="/blog"><ArrowIcon /> Back to the journal</Link></aside><div className="article-prose"><ArticleContent html={post.content} /><div className="tag-list">{post.tags.map((tag) => <Link key={tag.id} href={`/tag/${tag.slug}`}>#{tag.name}</Link>)}</div><div className="article-author-bio"><Image src={post.author.avatarUrl} alt="" width={64} height={64} /><div><span className="eyebrow">Behind the story</span><h2><Link href={`/author/${post.author.slug}`}>{post.author.name} ↗</Link></h2><p>{post.author.bio}</p></div></div></div></div>;
}

function ClassicTemplate({ post }: { post: PostWithRelations }) {
  return <article className="template-classic"><div className="template-hero"><div><Link className="eyebrow" href={`/category/${post.category.slug}`}>{post.category.name}</Link><h1>{post.title}</h1><p className="article-dek">{post.excerpt}</p><ArticleByline post={post} /></div><Image src={post.featuredImage.url} alt={post.featuredImage.alt} width={1200} height={1000} preload sizes="(max-width: 900px) 100vw, 600px" /></div><SharedArticle post={post} /></article>;
}

function MagazineTemplate({ post }: { post: PostWithRelations }) {
  return <article className="template-magazine"><div className="magazine-heading"><Link className="eyebrow" href={`/category/${post.category.slug}`}>{post.category.name}</Link><h1>{post.title}</h1><p className="article-dek">{post.excerpt}</p><ArticleByline post={post} /></div><Image className="magazine-cover" src={post.featuredImage.url} alt={post.featuredImage.alt} width={1600} height={800} preload sizes="(max-width: 1280px) 100vw, 1264px" /><SharedArticle post={post} /></article>;
}

function MinimalTemplate({ post }: { post: PostWithRelations }) {
  return <article className="template-minimal"><div className="minimal-heading"><Link className="eyebrow" href={`/category/${post.category.slug}`}>{post.category.name}</Link><h1>{post.title}</h1><p className="article-dek">{post.excerpt}</p><ArticleByline post={post} /></div><Image className="minimal-image" src={post.featuredImage.url} alt={post.featuredImage.alt} width={1200} height={720} preload sizes="(max-width: 1000px) 100vw, 960px" /><SharedArticle post={post} /></article>;
}

export function BlogPostRenderer({ post }: { post: PostWithRelations }) {
  if (post.template === "magazine") return <MagazineTemplate post={post} />;
  if (post.template === "minimal") return <MinimalTemplate post={post} />;
  return <ClassicTemplate post={post} />;
}
