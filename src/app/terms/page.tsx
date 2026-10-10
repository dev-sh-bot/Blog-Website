import type { Metadata } from "next";
import { DetailColumns, EditorialCallout, EditorialPage } from "@/components/editorial-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Terms of use", description: "Terms for using the GeoVaultHQ demo publication.", alternates: { canonical: `${siteUrl}/terms` } };

export default function TermsPage() { return <><SiteHeader /><main><EditorialPage eyebrow="Legal / Terms" title={<>Read widely.<br />Use responsibly.</>} intro="These starter terms describe the basic expectations for using the GeoVaultHQ publication and its private editorial tools. They need legal review before launch.">
  <p><strong>Last updated: September 10, 2026.</strong></p><p>By visiting the publication, you agree to use it lawfully and respectfully. The articles are written for general information and conversation; they are not a substitute for professional advice.</p>
  <DetailColumns items={[{ title: "For readers", body: "Use the site for personal, lawful reading. Check important health, financial, legal, travel, or safety information with an appropriate qualified source." }, { title: "For contributors", body: "Only send material you have the right to share. Disclose conflicts, respect privacy, and do not submit confidential personal information about someone else." }, { title: "For administrators", body: "Protect credentials, review permissions, use strong authentication, and keep the CMS, Firebase rules, and dependencies maintained." }]} />
  <h2>Content and copyright</h2><p>GeoVaultHQ’s original text, design, branding, and editorial structure belong to the publication or its licensors. You may link to and quote brief excerpts with appropriate attribution. Reproducing complete articles, images, or author profiles requires permission.</p>
  <h2>Health, travel, and other practical subjects</h2><p>Articles may offer ideas, prompts, or general context. They cannot account for your medical history, accessibility needs, destination conditions, financial position, or legal situation. Use your judgement and seek qualified, current advice before acting on high-stakes information.</p>
  <h2>Availability and changes</h2><p>We may update, correct, suspend, or remove content as the publication develops. A demo environment may contain sample information, external images, or unfinished features and is not a guarantee of production availability.</p>
  <h2>Contact</h2><p>Questions about permissions, corrections, or these terms can be sent through the <a href="/contact">contact page</a>.</p>
  <EditorialCallout title="A useful publication is a shared responsibility." href="/about" label="About our approach">We aim to be clear about what an article can and cannot do. Readers bring their judgement, contributors bring care, and the team keeps the underlying service secure.</EditorialCallout>
</EditorialPage></main><SiteFooter /></>; }
