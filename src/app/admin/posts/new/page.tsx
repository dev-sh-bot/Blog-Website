import { AdminShell } from "@/components/admin-shell";
import { PostEditor } from "@/components/post-editor";
import { ensureAdminPage } from "@/lib/admin-page";
import { getAuthors, getCategories, getTags } from "@/lib/data";
export const metadata = { title: "New article", robots: { index: false, follow: false } };
export default async function NewPostPage() { await ensureAdminPage(); const [authors, categories, tags] = await Promise.all([getAuthors(), getCategories(), getTags()]); return <AdminShell title="New article" description="Shape an idea into something useful."><PostEditor authors={authors} categories={categories} tags={tags} /></AdminShell>; }
