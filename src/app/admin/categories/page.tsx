import { AdminShell } from "@/components/admin-shell";
import { AdminTaxonomyManager } from "@/components/admin-taxonomy-manager";
import { ensureAdminPage } from "@/lib/admin-page";
import { getCategories } from "@/lib/data";
export const metadata = { title: "Categories", robots: { index: false, follow: false } };
export default async function CategoriesPage() { await ensureAdminPage(); const categories = await getCategories(); return <AdminShell title="Categories" description="Organize the journal around clear subjects."><AdminTaxonomyManager collection="categories" initialItems={categories} /></AdminShell>; }
