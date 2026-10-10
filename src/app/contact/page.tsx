import type { Metadata } from "next";
import { EditorialCallout, EditorialPage } from "@/components/editorial-page";
import { getSiteSettings } from "@/lib/data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact", description: "Contact GeoVaultHQ about story ideas, contributions, partnerships, and corrections.", alternates: { canonical: `${siteUrl}/contact` } };

export default async function ContactPage() { const settings = await getSiteSettings(); return <><SiteHeader /><main><EditorialPage eyebrow="Get in touch" title={<>Have a thoughtful<br />idea to share?</>} intro="We welcome readers, contributors, corrections, questions, and unexpected perspectives from every corner of everyday life.">
  <div className="contact-details"><article><h3>Editorial ideas</h3><p>Tell us what you are exploring, who it might help, and what makes your perspective specific. A short, clear note is the best place to start.</p></article><article><h3>Corrections & feedback</h3><p>If something is inaccurate, unclear, or out of date, include the article link and the detail you would like us to review.</p></article><article><h3>Partnerships</h3><p>Share the purpose, audience, and shape of the collaboration. We consider partnerships carefully so they remain useful and transparent for readers.</p></article><article><h3>Reader notes</h3><p>A recommendation, a question, or a story about how an idea landed with you is always welcome.</p></article></div>
  <p><a className="text-link" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail} ↗</a></p>
  <h2>For contributors</h2><p>Send a short note with a working headline, a paragraph about the idea, and two or three points you would explore. You do not need a finished draft. We are interested in writing about food, travel, wellbeing, creative work, blogging, home, relationships, personal growth, and the everyday choices that connect them.</p>
  <p>Please disclose relevant commercial relationships, credit any sources or images, and avoid sending private health information about yourself or anyone else.</p>
  <EditorialCallout title="Make the first message easy to answer." href="/about" label="Read our approach">The more clearly you describe the reader, the question, and the useful takeaway, the easier it is for us to understand whether the idea belongs in the journal.</EditorialCallout>
</EditorialPage></main><SiteFooter /></>; }
