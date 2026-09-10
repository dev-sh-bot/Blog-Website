import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export default function NotFound() { return <><SiteHeader /><main className="container not-found"><span className="eyebrow">404</span><h1>That page took a different route.</h1><p>We couldn’t find the article or page you were looking for.</p><Link className="button button-dark" href="/blog">Back to the journal</Link></main><SiteFooter /></>; }
