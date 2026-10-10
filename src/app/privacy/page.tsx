import type { Metadata } from "next";
import { DetailColumns, EditorialCallout, EditorialPage } from "@/components/editorial-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Privacy policy", description: "How the GeoVaultHQ demo handles information.", alternates: { canonical: `${siteUrl}/privacy` } };

export default function PrivacyPage() { return <><SiteHeader /><main><EditorialPage eyebrow="Legal / Privacy" title={<>Your information<br />should stay yours.</>} intro="This starter policy explains the intended data boundaries for the local GeoVaultHQ preview. Replace it with counsel-reviewed language before a public launch.">
  <p><strong>Last updated: September 10, 2026.</strong></p><p>GeoVaultHQ is currently a dummy-data demonstration. No Firebase project is connected, and newsletter submissions return a preview response rather than being stored. The sections below describe the intended product behaviour once services are configured.</p>
  <DetailColumns items={[{ title: "What we collect", body: "A newsletter email address when a reader chooses to subscribe, plus the account and activity information needed to protect the private admin area." }, { title: "Why we use it", body: "To send publication updates, operate the CMS, prevent abuse, respond to requests, and understand whether the service is working as intended." }, { title: "What we do not do", body: "We do not sell subscriber information or use a reader’s email address for unrelated advertising without clear permission." }]} />
  <h2>Information you provide</h2><p>If you contact the publication, we receive the information in your message and the address needed to reply. If you subscribe after Firebase is configured, the email address will be stored in the project’s subscriber collection with a timestamp and source label.</p>
  <h2>Technical information</h2><p>Hosting providers, security systems, and analytics tools may process basic technical information such as request time, browser type, approximate location, and error details. The final implementation should document the actual providers and retention periods used.</p>
  <h2>Cookies and local storage</h2><p>Essential session cookies may be used for authenticated administration. Optional analytics should remain disabled until explicitly configured. See the <a href="/cookies">cookie policy</a> for the starter behaviour.</p>
  <h2>Choices and requests</h2><p>You may ask what information is held about you, request correction, or ask for deletion where applicable. Contact <a href="/contact">the editorial team</a> and include enough detail for us to find the relevant record.</p>
  <EditorialCallout title="Privacy depends on the final setup." href="/contact" label="Ask a question">Before launch, confirm Firebase rules, hosting logs, analytics settings, email provider behaviour, retention periods, and the jurisdiction-specific notices your publication needs.</EditorialCallout>
</EditorialPage></main><SiteFooter /></>; }
