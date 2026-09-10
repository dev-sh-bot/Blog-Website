import { AdminShell } from "@/components/admin-shell";
import { SettingsEditor } from "@/components/settings-editor";
import { ensureAdminPage } from "@/lib/admin-page";
import { getSiteSettings } from "@/lib/data";
export const metadata = { title: "Settings", robots: { index: false, follow: false } };
export default async function SettingsPage() { await ensureAdminPage(); const settings = await getSiteSettings(); return <AdminShell title="Settings" description="Shape the publication defaults used across the site."><SettingsEditor initialSettings={settings} /></AdminShell>; }
