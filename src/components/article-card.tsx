import Image from "next/image";
import Link from "next/link";
import type { PostWithRelations } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ArrowIcon } from "./icons";

export function ArticleCard({ post, featured = false }: { post: PostWithRelations; featured?: boolean }) {
  return <article className={featured ? "article-card article-card-featured" : "article-card"}>
    <Link href={`/blog/${post.slug}`} className="card-image"><Image src={post.featuredImage.url} alt={post.featuredImage.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 420px" /><span className="card-image-arrow"><ArrowIcon /></span></Link>
    <div className="card-body"><div className="card-topline"><Link className="eyebrow" href={`/category/${post.category.slug}`}>{post.category.name}</Link><span>{post.readingTime} min read</span></div><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p><div className="card-meta"><Link href={`/author/${post.author.slug}`} className="card-author"><Image src={post.author.avatarUrl} alt="" width={26} height={26} /><span>{post.author.name}</span></Link><time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></div></div>
  </article>;
}
