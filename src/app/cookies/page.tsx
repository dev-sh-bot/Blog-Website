import type { Metadata } from "next";
import { DetailColumns, EditorialCallout, EditorialPage } from "@/components/editorial-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Cookie policy", description: "How cookies and similar technologies are intended to work on Insightly.", alternates: { canonical: `${siteUrl}/cookies` } };

export default function CookiesPage() { return <><SiteHeader /><main><EditorialPage eyebrow="Legal / Cookies" title={<>Small files.<br />Clear choices.</>} intro="This starter page explains the intended use of cookies and browser storage in the Insightly publication. Update it when you choose your final hosting and analytics services.">
  <p><strong>Last updated: September 10, 2026.</strong></p><p>A cookie is a small value saved by a browser. Similar technologies include local storage, session storage, pixels, and server-side identifiers. They can help a site remember a session or understand how a page is used.</p>
  <DetailColumns items={[{ title: "Essential", body: "Authentication and security cookies may be required for admin users to sign in and keep a protected session active." }, { title: "Preferences", body: "A future production version may remember choices such as display preferences only when those choices are implemented and explained." }, { title: "Analytics", body: "Optional measurement should remain disabled in the dummy preview. If enabled later, document the provider, purpose, retention, and opt-out path." }]} />
  <h2>Current demo behaviour</h2><p>There is no Firebase connection in this preview. The public site does not require a reader account, and the newsletter form returns a demo confirmation without saving an email address.</p>
  <h2>Managing cookies</h2><p>Most browsers let you inspect, block, or delete cookies through their privacy settings. Blocking essential cookies may prevent the protected admin area from working. Your browser’s help documentation explains the controls available on your device.</p>
  <h2>Third-party content</h2><p>External images and links may be served by or lead to another provider with its own policies. Before public launch, review remote image hosting, analytics, video embeds, and social sharing behaviour.</p>
  <EditorialCallout title="Choose the smallest useful setup." href="/privacy" label="Read privacy policy">A clear cookie notice should reflect the actual tools on the site. Avoid listing a provider or purpose until it has really been added and configured.</EditorialCallout>
</EditorialPage></main><SiteFooter /></>; }
