import { AdminShell } from "@/components/admin-shell";
import { AdminTaxonomyManager } from "@/components/admin-taxonomy-manager";
import { ensureAdminPage } from "@/lib/admin-page";
import { getTags } from "@/lib/data";
export const metadata = { title: "Tags", robots: { index: false, follow: false } };
export default async function TagsPage() { await ensureAdminPage(); const tags = await getTags(); return <AdminShell title="Tags" description="Add useful labels without creating noise."><AdminTaxonomyManager collection="tags" initialItems={tags} /></AdminShell>; }
