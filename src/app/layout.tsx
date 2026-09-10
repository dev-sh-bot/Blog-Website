import type { Metadata } from "next";
import "./globals.css";
import { ScrollToTop } from "@/components/scroll-to-top";
import { getSiteSettings } from "@/lib/data";
import { siteUrl } from "@/lib/config";
import { safeJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return { metadataBase: new URL(siteUrl), title: { default: settings.siteName, template: `%s | ${settings.siteName}` }, description: settings.metaDescription || settings.siteDescription, applicationName: settings.siteName, authors: [{ name: settings.siteName }], keywords: settings.seoKeywords, icons: { icon: "/favicon.ico" }, openGraph: { title: settings.siteName, description: settings.metaDescription || settings.siteDescription, url: siteUrl, siteName: settings.siteName, type: "website", images: [{ url: settings.defaultOgImage, alt: `${settings.siteName} homepage` }] }, twitter: { card: "summary_large_image", title: settings.siteName, description: settings.metaDescription || settings.siteDescription, images: [settings.defaultOgImage] }, verification: settings.googleSiteVerification ? { google: settings.googleSiteVerification } : undefined };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const organizationJsonLd = { "@context": "https://schema.org", "@type": "Organization", name: settings.siteName, url: siteUrl, description: settings.siteDescription, sameAs: [...Object.values(settings.socialLinks), ...settings.customLinks.map((link) => link.url)].filter(Boolean) };
  const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: settings.siteName, url: siteUrl, potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } };
  return <html lang="en" suppressHydrationWarning><body><ScrollToTop />{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }} /></body></html>;
}
