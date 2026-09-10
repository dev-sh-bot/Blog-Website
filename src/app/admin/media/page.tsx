import { AdminShell } from "@/components/admin-shell";
import { MediaLibrary } from "@/components/media-library";
import { ensureAdminPage } from "@/lib/admin-page";
import { getMediaAssets } from "@/lib/data";
export const metadata = { title: "Media library", robots: { index: false, follow: false } };
export default async function MediaPage() { await ensureAdminPage(); const assets = await getMediaAssets(); return <AdminShell title="Media library" description="Keep your visual library tidy and searchable."><MediaLibrary initialAssets={assets} /></AdminShell>; }
