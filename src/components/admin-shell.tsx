"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRightIcon,
  DashboardIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  LogOutIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PlusIcon,
  SettingsIcon,
  ShieldIcon,
  TagIcon,
  UsersIcon,
} from "./icons";
import { classNames } from "@/lib/utils";
import { BrandIdentity } from "./brand-identity";

const nav = [
  { label: "Overview", href: "/admin", icon: DashboardIcon },
  { label: "Posts", href: "/admin/posts", icon: FileTextIcon },
  { label: "Categories", href: "/admin/categories", icon: FolderIcon },
  { label: "Tags", href: "/admin/tags", icon: TagIcon },
  { label: "Authors", href: "/admin/authors", icon: UsersIcon },
  { label: "Media library", href: "/admin/media", icon: ImageIcon },
  { label: "Administrators", href: "/admin/admins", icon: ShieldIcon },
  { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
] as const;

export function AdminShell({ children, title, description }: { children: ReactNode; title: string; description?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem("insightly-admin-sidebar") !== "collapsed") return;
    const frame = window.requestAnimationFrame(() => setSidebarCollapsed(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("insightly-admin-sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="admin-page">
      <div className={classNames("admin-shell", sidebarCollapsed && "sidebar-collapsed")}>
        <aside className="admin-sidebar">
          <div className="admin-sidebar-inner">
            <div className="admin-brand-block">
              <div className="admin-brand-row">
                <Link href="/" className="brand">
                  <BrandIdentity siteName="GeoVaultHQ" />
                </Link>
                <button
                  className="admin-sidebar-toggle"
                  type="button"
                  onClick={toggleSidebar}
                  data-navigation-guard-ignore="true"
                  aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                  aria-expanded={!sidebarCollapsed}
                  title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  {sidebarCollapsed ? <PanelLeftOpenIcon size={16} /> : <PanelLeftCloseIcon size={16} />}
                </button>
              </div>
              <span className="admin-workspace-label">Editorial workspace</span>
            </div>

            <nav className="admin-nav" aria-label="Admin navigation">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} className={classNames(active && "active")} aria-current={active ? "page" : undefined}>
                    <span className="admin-nav-icon"><Icon size={17} /></span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="admin-sidebar-footer">
              <Link className="admin-view-site" href="/">
                <ArrowUpRightIcon size={16} />
                <span>View live site</span>
              </Link>
              <button className="admin-logout" type="button" onClick={logout}>
                <LogOutIcon size={17} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="admin-main">
          <div className="admin-topbar">
            <div className="admin-page-heading">
              <span className="admin-topbar-label">GeoVaultHQ CMS <span>/</span> {title}</span>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            {pathname === "/admin/posts" && (
              <Link className="button button-dark admin-primary-action" href="/admin/posts/new">
                <PlusIcon size={17} />
                <span>New article</span>
              </Link>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
