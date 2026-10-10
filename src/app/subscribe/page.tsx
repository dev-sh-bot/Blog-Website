import type { Metadata } from "next";
import { DetailColumns, EditorialCallout, EditorialPage } from "@/components/editorial-page";
import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Subscribe", description: "Subscribe to the GeoVaultHQ weekly dispatch for stories that open up a wider view of the world.", alternates: { canonical: `${siteUrl}/subscribe` } };

export default function SubscribePage() {
  return <><SiteHeader /><main><EditorialPage eyebrow="The weekly perspective" title={<>Good reads.<br /><em>Worth making room for.</em></>} intro="A calm, considered edit of stories about living well, going somewhere new, finding your voice, and staying curious.">
    <section className="subscribe-panel"><div><span className="eyebrow">Join the list</span><h2>Make space for a fresh perspective.</h2><p>Enter your email and we’ll keep the best of the journal close by. In this demo preview, no email address is saved until Firebase is configured.</p></div><NewsletterForm /></section>
    <DetailColumns items={[{ title: "A thoughtful edit", body: "One small collection of the stories, ideas, and practical details that deserve a little more time." }, { title: "A general-interest mix", body: "Expect wellbeing, travel, food, home, blogging, culture, personal growth, and more." }, { title: "Easy to leave", body: "The real publication will include a clear unsubscribe option. No noisy promises, no unnecessary pressure." }]} />
    <h2>What arrives in your inbox</h2><p>The newsletter is designed to feel more like a note from a thoughtful editor than another stream of alerts. It may point you to a practical guide, a quiet essay, a useful question, or a story that changes how you see an ordinary part of the day.</p><p>We’ll keep the sample content broad and human: a recipe worth repeating, a place worth taking slowly, a writing idea, a wellbeing reflection, or a perspective on the tools that shape everyday life.</p>
    <EditorialCallout title="Curiosity is a good reason to subscribe." href="/topics" label="Explore topics">If email is not your thing, the full journal is always here. Browse topics at your own pace and return whenever you feel like reading something different.</EditorialCallout>
  </EditorialPage></main><SiteFooter /></>;
}
