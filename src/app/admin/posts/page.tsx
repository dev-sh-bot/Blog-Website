import { AdminShell } from "@/components/admin-shell";
import { PostActions } from "@/components/post-actions";
import { ensureAdminPage } from "@/lib/admin-page";
import { getAdminPosts } from "@/lib/data";
export const metadata = { title: "Posts", robots: { index: false, follow: false } };
export default async function AdminPostsPage() { await ensureAdminPage(); const posts = await getAdminPosts(); return <AdminShell title="Posts" description="Create, review and publish your editorial queue."><div className="admin-card"><table className="admin-table"><thead><tr><th>Article</th><th>Author</th><th>Category</th><th>Status</th><th>Actions</th></tr></thead><tbody>{posts.map((post) => <tr key={post.id}><td><strong>{post.title}</strong><br /><small>{post.slug}</small></td><td>{post.author.name}</td><td>{post.category.name}</td><td><span className="status-pill">{post.status}</span></td><td><PostActions postId={post.id} status={post.status} /></td></tr>)}</tbody></table></div></AdminShell>; }
