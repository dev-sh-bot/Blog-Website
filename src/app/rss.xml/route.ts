import { getPosts, getSiteSettings } from "@/lib/data";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

const escapeXml = (value: string) => value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] ?? character);

export async function GET() {
  const { posts } = await getPosts({ pageSize: 20 });
  const settings = await getSiteSettings();
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(settings.siteName)}</title><link>${escapeXml(siteUrl)}</link><description>${escapeXml(settings.siteDescription)}</description>${posts.map((post) => `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(`${siteUrl}/blog/${post.slug}`)}</link><guid>${escapeXml(`${siteUrl}/blog/${post.slug}`)}</guid><description>${escapeXml(post.excerpt)}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><author>${escapeXml(post.author.name)}</author><category>${escapeXml(post.category.name)}</category></item>`).join("")}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=3600" } });
}
