"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { Taxonomy } from "@/lib/types";
import { ArrowIcon, ChevronDownIcon, SparkIcon } from "./icons";

const links = [["Home", "/"], ["The journal", "/blog"], ["Topics", "/topics"], ["About", "/about"]];

type NavCategory = Pick<Taxonomy, "name" | "slug">;

function CategoryDropdown({ categories, pathname, onNavigate }: { categories: NavCategory[]; pathname: string; onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !dropdownRef.current?.contains(event.target)) setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return <div
    className="nav-categories"
    ref={dropdownRef}
    onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
    onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        event.stopPropagation();
        setOpen(false);
        toggleRef.current?.focus();
      }
    }}
  >
    <button
      ref={toggleRef}
      type="button"
      className={`nav-category-toggle${pathname.startsWith("/category/") ? " active" : ""}`}
      aria-expanded={open}
      aria-controls={menuId}
      onClick={() => setOpen((value) => !value)}
    >Categories<ChevronDownIcon size={16} /></button>
    <ul id={menuId} className="nav-category-menu" hidden={!open}>
      {categories.map(({ name, slug }) => {
        const href = `/category/${slug}`;
        return <li key={slug}><Link
          href={href}
          aria-current={pathname === href ? "page" : undefined}
          onClick={() => { setOpen(false); onNavigate?.(); }}
        >{name}<ArrowIcon size={15} /></Link></li>;
      })}
    </ul>
  </div>;
}

export function SiteHeaderClient({ siteName, categories }: { siteName: string; categories: NavCategory[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const active = (href: string) => href === "/blog" ? pathname.startsWith("/blog") : pathname === href;

  return <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape" && open) { setOpen(false); menuRef.current?.focus(); } }}>
    <div className="container header-inner">
      <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label={`${siteName} home`}><SparkIcon className="brand-symbol" /><span>{siteName}<span className="brand-period">.</span></span></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">{links.map(([label, href]) => <Fragment key={href}>
        <Link href={href} className={active(href) ? "active" : ""} aria-current={active(href) ? "page" : undefined}>{label}</Link>
        {href === "/blog" && categories.length > 0 ? <CategoryDropdown categories={categories} pathname={pathname} /> : null}
      </Fragment>)}</nav>
      <div className="header-actions"><Link className="button button-dark header-subscribe" href="/subscribe" onClick={() => setOpen(false)}>Subscribe <ArrowIcon width="16" height="16" /></Link><button ref={menuRef} className="menu-button" type="button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen((value) => !value)}><span className="sr-only">Toggle navigation</span><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={open ? "m6 6 12 12M6 18 18 6" : "M3 7h18M3 12h18M3 17h18"} /></svg></button></div>
    </div>
    <nav className="mobile-nav container" id="primary-navigation" aria-label="Mobile navigation" hidden={!open}>{links.map(([label, href]) => <Fragment key={href}>
      <Link href={href} aria-current={active(href) ? "page" : undefined} onClick={() => setOpen(false)}>{label}<ArrowIcon /></Link>
      {href === "/blog" && open && categories.length > 0 ? <CategoryDropdown categories={categories} pathname={pathname} onNavigate={() => setOpen(false)} /> : null}
    </Fragment>)}<Link href="/search" onClick={() => setOpen(false)}>Search articles<ArrowIcon /></Link><Link href="/subscribe" onClick={() => setOpen(false)}>Subscribe<ArrowIcon /></Link><Link href="/contact" onClick={() => setOpen(false)}>Get in touch<ArrowIcon /></Link></nav>
  </header>;
}
