import { AdminShell } from "@/components/admin-shell";
import { AdminTaxonomyManager } from "@/components/admin-taxonomy-manager";
import { ensureAdminPage } from "@/lib/admin-page";
import { getAuthors } from "@/lib/data";
export const metadata = { title: "Authors", robots: { index: false, follow: false } };
export default async function AuthorsPage() { await ensureAdminPage(); const authors = await getAuthors(); return <AdminShell title="Authors" description="Give every perspective a clear byline."><AdminTaxonomyManager collection="authors" initialItems={authors} /></AdminShell>; }
