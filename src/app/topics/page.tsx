import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { EditorialCallout } from "@/components/editorial-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories } from "@/lib/data";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Topics", description: "Browse GeoVaultHQ stories by place, culture, travel, nature, and the ideas that connect us.", alternates: { canonical: `${siteUrl}/topics` } };

export default async function TopicsPage() {
  const categories = await getCategories();
  return <><SiteHeader /><main><section className="topics-hero"><div className="container"><span className="eyebrow"><span className="status-dot" /> The whole journal</span><h1>Find a subject.<br /><em>Follow it somewhere.</em></h1><p>GeoVaultHQ is a journal for following curiosity across places and perspectives. Browse by topic and let your next story open a new view of the world.</p></div></section><section className="section topics-directory container"><div className="topics-directory-heading"><div><span className="eyebrow">{categories.length} ways in</span><h2>Choose your curiosity<span className="heading-dot">.</span></h2></div><p>Each topic is a starting point. Articles often cross paths, because the things we care about rarely stay in one category.</p></div><div className="topics-grid">{categories.map((category, index) => <Link className="topic-card" key={category.slug} href={`/category/${category.slug}`}><span className="topic-card-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{category.name}<ArrowIcon /></h3><p>{category.description}</p></div><span className="topic-card-link">Explore stories ↗</span></Link>)}</div><EditorialCallout title="Not sure where to begin?" href="/blog" label="See latest stories">Start with the journal, choose the headline that catches you, and use its category and tags to keep moving through the site.</EditorialCallout></section></main><SiteFooter /></>;
}
