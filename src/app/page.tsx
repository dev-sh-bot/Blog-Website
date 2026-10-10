import type { Metadata } from "next";
import { HomeSections } from "@/components/home-sections";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getPosts, getSiteSettings } from "@/lib/data";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> { const settings = await getSiteSettings(); const title = settings.metaTitle || `${settings.siteName} — Unlocking the World`; const description = settings.metaDescription || settings.siteDescription; return { title: { absolute: title }, description, keywords: settings.seoKeywords, alternates: { canonical: siteUrl }, robots: { index: true, follow: true }, openGraph: { title, description, url: siteUrl, siteName: settings.siteName, type: "website", images: [{ url: settings.defaultOgImage, alt: `${settings.siteName} homepage` }] }, twitter: { card: "summary_large_image", title, description, images: [settings.defaultOgImage] } }; }

export default async function Home() {
  const [{ posts }, categories] = await Promise.all([getPosts({ pageSize: 18 }), getCategories()]);
  return <><SiteHeader /><main><HomeSections posts={posts} categories={categories} /></main><SiteFooter /></>;
}
