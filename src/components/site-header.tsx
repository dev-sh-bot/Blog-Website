import { getSiteSettings } from "@/lib/data";
import { SiteHeaderClient } from "./site-header-client";

export async function SiteHeader() {
  const settings = await getSiteSettings();
  return <SiteHeaderClient siteName={settings.siteName} />;
}
