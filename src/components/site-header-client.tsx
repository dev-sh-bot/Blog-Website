"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowIcon, SparkIcon } from "./icons";

const links = [["Home", "/"], ["The journal", "/blog"], ["Topics", "/topics"], ["About", "/about"]];

export function SiteHeaderClient({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const active = (href: string) => href === "/blog" ? pathname.startsWith("/blog") : pathname === href;

  return <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape" && open) { setOpen(false); menuRef.current?.focus(); } }}>
    <div className="container header-inner">
      <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label={`${siteName} home`}><SparkIcon className="brand-symbol" /><span>{siteName}<span className="brand-period">.</span></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, href]) => <Link key={href} href={href} className={active(href) ? "active" : ""} aria-current={active(href) ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="header-actions"><Link className="button button-dark header-subscribe" href="/subscribe" onClick={() => setOpen(false)}>Subscribe <ArrowIcon width="16" height="16" /></Link><button ref={menuRef} className="menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}><span className="sr-only">Toggle navigation</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={open ? "m6 6 12 12M6 18 18 6" : "M3 7h18M3 12h18M3 17h18"} /></svg></button></div>
    </div>
    <nav className="mobile-nav container" id="primary-navigation" aria-label="Mobile navigation" hidden={!open}>{links.map(([label, href]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined} onClick={() => setOpen(false)}>{label}<ArrowIcon /></Link>)}<Link href="/search" onClick={() => setOpen(false)}>Search articles<ArrowIcon /></Link><Link href="/subscribe" onClick={() => setOpen(false)}>Subscribe<ArrowIcon /></Link><Link href="/contact" onClick={() => setOpen(false)}>Get in touch<ArrowIcon /></Link></nav>
  </header>;
}
