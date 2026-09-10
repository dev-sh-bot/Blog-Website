import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { PostEditor } from "@/components/post-editor";
import { PostActions } from "@/components/post-actions";
import { ensureAdminPage } from "@/lib/admin-page";
import { getAdminPost } from "@/lib/data";
import { getAuthors, getCategories, getTags } from "@/lib/data";
export const metadata = { title: "Edit article", robots: { index: false, follow: false } };
export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) { await ensureAdminPage(); const post = await getAdminPost((await params).id); if (!post) notFound(); const [authors, categories, tags] = await Promise.all([getAuthors(), getCategories(), getTags()]); return <AdminShell title="Edit article" description="Keep the story clear, useful and ready to publish."><PostActions postId={post.id} status={post.status} /><PostEditor post={post} authors={authors} categories={categories} tags={tags} /></AdminShell>; }
