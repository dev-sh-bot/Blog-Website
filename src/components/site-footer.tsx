import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import { BrandIdentity } from "./brand-identity";
import { ArrowIcon } from "./icons";

export async function SiteFooter() {
  const settings = await getSiteSettings();
  const socialLinks = [
    { label: "X / Twitter", url: settings.socialLinks.twitter },
    { label: "LinkedIn", url: settings.socialLinks.linkedin },
    { label: "Instagram", url: settings.socialLinks.instagram },
  ].filter((link) => link.url);
  return <footer className="site-footer"><div className="container"><div className="footer-top"><Link href="/" className="brand" aria-label={`${settings.siteName} home`}><BrandIdentity siteName={settings.siteName} /></Link><span>Unlocking the World</span><Link className="footer-back-top" href="#" aria-label="Back to top"><ArrowIcon /></Link></div><div className="footer-grid">
    <div className="footer-brand"><h2>Explore beyond the familiar.<br /><em>Unlock the world.</em></h2><p>{settings.siteDescription}</p></div>
    <div><h3>The publication</h3><Link href="/blog">The journal</Link><Link href="/about">Our story</Link><Link href="/contact">Get in touch</Link><Link href="/rss.xml">RSS feed ↗</Link></div>
    <div><h3>Explore</h3><Link href="/category/lifestyle">Lifestyle</Link><Link href="/category/health-wellness">Health & wellness</Link><Link href="/category/travel">Travel</Link><Link href="/category/food-drink">Food & drink</Link><Link href="/category/blogging">Blogging</Link><Link href="/topics">All topics ↗</Link></div>
    {(socialLinks.length > 0 || settings.customLinks.length > 0) && <div><h3>Elsewhere</h3>{socialLinks.map((link) => <a href={link.url} key={link.label} target="_blank" rel="noreferrer">{link.label} ↗</a>)}{settings.customLinks.map((link) => <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>)}</div>}
  </div><div className="footer-bottom"><span>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</span><span><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><span className="footer-signoff"><span className="status-dot" /> Made for curious minds</span></span></div></div></footer>;
}
