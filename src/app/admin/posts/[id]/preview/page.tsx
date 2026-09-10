import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { BlogPostRenderer } from "@/components/templates";
import { ensureAdminPage } from "@/lib/admin-page";
import { getAdminPost } from "@/lib/data";
import { getAuthor, getCategory, getTags } from "@/lib/data";
export const metadata = { title: "Preview article", robots: { index: false, follow: false } };
export default async function PreviewPostPage({ params }: { params: Promise<{ id: string }> }) { await ensureAdminPage(); const post = await getAdminPost((await params).id); if (!post) notFound(); const [categoryRecord, authorRecord, allTags] = await Promise.all([getCategory(post.categoryId), getAuthor(post.authorId), getTags()]); const category = categoryRecord ?? { id: post.categoryId, name: post.categoryId, slug: post.categoryId }; const author = authorRecord ?? { id: post.authorId, name: post.authorId, slug: post.authorId, bio: "", avatarUrl: "" }; const tags = allTags.filter((tag) => post.tagIds.includes(tag.id)); return <AdminShell title="Preview" description="This preview is private and excluded from search engines."><div className="admin-card"><BlogPostRenderer post={{ ...post, category, author, tags }} /></div></AdminShell>; }
