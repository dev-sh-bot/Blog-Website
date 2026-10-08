import { getCategories, getSiteSettings } from "@/lib/data";
import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]);
  const navCategories = categories.slice(0, 6).map(({ name, slug }) => ({ name, slug }));
  return <SiteHeaderClient siteName={settings.siteName} categories={navCategories} />;
}
