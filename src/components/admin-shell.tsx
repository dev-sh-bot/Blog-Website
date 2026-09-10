"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { classNames } from "@/lib/utils";

const nav = [["Overview", "/admin"], ["Posts", "/admin/posts"], ["Categories", "/admin/categories"], ["Tags", "/admin/tags"], ["Authors", "/admin/authors"], ["Media library", "/admin/media"], ["Administrators", "/admin/admins"], ["Settings", "/admin/settings"]];

export function AdminShell({ children, title, description }: { children: ReactNode; title: string; description?: string }) {
  const pathname = usePathname(); const router = useRouter();
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); router.push("/admin/login"); }
  return <div className="admin-page"><div className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">I</span><span>Insightly</span></Link><nav className="admin-nav" aria-label="Admin navigation">{nav.map(([label, href]) => <Link key={href} href={href} className={classNames(pathname === href && "active")} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav><button className="admin-logout" type="button" onClick={logout}>Sign out</button></aside><main className="admin-main"><div className="admin-topbar"><div><span className="eyebrow">Insightly CMS</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{pathname === "/admin/posts" && <Link className="button button-dark" href="/admin/posts/new">New article <span>＋</span></Link>}</div>{children}</main></div></div>;
}
